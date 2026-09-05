from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.models import Payslip, User
from app.schemas.payroll import PayslipDetailResponse, PayslipResponse
from app.services.payroll import payroll_service

router = APIRouter()


@router.get("/{id}", response_model=PayslipDetailResponse)
def get_payslip(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return payroll_service.get_payslip(db=db, payslip_id=id)


@router.get("", response_model=List[PayslipResponse])
def list_payslips(
    payrun_id: Optional[int] = Query(None),
    employee_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Payslip)
    if payrun_id is not None:
        query = query.filter(Payslip.payrun_id == payrun_id)
    if employee_id is not None:
        query = query.filter(Payslip.employee_id == employee_id)
    return query.order_by(Payslip.id.desc()).all()
