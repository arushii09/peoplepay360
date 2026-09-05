from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.models import SalaryRule, SalaryStructure
from app.schemas.salary import SalaryRuleCreate, SalaryStructureCreate


# =====================================================
# Salary Structure Service
# =====================================================

def get_all_structures(db: Session) -> List[SalaryStructure]:
    return db.query(SalaryStructure).order_by(SalaryStructure.name).all()


def get_structure_by_id(db: Session, structure_id: int) -> SalaryStructure:
    structure = db.query(SalaryStructure).filter(SalaryStructure.id == structure_id).first()
    if not structure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Salary structure with id {structure_id} not found.",
        )
    return structure


def create_structure(db: Session, data: SalaryStructureCreate) -> SalaryStructure:
    # A salary structure's code must be globally unique (e.g., "CORP_EXEC_2026").
    # Two structures with the same code would confuse the payroll engine when
    # resolving which rules to apply for a contract.
    existing = db.query(SalaryStructure).filter(SalaryStructure.code == data.code).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A salary structure with code '{data.code}' already exists.",
        )

    structure = SalaryStructure(**data.model_dump())
    db.add(structure)
    db.commit()
    db.refresh(structure)
    return structure


# =====================================================
# Salary Rule Service
# =====================================================

def get_rules_for_structure(db: Session, structure_id: int) -> List[SalaryRule]:
    # Rules must always be returned in sequence order.
    # The payroll engine depends on this: BASIC must run before GROSS can use it.
    return (
        db.query(SalaryRule)
        .filter(SalaryRule.structure_id == structure_id)
        .order_by(SalaryRule.sequence)
        .all()
    )


def get_all_rules(db: Session, structure_id: Optional[int] = None) -> List[SalaryRule]:
    query = db.query(SalaryRule).order_by(SalaryRule.structure_id, SalaryRule.sequence)
    if structure_id is not None:
        query = query.filter(SalaryRule.structure_id == structure_id)
    return query.all()


def create_rule(db: Session, data: SalaryRuleCreate) -> SalaryRule:
    # Step 1: Verify the target structure exists before creating a rule for it.
    structure = db.query(SalaryStructure).filter(SalaryStructure.id == data.structure_id).first()
    if not structure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Salary structure with id {data.structure_id} not found.",
        )

    # Step 2: Rule codes must be unique within the same structure.
    # Two rules with code "BASIC" in the same structure would cause the engine
    # to produce undefined results when a formula references "BASIC".
    duplicate = db.query(SalaryRule).filter(
        SalaryRule.structure_id == data.structure_id,
        SalaryRule.code == data.code,
    ).first()
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Rule code '{data.code}' already exists in structure '{structure.code}'. Codes must be unique within a structure.",
        )

    rule_data = data.model_dump()

    # Convert Decimal → float for DB storage.
    # The DB column is Numeric(12, 4) which stores exact values; float is only
    # used as the Python bridge type at the ORM boundary.
    # The payroll engine will convert back to Decimal when it reads these values.
    if rule_data.get("fixed_amount") is not None:
        rule_data["fixed_amount"] = float(rule_data["fixed_amount"])
    if rule_data.get("percentage_value") is not None:
        rule_data["percentage_value"] = float(rule_data["percentage_value"])

    rule = SalaryRule(**rule_data)
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule
