from datetime import date
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.models import (
    Employee,
    LeaveAllocation,
    LeaveStatus,
    TimeOffRequest,
    TimeOffType,
    User,
)
from app.schemas.schemas import (
    TimeOffPayrollSummary,
    TimeOffRequestCreate,
)


def create_time_off_request(
    db: Session,
    payload: TimeOffRequestCreate,
    current_user: Optional[User] = None
) -> TimeOffRequest:
    """
    Submits a new time-off application in PENDING status.
    Calculates duration in days inclusively: (end_date - start_date).days + 1.
    """
    # 1. Validate employee exists
    employee = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {payload.employee_id} not found"
        )

    # 2. Validate leave type exists
    leave_type = db.query(TimeOffType).filter(TimeOffType.id == payload.time_off_type_id).first()
    if not leave_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"TimeOffType with ID {payload.time_off_type_id} not found"
        )

    # 3. Validate date range
    if payload.start_date > payload.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date cannot be after end_date"
        )

    # 4. Calculate inclusive calendar days
    days = float((payload.end_date - payload.start_date).days + 1)

    new_request = TimeOffRequest(
        employee_id=payload.employee_id,
        time_off_type_id=payload.time_off_type_id,
        start_date=payload.start_date,
        end_date=payload.end_date,
        days=days,
        reason=payload.reason,
        status=LeaveStatus.PENDING
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request


def list_time_off_requests(
    db: Session,
    employee_id: Optional[int] = None,
    status_filter: Optional[LeaveStatus] = None
) -> List[TimeOffRequest]:
    """
    List leave requests with optional filtering by employee or approval status.
    """
    query = db.query(TimeOffRequest)
    if employee_id is not None:
        query = query.filter(TimeOffRequest.employee_id == employee_id)
    if status_filter is not None:
        query = query.filter(TimeOffRequest.status == status_filter)

    return query.order_by(TimeOffRequest.start_date.desc()).all()


def get_time_off_request_by_id(db: Session, request_id: int) -> TimeOffRequest:
    """
    Retrieve single leave request by ID.
    """
    request = db.query(TimeOffRequest).filter(TimeOffRequest.id == request_id).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Time-off request with ID {request_id} not found"
        )
    return request


def approve_time_off_request(
    db: Session,
    request_id: int,
    current_user: Optional[User] = None
) -> TimeOffRequest:
    """
    Transitions a leave request from PENDING to APPROVED.
    Updates taken_days in LeaveAllocation if applicable.
    """
    leave_req = get_time_off_request_by_id(db, request_id)

    if leave_req.status == LeaveStatus.APPROVED:
        return leave_req

    # Update allocation if required
    leave_type = db.query(TimeOffType).filter(TimeOffType.id == leave_req.time_off_type_id).first()
    if leave_type and leave_type.requires_allocation:
        allocation = db.query(LeaveAllocation).filter(
            LeaveAllocation.employee_id == leave_req.employee_id,
            LeaveAllocation.time_off_type_id == leave_req.time_off_type_id,
            LeaveAllocation.year == leave_req.start_date.year
        ).first()
        if allocation:
            allocation.taken_days = float(allocation.taken_days + leave_req.days)

    leave_req.status = LeaveStatus.APPROVED
    db.commit()
    db.refresh(leave_req)
    return leave_req


def reject_time_off_request(
    db: Session,
    request_id: int,
    current_user: Optional[User] = None
) -> TimeOffRequest:
    """
    Transitions a leave request to REFUSED.
    Reverts taken_days in LeaveAllocation if request was previously approved.
    """
    leave_req = get_time_off_request_by_id(db, request_id)

    # If it was previously approved, revert allocation
    if leave_req.status == LeaveStatus.APPROVED:
        leave_type = db.query(TimeOffType).filter(TimeOffType.id == leave_req.time_off_type_id).first()
        if leave_type and leave_type.requires_allocation:
            allocation = db.query(LeaveAllocation).filter(
                LeaveAllocation.employee_id == leave_req.employee_id,
                LeaveAllocation.time_off_type_id == leave_req.time_off_type_id,
                LeaveAllocation.year == leave_req.start_date.year
            ).first()
            if allocation:
                allocation.taken_days = max(0.0, float(allocation.taken_days - leave_req.days))

    leave_req.status = LeaveStatus.REFUSED
    db.commit()
    db.refresh(leave_req)
    return leave_req


def get_time_off_payroll_summary(
    db: Session,
    employee_id: int,
    period_start: date,
    period_end: date
) -> TimeOffPayrollSummary:
    """
    Internal service function for Payroll Engine.
    CRITICAL: ONLY evaluates LeaveStatus.APPROVED requests.
    Calculates approved days falling strictly within the period boundary,
    splitting into paid_leave_days and unpaid_leave_days.
    """
    approved_requests = (
        db.query(TimeOffRequest)
        .filter(
            TimeOffRequest.employee_id == employee_id,
            TimeOffRequest.status == LeaveStatus.APPROVED,
            TimeOffRequest.start_date <= period_end,
            TimeOffRequest.end_date >= period_start
        )
        .all()
    )

    total_days = 0.0
    paid_days = 0.0
    unpaid_days = 0.0

    for req in approved_requests:
        # Calculate days strictly overlapping the pay period
        eff_start = max(req.start_date, period_start)
        eff_end = min(req.end_date, period_end)
        overlap_days = float((eff_end - eff_start).days + 1)

        total_days += overlap_days
        # Determine if paid or unpaid from TimeOffType
        time_off_type = db.query(TimeOffType).filter(TimeOffType.id == req.time_off_type_id).first()
        if time_off_type and not time_off_type.is_paid:
            unpaid_days += overlap_days
        else:
            paid_days += overlap_days

    return TimeOffPayrollSummary(
        employee_id=employee_id,
        period_start=period_start,
        period_end=period_end,
        total_approved_days=round(total_days, 2),
        paid_leave_days=round(paid_days, 2),
        unpaid_leave_days=round(unpaid_days, 2),
        approved_requests_count=len(approved_requests)
    )
