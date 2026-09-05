from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.models import Payrun, User, UserRole
from app.schemas.payroll import (
    PayrunCreate,
    PayrunDetailResponse,
    PayrunPayslipItem,
    PayrunResponse,
)
from app.services.payroll import payroll_service

router = APIRouter()


@router.post("", response_model=PayrunResponse, status_code=status.HTTP_201_CREATED)
def create_payrun(
    payload: PayrunCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.HR_PAYROLL_MANAGER])),
):
    return payroll_service.create_payrun(
        db=db,
        period_start=payload.period_start,
        period_end=payload.period_end,
    )


@router.get("", response_model=List[PayrunResponse])
def list_payruns(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Payrun).order_by(Payrun.id.desc()).all()


@router.get("/{id}", response_model=PayrunDetailResponse)
def get_payrun(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return payroll_service.get_payrun(db=db, payrun_id=id)


@router.post("/{id}/calculate", response_model=PayrunResponse)
def calculate_payrun(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.HR_PAYROLL_MANAGER])),
):
    return payroll_service.calculate_payrun(db=db, payrun_id=id)


@router.post("/{id}/validate", response_model=PayrunResponse)
def validate_payrun(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.HR_PAYROLL_MANAGER])),
):
    return payroll_service.validate_payrun(db=db, payrun_id=id)


@router.post("/{id}/mark-paid", response_model=PayrunResponse)
def mark_payrun_paid(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.HR_PAYROLL_MANAGER])),
):
    return payroll_service.mark_paid(db=db, payrun_id=id)


@router.get("/{id}/payslips", response_model=List[PayrunPayslipItem])
def get_payrun_payslips(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return payroll_service.get_payrun_payslips(db=db, payrun_id=id)
