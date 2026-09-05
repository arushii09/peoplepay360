from datetime import date, datetime
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.models import Attendance, AttendanceStatus, Employee
from app.schemas.schemas import (
    AttendanceCreate,
    AttendancePayrollSummary,
    AttendanceUpdate,
)


def create_attendance(db: Session, payload: AttendanceCreate) -> Attendance:
    """
    Creates a new daily attendance record for an employee.
    Enforces:
    - Employee existence
    - One record per employee per day
    - check_out >= check_in
    - Non-negative worked and overtime hours
    - Automatic hour calculation if check_in/out provided without hours
    """
    # 1. Validate employee exists
    employee = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {payload.employee_id} not found"
        )

    # 2. Prevent duplicate attendance on same date
    existing = db.query(Attendance).filter(
        Attendance.employee_id == payload.employee_id,
        Attendance.date == payload.date
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Attendance record already exists for employee {payload.employee_id} on {payload.date}"
        )

    # 3. Validate times
    if payload.check_out is not None and payload.check_out < payload.check_in:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="check_out time cannot be earlier than check_in time"
        )

    worked_hours = payload.worked_hours
    overtime_hours = payload.overtime_hours

    # 4. Auto-calculate hours if omitted and check_out is provided
    if worked_hours is None and payload.check_out is not None:
        total_seconds = (payload.check_out - payload.check_in).total_seconds()
        diff_hours = round(max(0.0, total_seconds / 3600.0), 2)
        if diff_hours > 8.0:
            worked_hours = 8.0
            if overtime_hours is None:
                overtime_hours = round(diff_hours - 8.0, 2)
        else:
            worked_hours = diff_hours
            if overtime_hours is None:
                overtime_hours = 0.0
    else:
        worked_hours = worked_hours if worked_hours is not None else 0.0
        overtime_hours = overtime_hours if overtime_hours is not None else 0.0

    # 5. Non-negative validation
    if worked_hours < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="worked_hours cannot be negative"
        )
    if overtime_hours < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="overtime_hours cannot be negative"
        )

    # 6. Status determination
    attendance_status = payload.status
    if not attendance_status:
        if overtime_hours > 0:
            attendance_status = AttendanceStatus.OVERTIME
        else:
            attendance_status = AttendanceStatus.NORMAL

    new_attendance = Attendance(
        employee_id=payload.employee_id,
        date=payload.date,
        check_in=payload.check_in,
        check_out=payload.check_out,
        worked_hours=worked_hours,
        overtime_hours=overtime_hours,
        status=attendance_status,
        notes=payload.notes
    )
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    return new_attendance


def list_attendances(
    db: Session,
    employee_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status_filter: Optional[AttendanceStatus] = None
) -> List[Attendance]:
    """
    List attendance records with optional filters.
    """
    query = db.query(Attendance)
    if employee_id is not None:
        query = query.filter(Attendance.employee_id == employee_id)
    if start_date is not None:
        query = query.filter(Attendance.date >= start_date)
    if end_date is not None:
        query = query.filter(Attendance.date <= end_date)
    if status_filter is not None:
        query = query.filter(Attendance.status == status_filter)

    return query.order_by(Attendance.date.desc()).all()


def get_attendance_by_id(db: Session, attendance_id: int) -> Attendance:
    """
    Retrieve single attendance record by ID.
    """
    record = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attendance record with ID {attendance_id} not found"
        )
    return record


def update_attendance(db: Session, attendance_id: int, payload: AttendanceUpdate) -> Attendance:
    """
    Updates an attendance record (e.g. adding check_out or manual adjustment).
    """
    record = get_attendance_by_id(db, attendance_id)
    update_data = payload.model_dump(exclude_unset=True)

    # Check times
    new_check_in = update_data.get("check_in", record.check_in)
    new_check_out = update_data.get("check_out", record.check_out)

    if new_check_out is not None and new_check_in is not None and new_check_out < new_check_in:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="check_out time cannot be earlier than check_in time"
        )

    # Validate non-negative hours
    if "worked_hours" in update_data and update_data["worked_hours"] < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="worked_hours cannot be negative"
        )
    if "overtime_hours" in update_data and update_data["overtime_hours"] < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="overtime_hours cannot be negative"
        )

    for key, value in update_data.items():
        setattr(record, key, value)

    # Auto-adjust status if overtime changed and not explicitly set
    if "status" not in update_data:
        if record.overtime_hours > 0 and record.status == AttendanceStatus.NORMAL:
            record.status = AttendanceStatus.OVERTIME

    db.commit()
    db.refresh(record)
    return record


def get_attendance_payroll_summary(
    db: Session,
    employee_id: int,
    period_start: date,
    period_end: date
) -> AttendancePayrollSummary:
    """
    Internal service function for Payroll Engine.
    Aggregates worked and overtime hours within the pay period without HTTP calls.
    """
    records = db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.date >= period_start,
        Attendance.date <= period_end
    ).all()

    total_worked = round(sum(r.worked_hours for r in records), 2)
    total_overtime = round(sum(r.overtime_hours for r in records), 2)

    warnings: List[str] = []
    for r in records:
        if r.check_out is None:
            warnings.append(f"Incomplete attendance on {r.date}: missing check-out")
        if r.status == AttendanceStatus.EXCEPTION:
            warnings.append(f"Attendance on {r.date} flagged as exception: {r.notes or 'No notes'}")

    return AttendancePayrollSummary(
        employee_id=employee_id,
        period_start=period_start,
        period_end=period_end,
        total_worked_hours=total_worked,
        total_overtime_hours=total_overtime,
        attendance_days_count=len(records),
        warnings=warnings
    )
