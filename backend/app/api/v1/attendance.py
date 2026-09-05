from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.models import AttendanceStatus, User, UserRole
from app.schemas.schemas import (
    AttendanceCreate,
    AttendanceResponse,
    AttendanceUpdate,
)
from app.services import attendance_service

router = APIRouter()


@router.get("", response_model=List[AttendanceResponse])
def list_attendances(
    employee_id: Optional[int] = Query(None, description="Filter by employee ID"),
    start_date: Optional[date] = Query(None, description="Filter records on or after start_date"),
    end_date: Optional[date] = Query(None, description="Filter records on or before end_date"),
    status_filter: Optional[AttendanceStatus] = Query(None, alias="status", description="Filter by AttendanceStatus"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == UserRole.EMPLOYEE:
        if not current_user.employee:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User account is not linked to an employee profile",
            )
        employee_id = current_user.employee.id


    
    return attendance_service.list_attendances(
        db=db,
        employee_id=employee_id,
        start_date=start_date,
        end_date=end_date,
        status_filter=status_filter
    )


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def create_attendance(
    payload: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    
    return attendance_service.create_attendance(db=db, payload=payload)


@router.get("/{id}", response_model=AttendanceResponse)
def get_attendance(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    
    return attendance_service.get_attendance_by_id(db=db, attendance_id=id)


@router.patch("/{id}", response_model=AttendanceResponse)
def update_attendance(
    id: int,
    payload: AttendanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.HR_PAYROLL_MANAGER])),
):
   
    return attendance_service.update_attendance(db=db, attendance_id=id, payload=payload)

