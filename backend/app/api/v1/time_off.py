from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.models import LeaveStatus, User, UserRole
from app.schemas.schemas import (
    TimeOffRequestCreate,
    TimeOffRequestResponse,
)
from app.services import time_off_service

router = APIRouter()


@router.get("", response_model=List[TimeOffRequestResponse])
def list_time_off_requests(
    employee_id: Optional[int] = Query(None, description="Filter requests by employee ID"),
    status_filter: Optional[LeaveStatus] = Query(None, alias="status", description="Filter requests by LeaveStatus"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List employee leave requests with optional filtering."""
    return time_off_service.list_time_off_requests(
        db=db,
        employee_id=employee_id,
        status_filter=status_filter
    )


@router.post("", response_model=TimeOffRequestResponse, status_code=status.HTTP_201_CREATED)
def create_time_off_request(
    payload: TimeOffRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit a new leave application in PENDING status."""
    return time_off_service.create_time_off_request(
        db=db,
        payload=payload,
        current_user=current_user
    )


@router.get("/{id}", response_model=TimeOffRequestResponse)
def get_time_off_request(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve details of a specific leave request."""
    return time_off_service.get_time_off_request_by_id(db=db, request_id=id)



@router.post("/{id}/approve", response_model=TimeOffRequestResponse)
def approve_time_off_request(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.HR_PAYROLL_MANAGER])),
):
    """
    Approve a pending leave request. Updates leave allocation taken_days.
    Only approved leaves become active inputs for the payroll engine.
    """
    return time_off_service.approve_time_off_request(
        db=db,
        request_id=id,
        current_user=current_user
    )


@router.post("/{id}/reject", response_model=TimeOffRequestResponse)
def reject_time_off_request(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.HR_PAYROLL_MANAGER])),
):
    """
    Reject a leave request. Status becomes REFUSED.
    Refused leaves are never considered in payroll engine calculations.
    """
    return time_off_service.reject_time_off_request(
        db=db,
        request_id=id,
        current_user=current_user
    )
