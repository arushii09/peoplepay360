from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import extract, func, or_
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.models import (
    Attendance,
    Contract,
    ContractStatus,
    Employee,
    LeaveAllocation,
    User,
    UserRole,
)
from app.schemas.schemas import (
    EmployeeCreate,
    EmployeeOut,
    EmployeeUpdate,
    SmartCountsOut,
)

router = APIRouter()


@router.get("", response_model=List[EmployeeOut])
def list_employees(
    search: Optional[str] = Query(None, description="Case-insensitive search on first name, last name, or email"),
    department: Optional[str] = Query(None, description="Filter by department"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (e.g. ACTIVE)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List all employees with optional query filters.
    Orders results by employee ID descending.
    """
    # Start base query for employees
    query = db.query(Employee)

    # 1. Apply case-insensitive partial match search on first_name, last_name, or email
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Employee.first_name.ilike(search_pattern),
                Employee.last_name.ilike(search_pattern),
                Employee.email.ilike(search_pattern),
            )
        )

    # 2. Apply department filter if provided
    if department:
        query = query.filter(Employee.department.ilike(f"%{department}%"))

    # 3. Apply status filter if provided
    if status_filter:
        query = query.filter(Employee.status == status_filter)

    # Return employees ordered by newest ID first
    employees = query.order_by(Employee.id.desc()).all()
    return employees


@router.post("", response_model=EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(
    payload: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.HR_MANAGER, UserRole.ADMIN])),
):
    """
    Create a new employee profile.
    Restricted to HR_MANAGER or ADMIN roles. Checks for duplicate email.
    """
    # Check if an employee with the target email already exists
    existing_employee = db.query(Employee).filter(Employee.email == payload.email).first()
    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new Employee model instance from Pydantic schema data
    employee_dict = payload.model_dump()
    new_employee = Employee(**employee_dict)

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee


@router.get("/{id}", response_model=EmployeeOut)
def get_employee(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve detailed employee profile by ID.
    Raises HTTP 404 if employee does not exist.
    """
    employee = db.query(Employee).filter(Employee.id == id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    return employee


@router.put("/{id}", response_model=EmployeeOut)
def update_employee(
    id: int,
    payload: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.HR_MANAGER, UserRole.ADMIN])),
):
    """
    Update employee profile information.
    Restricted to HR_MANAGER or ADMIN roles.
    """
    employee = db.query(Employee).filter(Employee.id == id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    # Extract non-null fields provided in request payload
    update_data = payload.model_dump(exclude_unset=True)

    # If updating email, verify uniqueness against other employees
    if "email" in update_data and update_data["email"] != employee.email:
        email_conflict = db.query(Employee).filter(
            Employee.email == update_data["email"],
            Employee.id != id
        ).first()
        if email_conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use by another employee"
            )

    # Apply updates to Employee instance attributes
    for key, value in update_data.items():
        setattr(employee, key, value)

    db.commit()
    db.refresh(employee)
    return employee


@router.get("/{id}/smart-counts", response_model=SmartCountsOut)
def get_employee_smart_counts(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Calculate and return live summary counter counts for UI badges:
    - active_contracts_count: total active contracts for employee
    - attendance_days_this_month: attendance records in current month/year
    - remaining_leave_balance: total remaining allocated leave days
    """
    employee = db.query(Employee).filter(Employee.id == id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    now = datetime.now()

    # 1. Count active contracts for this employee
    active_contracts_count = db.query(func.count(Contract.id)).filter(
        Contract.employee_id == id,
        Contract.status == ContractStatus.ACTIVE
    ).scalar() or 0

    # 2. Count attendance entries for the current calendar month and year
    attendance_days_this_month = db.query(func.count(Attendance.id)).filter(
        Attendance.employee_id == id,
        extract("month", Attendance.date) == now.month,
        extract("year", Attendance.date) == now.year
    ).scalar() or 0

    # 3. Sum remaining leave days across all active leave allocations for current year
    leave_allocations = db.query(LeaveAllocation).filter(
        LeaveAllocation.employee_id == id,
        LeaveAllocation.year == now.year
    ).all()

    remaining_leave_balance = sum(
        (alloc.allocated_days - alloc.taken_days) for alloc in leave_allocations
    )

    return SmartCountsOut(
        active_contracts_count=active_contracts_count,
        attendance_days_this_month=attendance_days_this_month,
        remaining_leave_balance=float(remaining_leave_balance)
    )
