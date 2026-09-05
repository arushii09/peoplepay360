from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.models import Contract, Employee, SalaryStructure, User, UserRole
from app.schemas.schemas import ContractCreate, ContractOut, ContractUpdate

router = APIRouter()


@router.get("", response_model=List[ContractOut])
def list_contracts(
    employee_id: Optional[int] = Query(None, description="Filter contracts by employee ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List employment contracts, with optional filtering by employee_id.
    """
    query = db.query(Contract)
    if employee_id is not None:
        query = query.filter(Contract.employee_id == employee_id)
    
    return query.order_by(Contract.id.desc()).all()


@router.post("", response_model=ContractOut, status_code=status.HTTP_201_CREATED)
def create_contract(
    payload: ContractCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.HR_PAYROLL_MANAGER])),
):
    """
    Create a new employment contract.
    Validates that employee and salary structure exist, and start_date < end_date.
    """
    # 1. Validate employee exists
    employee = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target employee not found"
        )

    # 2. Validate salary structure exists
    structure = db.query(SalaryStructure).filter(SalaryStructure.id == payload.salary_structure_id).first()
    if not structure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salary structure not found"
        )

    # 3. Validate contract start_date vs end_date
    if payload.end_date and payload.start_date >= payload.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contract end_date must be strictly after start_date"
        )

    # Create Contract record
    contract_data = payload.model_dump()
    new_contract = Contract(**contract_data)

    db.add(new_contract)
    db.commit()
    db.refresh(new_contract)
    return new_contract


@router.put("/{id}", response_model=ContractOut)
def update_contract(
    id: int,
    payload: ContractUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.HR_MANAGER, UserRole.ADMIN, UserRole.HR_PAYROLL_MANAGER])),
):
    """
    Update an existing employment contract's wage, dates, or status.
    """
    contract = db.query(Contract).filter(Contract.id == id).first()
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found"
        )

    update_data = payload.model_dump(exclude_unset=True)

    # Validate updated start_date and end_date
    start_date = update_data.get("start_date", contract.start_date)
    end_date = update_data.get("end_date", contract.end_date)
    if end_date and start_date >= end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contract end_date must be strictly after start_date"
        )

    for key, value in update_data.items():
        setattr(contract, key, value)

    db.commit()
    db.refresh(contract)
    return contract
