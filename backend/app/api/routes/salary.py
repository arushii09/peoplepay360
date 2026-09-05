from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_roles
from app.db.session import get_db
from app.models.models import User, UserRole
from app.schemas.salary import (
    SalaryRuleCreate,
    SalaryRuleOut,
    SalaryStructureCreate,
    SalaryStructureOut,
    SalaryStructureWithRulesOut,
)
from app.services.payroll import salary_service

router = APIRouter()

# Roles that can create/modify salary configuration
PAYROLL_WRITE_ROLES = [UserRole.HR_PAYROLL_MANAGER, UserRole.ADMIN]

# All authenticated users can read salary structures (e.g., HR viewing an employee's structure)
PAYROLL_READ_ROLES = [
    UserRole.HR_MANAGER,
    UserRole.HR_PAYROLL_USER,
    UserRole.HR_PAYROLL_MANAGER,
    UserRole.ADMIN,
]


# =====================================================
# Salary Structure Endpoints
# =====================================================

@router.get("/salary-structures", response_model=List[SalaryStructureOut])
def list_salary_structures(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(PAYROLL_READ_ROLES)),
):
    """List all salary structures. Used by FE-2 to populate the structure selector."""
    return salary_service.get_all_structures(db)


@router.get("/salary-structures/{structure_id}", response_model=SalaryStructureWithRulesOut)
def get_salary_structure(
    structure_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(PAYROLL_READ_ROLES)),
):
    """Get a single salary structure with all its rules. Useful for the salary config UI."""
    structure = salary_service.get_structure_by_id(db, structure_id)
    return structure


@router.post(
    "/salary-structures",
    response_model=SalaryStructureOut,
    status_code=status.HTTP_201_CREATED,
)
def create_salary_structure(
    data: SalaryStructureCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(PAYROLL_WRITE_ROLES)),
):
    """
    Create a new salary structure.
    
    The `code` field is used as a unique identifier (e.g., 'CORP_EXEC_2026').
    It will be automatically normalized to uppercase.
    """
    return salary_service.create_structure(db, data)


# =====================================================
# Salary Rule Endpoints
# =====================================================

@router.get("/salary-rules", response_model=List[SalaryRuleOut])
def list_salary_rules(
    structure_id: Optional[int] = Query(default=None, description="Filter rules by salary structure ID"),
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(PAYROLL_READ_ROLES)),
):
    """
    List salary rules. Optionally filter by structure_id.
    
    Rules are always returned ordered by sequence (ascending).
    This order matters: later rules like GROSS depend on earlier rules like BASIC.
    """
    return salary_service.get_all_rules(db, structure_id=structure_id)


@router.get(
    "/salary-structures/{structure_id}/rules",
    response_model=List[SalaryRuleOut],
)
def list_rules_for_structure(
    structure_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(PAYROLL_READ_ROLES)),
):
    """Nested route: list all rules for a specific structure. Identical to GET /salary-rules?structure_id=X."""
    salary_service.get_structure_by_id(db, structure_id)  # Raises 404 if not found
    return salary_service.get_rules_for_structure(db, structure_id)


@router.post(
    "/salary-rules",
    response_model=SalaryRuleOut,
    status_code=status.HTTP_201_CREATED,
)
def create_salary_rule(
    data: SalaryRuleCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(PAYROLL_WRITE_ROLES)),
):
    """
    Create a salary rule inside an existing structure.
    
    Rule codes must be unique within a structure.
    The code is used as a variable name in formula evaluation:
      - 'BASIC' → referenced in GROSS formula as 'BASIC + HRA + DA'
    
    Computation types:
    - FIXED: use fixed_amount (flat value in currency)
    - PERCENTAGE: use percentage_value (e.g., 20 = 20% of contract.wage)
    - OVERTIME: use fixed_amount as multiplier (e.g., 1.5 for 1.5x overtime rate)
    - LEAVE_DEDUCTION: no extra fields needed; engine deducts unpaid leave automatically
    - PYTHON_EXPRESSION: use formula string referencing previous rule codes
    """
    return salary_service.create_rule(db, data)


@router.post(
    "/salary-structures/{structure_id}/rules",
    response_model=SalaryRuleOut,
    status_code=status.HTTP_201_CREATED,
)
def create_rule_for_structure(
    structure_id: int,
    data: SalaryRuleCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(PAYROLL_WRITE_ROLES)),
):
    """
    Nested route: create a rule scoped to a specific structure.
    structure_id in the URL overrides whatever is in the request body.
    """
    data.structure_id = structure_id
    return salary_service.create_rule(db, data)
