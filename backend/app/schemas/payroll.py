from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.models.models import PayrunStatus


class PayrunCreate(BaseModel):
    period_start: date
    period_end: date


class PayrunResponse(BaseModel):
    id: int
    period_start: date
    period_end: date
    status: PayrunStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PayrunPayslipItem(BaseModel):
    id: int
    employee_id: int
    employee_name: str
    gross_salary: float
    leave_deduction: float
    net_salary: float
    status: str

    model_config = ConfigDict(from_attributes=True)


class PayrunDetailResponse(BaseModel):
    id: int
    period_start: date
    period_end: date
    status: PayrunStatus
    created_at: datetime
    updated_at: datetime
    payslips: List[PayrunPayslipItem] = []

    model_config = ConfigDict(from_attributes=True)


class PayslipResponse(BaseModel):
    id: int
    payrun_id: int
    employee_id: int
    contract_id: int
    gross_salary: float
    leave_deduction: float
    net_salary: float
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class EmployeeSummary(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    department: str
    job_position: str

    model_config = ConfigDict(from_attributes=True)


class PayPeriodSummary(BaseModel):
    period_start: date
    period_end: date


class PayslipDetailResponse(BaseModel):
    id: int
    employee: EmployeeSummary
    pay_period: PayPeriodSummary
    gross_salary: float
    leave_deduction: float
    net_salary: float
    status: str

    model_config = ConfigDict(from_attributes=True)
