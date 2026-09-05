from datetime import date as pydate, datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.models import (
    AttendanceStatus,
    ComputationType,
    ContractStatus,
    LeaveStatus,
    PayrunStatus,
    RuleCategory,
    UserRole,
)


# ==========================================
# 1. USER & SECURITY SCHEMAS
# ==========================================

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.EMPLOYEE
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


# ==========================================
# 2. WORKING SCHEDULE & TIME OFF SCHEMAS
# ==========================================

class WorkingScheduleResponse(BaseModel):
    id: int
    name: str
    schedule_type: str
    weekly_hours: float
    pattern_json: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


class TimeOffTypeResponse(BaseModel):
    id: int
    name: str
    code: str
    is_paid: bool
    requires_allocation: bool

    model_config = ConfigDict(from_attributes=True)


class LeaveAllocationResponse(BaseModel):
    id: int
    employee_id: int
    time_off_type_id: int
    allocated_days: float
    taken_days: float
    year: int

    model_config = ConfigDict(from_attributes=True)


class TimeOffRequestResponse(BaseModel):
    id: int
    employee_id: int
    time_off_type_id: int
    start_date: pydate
    end_date: pydate
    days: float
    reason: Optional[str] = None
    status: LeaveStatus

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# 3. ATTENDANCE & CONTRACT SCHEMAS
# ==========================================

class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    date: pydate
    check_in: datetime
    check_out: Optional[datetime] = None
    worked_hours: float
    overtime_hours: float
    status: AttendanceStatus
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ContractCreate(BaseModel):
    name: str
    employee_id: int
    start_date: pydate
    end_date: Optional[pydate] = None
    wage: float
    salary_structure_id: int
    status: ContractStatus = ContractStatus.DRAFT


class ContractUpdate(BaseModel):
    name: Optional[str] = None
    start_date: Optional[pydate] = None
    end_date: Optional[pydate] = None
    wage: Optional[float] = None
    salary_structure_id: Optional[int] = None
    status: Optional[ContractStatus] = None


class ContractOut(BaseModel):
    id: int
    name: str
    employee_id: int
    start_date: pydate
    end_date: Optional[pydate] = None
    wage: float
    salary_structure_id: int
    status: ContractStatus

    model_config = ConfigDict(from_attributes=True)


ContractResponse = ContractOut


# ==========================================
# 4. EMPLOYEE SCHEMAS (MODULE 3)
# ==========================================

class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    department: Optional[str] = None
    job_position: Optional[str] = None
    manager_id: Optional[int] = None
    schedule_id: Optional[int] = None
    status: str = "ACTIVE"
    bank_account_no: Optional[str] = None
    bank_name: Optional[str] = None
    ifsc_code: Optional[str] = None
    tax_id: Optional[str] = None


class EmployeeCreate(EmployeeBase):
    """
    Schema for creating a new Employee record.
    Required fields: first_name, last_name, email, department, job_position.
    """
    user_id: Optional[int] = None
    first_name: str
    last_name: str
    email: EmailStr
    department: str
    job_position: str


class EmployeeUpdate(BaseModel):
    """
    Schema for updating existing Employee profile information.
    All fields are optional to support partial updates via PUT/PATCH.
    """
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    job_position: Optional[str] = None
    manager_id: Optional[int] = None
    schedule_id: Optional[int] = None
    status: Optional[str] = None
    bank_account_no: Optional[str] = None
    bank_name: Optional[str] = None
    ifsc_code: Optional[str] = None
    tax_id: Optional[str] = None


class EmployeeOut(EmployeeBase):
    """
    Output representation of Employee record.
    """
    id: int
    user_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


EmployeeResponse = EmployeeOut


class SmartCountsOut(BaseModel):
    """
    Live summary counter counts for employee UI header badges.
    """
    active_contracts_count: int
    attendance_days_this_month: int
    remaining_leave_balance: float


SmartBadgeCountsOut = SmartCountsOut


# ==========================================
# 5. SALARY STRUCTURE & PAYROLL SCHEMAS
# ==========================================

class SalaryRuleResponse(BaseModel):
    id: int
    structure_id: int
    name: str
    code: str
    category: RuleCategory
    sequence: int
    computation_type: ComputationType
    fixed_amount: Optional[float] = None
    percentage_value: Optional[float] = None
    formula: Optional[str] = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class SalaryStructureResponse(BaseModel):
    id: int
    name: str
    code: str
    description: Optional[str] = None
    is_active: bool
    rules: List[SalaryRuleResponse] = []

    model_config = ConfigDict(from_attributes=True)


class PayslipLineResponse(BaseModel):
    id: int
    rule_code: str
    rule_name: str
    category: RuleCategory
    sequence: int
    rate: float
    amount: float
    calculation_trace: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PayslipResponse(BaseModel):
    id: int
    payrun_id: int
    employee_id: int
    contract_id: int
    status: PayrunStatus
    worked_days: float
    total_hours: float
    overtime_hours: float
    unpaid_leave_days: float
    basic_wage: float
    gross_wage: float
    total_deductions: float
    net_wage: float
    warnings_json: Optional[Dict[str, Any]] = None
    lines: List[PayslipLineResponse] = []

    model_config = ConfigDict(from_attributes=True)


class PayrunResponse(BaseModel):
    id: int
    name: str
    period_start: pydate
    period_end: pydate
    salary_structure_id: int
    status: PayrunStatus
    total_gross: float
    total_deductions: float
    total_net: float
    created_at: datetime
    payslips: List[PayslipResponse] = []

    model_config = ConfigDict(from_attributes=True)
