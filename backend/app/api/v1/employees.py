from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.models import Employee, User, UserRole
from app.schemas.schemas import EmployeeCreate, EmployeeOut, EmployeeUpdate

router = APIRouter()


@router.get("", response_model=List[EmployeeOut])
def list_employees(
    search: Optional[str] = Query(None, description="Case-insensitive search on first name, last name, or email"),
    department: Optional[str] = Query(None, description="Filter by department"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (e.g. ACTIVE)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    
    
    query = db.query(Employee)

  
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Employee.first_name.ilike(search_pattern),
                Employee.last_name.ilike(search_pattern),
                Employee.email.ilike(search_pattern),
            )
        )

  
    if department:
        query = query.filter(Employee.department.ilike(f"%{department}%"))

  
    if status_filter:
        query = query.filter(Employee.status == status_filter)

  
    employees = query.order_by(Employee.id.desc()).all()
    return employees


@router.post("", response_model=EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(
    payload: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.HR_MANAGER, UserRole.ADMIN])),
):
   
    
    existing_employee = db.query(Employee).filter(Employee.email == payload.email).first()
    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    
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
   
    employee = db.query(Employee).filter(Employee.id == id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    
    update_data = payload.model_dump(exclude_unset=True)

    
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

   
    for key, value in update_data.items():
        setattr(employee, key, value)

    db.commit()
    db.refresh(employee)
    return employee


