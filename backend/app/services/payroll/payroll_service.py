from datetime import date, datetime
from decimal import Decimal
from typing import List
from fastapi import HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.models import (
    Contract,
    ContractStatus,
    Employee,
    Payrun,
    PayrunStatus,
    Payslip,
)
from app.schemas.payroll import (
    EmployeeSummary,
    PayPeriodSummary,
    PayslipDetailResponse,
)
from app.services import time_off_service


def create_payrun(db: Session, period_start: date, period_end: date) -> Payrun:
    if period_end < period_start:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="period_end cannot be before period_start"
        )

    payrun = Payrun(
        period_start=period_start,
        period_end=period_end,
        status=PayrunStatus.DRAFT,
        total_gross=0.0,
        total_deductions=0.0,
        total_net=0.0,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(payrun)
    db.commit()
    db.refresh(payrun)
    return payrun


def get_payrun(db: Session, payrun_id: int) -> Payrun:
    payrun = db.query(Payrun).filter(Payrun.id == payrun_id).first()
    if not payrun:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payrun not found"
        )
    return payrun


def calculate_payrun(db: Session, payrun_id: int) -> Payrun:
    payrun = get_payrun(db, payrun_id)

    if payrun.status in [PayrunStatus.VALIDATED, PayrunStatus.PAID]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot recalculate a validated or paid payrun"
        )

    active_contracts = (
        db.query(Contract)
        .filter(
            Contract.status == ContractStatus.ACTIVE,
            Contract.start_date <= payrun.period_end,
            or_(Contract.end_date >= payrun.period_start, Contract.end_date.is_(None)),
        )
        .all()
    )

    db.query(Payslip).filter(Payslip.payrun_id == payrun.id).delete()

    total_gross = Decimal("0.00")
    total_deductions = Decimal("0.00")
    total_net = Decimal("0.00")

    seen_employees = set()
    for contract in active_contracts:
        if contract.employee_id in seen_employees:
            continue
        seen_employees.add(contract.employee_id)

        monthly_salary = Decimal(str(contract.wage)).quantize(Decimal("0.01"))
        daily_salary = monthly_salary / Decimal("30")

        leave_summary = time_off_service.get_time_off_payroll_summary(
            db=db,
            employee_id=contract.employee_id,
            period_start=payrun.period_start,
            period_end=payrun.period_end,
        )

        unpaid_days = Decimal(str(leave_summary.unpaid_leave_days))
        leave_deduction = (unpaid_days * daily_salary).quantize(Decimal("0.01"))

        gross_salary = monthly_salary
        net_salary = gross_salary - leave_deduction

        total_gross += gross_salary
        total_deductions += leave_deduction
        total_net += net_salary

        payslip = Payslip(
            payrun_id=payrun.id,
            employee_id=contract.employee_id,
            contract_id=contract.id,
            gross_salary=float(gross_salary),
            leave_deduction=float(leave_deduction),
            net_salary=float(net_salary),
            gross_wage=float(gross_salary),
            total_deductions=float(leave_deduction),
            net_wage=float(net_salary),
            status=PayrunStatus.CALCULATED.value,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(payslip)

    payrun.status = PayrunStatus.CALCULATED
    payrun.total_gross = float(total_gross)
    payrun.total_deductions = float(total_deductions)
    payrun.total_net = float(total_net)
    payrun.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(payrun)
    return payrun


def validate_payrun(db: Session, payrun_id: int) -> Payrun:
    payrun = get_payrun(db, payrun_id)

    if payrun.status != PayrunStatus.CALCULATED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Validation failed: Payrun must be in Calculated status to validate"
        )

    payslips = db.query(Payslip).filter(Payslip.payrun_id == payrun.id).all()
    if not payslips:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Validation failed: No payslips exist for this payrun"
        )

    for ps in payslips:
        employee = db.query(Employee).filter(Employee.id == ps.employee_id).first()
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Validation failed: Invalid employee for payslip {ps.id}"
            )

        contract = db.query(Contract).filter(Contract.id == ps.contract_id).first()
        if not contract or contract.status != ContractStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Validation failed: Employee {ps.employee_id} does not have an active contract"
            )

        if ps.gross_salary < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Validation failed: Gross salary cannot be negative for employee {ps.employee_id}"
            )

        if ps.leave_deduction < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Validation failed: Leave deduction cannot be negative for employee {ps.employee_id}"
            )

        if ps.net_salary < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Validation failed: Net salary cannot be negative for employee {ps.employee_id}"
            )

    payrun.status = PayrunStatus.VALIDATED
    payrun.updated_at = datetime.utcnow()
    for ps in payslips:
        ps.status = PayrunStatus.VALIDATED.value
        ps.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(payrun)
    return payrun


def mark_paid(db: Session, payrun_id: int) -> Payrun:
    payrun = get_payrun(db, payrun_id)

    if payrun.status != PayrunStatus.VALIDATED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot mark payrun as paid: Payrun must be in Validated status"
        )

    payrun.status = PayrunStatus.PAID
    payrun.updated_at = datetime.utcnow()
    for ps in payrun.payslips:
        ps.status = PayrunStatus.PAID.value
        ps.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(payrun)
    return payrun


def get_payrun_payslips(db: Session, payrun_id: int) -> List[Payslip]:
    payrun = get_payrun(db, payrun_id)
    return db.query(Payslip).filter(Payslip.payrun_id == payrun.id).order_by(Payslip.id.asc()).all()


def get_payslip(db: Session, payslip_id: int) -> PayslipDetailResponse:
    payslip = db.query(Payslip).filter(Payslip.id == payslip_id).first()
    if not payslip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payslip not found"
        )

    employee = db.query(Employee).filter(Employee.id == payslip.employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    payrun = db.query(Payrun).filter(Payrun.id == payslip.payrun_id).first()
    if not payrun:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payrun not found"
        )

    return PayslipDetailResponse(
        id=payslip.id,
        employee=EmployeeSummary.model_validate(employee),
        pay_period=PayPeriodSummary(
            period_start=payrun.period_start,
            period_end=payrun.period_end,
        ),
        gross_salary=payslip.gross_salary,
        leave_deduction=payslip.leave_deduction,
        net_salary=payslip.net_salary,
        status=payslip.status,
    )
