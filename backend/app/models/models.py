from datetime import datetime, date as pydate
from enum import Enum as PyEnum
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


# ==========================================
# 1. DOMAIN ENUMS
# ==========================================

class UserRole(str, PyEnum):
    EMPLOYEE = "EMPLOYEE"
    HR_MANAGER = "HR_MANAGER"
    HR_PAYROLL_USER = "HR_PAYROLL_USER"
    HR_PAYROLL_MANAGER = "HR_PAYROLL_MANAGER"
    ADMIN = "ADMIN"


class ContractStatus(str, PyEnum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    CANCELLED = "CANCELLED"


class AttendanceStatus(str, PyEnum):
    NORMAL = "NORMAL"
    LATE = "LATE"
    OVERTIME = "OVERTIME"
    EXCEPTION = "EXCEPTION"
    MANUALLY_CORRECTED = "MANUALLY_CORRECTED"


class LeaveStatus(str, PyEnum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REFUSED = "REFUSED"


class RuleCategory(str, PyEnum):
    BASIC = "BASIC"
    ALLOWANCE = "ALLOWANCE"
    GROSS = "GROSS"
    DEDUCTION = "DEDUCTION"
    NET = "NET"


class ComputationType(str, PyEnum):
    FIXED = "FIXED"
    PERCENTAGE = "PERCENTAGE"
    PYTHON_EXPRESSION = "PYTHON_EXPRESSION"


class PayrunStatus(str, PyEnum):
    DRAFT = "DRAFT"
    COMPUTED = "COMPUTED"
    VALIDATED = "VALIDATED"
    PAID = "PAID"


# ==========================================
# 2. HR MASTER DATA MODELS (BE-1)
# ==========================================

class User(Base):
    """
    User model for authentication and system access.
    Stores login credentials and role privileges.
    """
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    # Index on email speeds up lookup queries during login
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.EMPLOYEE, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # 1-to-1 relationship with Employee profile (uselist=False enforces 1-to-1 mapping)
    employee: Mapped[Optional["Employee"]] = relationship("Employee", back_populates="user", uselist=False)


class WorkingSchedule(Base):
    """
    Defines working hours and daily patterns (e.g. 40h Mon-Fri).
    """
    __tablename__ = "working_schedules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    schedule_type: Mapped[str] = mapped_column(String(100), default="FULL_TIME", nullable=False)
    weekly_hours: Mapped[float] = mapped_column(Float, default=40.0, nullable=False)
    # Stores weekday breakdown JSON: start, end, break hours per day
    pattern_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    # Employees assigned to this work schedule
    employees: Mapped[List["Employee"]] = relationship("Employee", back_populates="schedule")


class Employee(Base):
    """
    Central HR Employee profile.
    Connects users to contracts, attendance records, leaves, and payslips.
    """
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    # Foreign key to User account (nullable for external/contract employees without login)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), unique=True, nullable=True)
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    department: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    job_position: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Self-referencing foreign key for org hierarchy (manager -> subordinates)
    manager_id: Mapped[Optional[int]] = mapped_column(ForeignKey("employees.id"), nullable=True)
    schedule_id: Mapped[Optional[int]] = mapped_column(ForeignKey("working_schedules.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", nullable=False)
    
    # Financial & Tax details required for payroll validation
    bank_account_no: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    bank_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    ifsc_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    tax_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="employee")
    schedule: Mapped[Optional["WorkingSchedule"]] = relationship("WorkingSchedule", back_populates="employees")
    
    # remote_side=[id] tells SQLAlchemy manager_id points to another Employee instance in self-referencing hierarchy
    manager: Mapped[Optional["Employee"]] = relationship("Employee", remote_side=[id], back_populates="subordinates")
    subordinates: Mapped[List["Employee"]] = relationship("Employee", back_populates="manager")

    # cascade="all, delete-orphan" automatically cleans up child records when an employee is deleted to prevent orphan rows
    contracts: Mapped[List["Contract"]] = relationship("Contract", back_populates="employee", cascade="all, delete-orphan")
    attendances: Mapped[List["Attendance"]] = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")
    leave_allocations: Mapped[List["LeaveAllocation"]] = relationship("LeaveAllocation", back_populates="employee", cascade="all, delete-orphan")
    leave_requests: Mapped[List["TimeOffRequest"]] = relationship("TimeOffRequest", back_populates="employee", cascade="all, delete-orphan")
    payslips: Mapped[List["Payslip"]] = relationship("Payslip", back_populates="employee", cascade="all, delete-orphan")


class TimeOffType(Base):
    """
    Catalog of leave types (e.g., Vacation, Sick Leave, Unpaid Leave).
    """
    __tablename__ = "time_off_types"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    is_paid: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    requires_allocation: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    allocations: Mapped[List["LeaveAllocation"]] = relationship("LeaveAllocation", back_populates="time_off_type", cascade="all, delete-orphan")
    requests: Mapped[List["TimeOffRequest"]] = relationship("TimeOffRequest", back_populates="time_off_type", cascade="all, delete-orphan")


class LeaveAllocation(Base):
    """
    Annual leave allowance allocated to an employee for a specific leave type.
    """
    __tablename__ = "leave_allocations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    time_off_type_id: Mapped[int] = mapped_column(ForeignKey("time_off_types.id"), nullable=False)
    allocated_days: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    taken_days: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)

    employee: Mapped["Employee"] = relationship("Employee", back_populates="leave_allocations")
    time_off_type: Mapped["TimeOffType"] = relationship("TimeOffType", back_populates="allocations")


class TimeOffRequest(Base):
    """
    Employee leave applications submitted for approval.
    """
    __tablename__ = "time_off_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    time_off_type_id: Mapped[int] = mapped_column(ForeignKey("time_off_types.id"), nullable=False)
    start_date: Mapped[pydate] = mapped_column(Date, nullable=False)
    end_date: Mapped[pydate] = mapped_column(Date, nullable=False)
    days: Mapped[float] = mapped_column(Float, nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[LeaveStatus] = mapped_column(Enum(LeaveStatus), default=LeaveStatus.PENDING, nullable=False)

    employee: Mapped["Employee"] = relationship("Employee", back_populates="leave_requests")
    time_off_type: Mapped["TimeOffType"] = relationship("TimeOffType", back_populates="requests")


class Attendance(Base):
    """
    Daily check-in and check-out tracking for work and overtime hours.
    """
    __tablename__ = "attendances"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    date: Mapped[pydate] = mapped_column(Date, nullable=False)
    check_in: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    check_out: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    worked_hours: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    overtime_hours: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    status: Mapped[AttendanceStatus] = mapped_column(Enum(AttendanceStatus), default=AttendanceStatus.NORMAL, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    employee: Mapped["Employee"] = relationship("Employee", back_populates="attendances")


# ==========================================
# 3. PAYROLL ENGINE MODELS (BE-2)
# ==========================================

class SalaryStructure(Base):
    """
    Defines a salary template (e.g. CORP_EXEC_2026) containing ordered calculation rules.
    """
    __tablename__ = "salary_structures"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Order rules by sequence number during retrieval (e.g. BASIC=10, HRA=20, GROSS=40, PF=50, NET=100)
    rules: Mapped[List["SalaryRule"]] = relationship(
        "SalaryRule",
        back_populates="structure",
        cascade="all, delete-orphan",
        order_by="SalaryRule.sequence"
    )
    contracts: Mapped[List["Contract"]] = relationship("Contract", back_populates="salary_structure")
    payruns: Mapped[List["Payrun"]] = relationship("Payrun", back_populates="salary_structure")


class SalaryRule(Base):
    """
    Individual pay components (e.g. BASIC, HRA, PF) computed sequentially using Python expressions.
    """
    __tablename__ = "salary_rules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    structure_id: Mapped[int] = mapped_column(ForeignKey("salary_structures.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[RuleCategory] = mapped_column(Enum(RuleCategory), nullable=False)
    sequence: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    computation_type: Mapped[ComputationType] = mapped_column(
        Enum(ComputationType),
        default=ComputationType.PYTHON_EXPRESSION,
        nullable=False
    )
    fixed_amount: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    percentage_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    formula: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    structure: Mapped["SalaryStructure"] = relationship("SalaryStructure", back_populates="rules")


class Contract(Base):
    __tablename__ = "contracts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    start_date: Mapped[pydate] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[pydate]] = mapped_column(Date, nullable=True)
    wage: Mapped[float] = mapped_column(Float, nullable=False)
    salary_structure_id: Mapped[int] = mapped_column(ForeignKey("salary_structures.id"), nullable=False)
    status: Mapped[ContractStatus] = mapped_column(Enum(ContractStatus), default=ContractStatus.DRAFT, nullable=False)

    employee: Mapped["Employee"] = relationship("Employee", back_populates="contracts")
    salary_structure: Mapped["SalaryStructure"] = relationship("SalaryStructure", back_populates="contracts")
    payslips: Mapped[List["Payslip"]] = relationship("Payslip", back_populates="contract")


class Payrun(Base):
    """
    Monthly payroll processing batch containing payslips for all eligible employees.
    """
    __tablename__ = "payruns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    period_start: Mapped[pydate] = mapped_column(Date, nullable=False)
    period_end: Mapped[pydate] = mapped_column(Date, nullable=False)
    salary_structure_id: Mapped[int] = mapped_column(ForeignKey("salary_structures.id"), nullable=False)
    status: Mapped[PayrunStatus] = mapped_column(Enum(PayrunStatus), default=PayrunStatus.DRAFT, nullable=False)
    total_gross: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_deductions: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_net: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    salary_structure: Mapped["SalaryStructure"] = relationship("SalaryStructure", back_populates="payruns")
    payslips: Mapped[List["Payslip"]] = relationship("Payslip", back_populates="payrun", cascade="all, delete-orphan")


class Payslip(Base):
    """
    Individual payslip generated for an employee during a payrun batch.
    """
    __tablename__ = "payslips"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    payrun_id: Mapped[int] = mapped_column(ForeignKey("payruns.id"), nullable=False)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    contract_id: Mapped[int] = mapped_column(ForeignKey("contracts.id"), nullable=False)
    status: Mapped[PayrunStatus] = mapped_column(Enum(PayrunStatus), default=PayrunStatus.DRAFT, nullable=False)
    worked_days: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_hours: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    overtime_hours: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    unpaid_leave_days: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    basic_wage: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    gross_wage: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_deductions: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    net_wage: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    
    # Stores validation alerts (e.g. missing bank account or tax ID) as JSON
    warnings_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    payrun: Mapped["Payrun"] = relationship("Payrun", back_populates="payslips")
    employee: Mapped["Employee"] = relationship("Employee", back_populates="payslips")
    contract: Mapped["Contract"] = relationship("Contract", back_populates="payslips")
    lines: Mapped[List["PayslipLine"]] = relationship(
        "PayslipLine",
        back_populates="payslip",
        cascade="all, delete-orphan",
        order_by="PayslipLine.sequence"
    )


class PayslipLine(Base):
    """
    Detailed breakdown line item on a payslip showing rate, amount, and calculation trace.
    """
    __tablename__ = "payslip_lines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    payslip_id: Mapped[int] = mapped_column(ForeignKey("payslips.id"), nullable=False)
    rule_code: Mapped[str] = mapped_column(String(100), nullable=False)
    rule_name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[RuleCategory] = mapped_column(Enum(RuleCategory), nullable=False)
    sequence: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    rate: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    calculation_trace: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    payslip: Mapped["Payslip"] = relationship("Payslip", back_populates="lines")
