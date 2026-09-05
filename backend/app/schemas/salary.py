from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator, model_validator

from app.models.models import ComputationType, RuleCategory


# =====================================================
# Salary Structure Schemas
# =====================================================

class SalaryStructureCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    code: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    is_active: bool = True

    @field_validator("code")
    @classmethod
    def normalize_code(cls, v: str) -> str:
        # Codes are always stored uppercase with no spaces: "Corp Exec 2026" → "CORP_EXEC_2026"
        return v.strip().upper().replace(" ", "_")


class SalaryStructureOut(BaseModel):
    id: int
    name: str
    code: str
    description: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SalaryStructureWithRulesOut(SalaryStructureOut):
    """Used when fetching a single structure and its rules in one response."""
    rules: List["SalaryRuleOut"] = []


# =====================================================
# Salary Rule Schemas
# =====================================================

class SalaryRuleCreate(BaseModel):
    structure_id: int
    name: str = Field(..., min_length=2, max_length=255)
    code: str = Field(..., min_length=2, max_length=100)
    category: RuleCategory
    sequence: int = Field(default=10, ge=1, le=9999)
    computation_type: ComputationType

    # Numeric fields use Decimal in the API layer to avoid floating-point issues.
    # The service layer converts to float before writing to the DB (since DB column is Numeric).
    fixed_amount: Optional[Decimal] = Field(default=None, ge=0)
    percentage_value: Optional[Decimal] = Field(default=None, ge=0, le=100)
    formula: Optional[str] = None
    is_active: bool = True

    @field_validator("code")
    @classmethod
    def normalize_code(cls, v: str) -> str:
        return v.strip().upper().replace(" ", "_")

    @model_validator(mode="after")
    def validate_computation_fields(self) -> "SalaryRuleCreate":
        """
        Each computation type requires specific fields:
        - FIXED: fixed_amount must be provided (the flat salary amount)
        - PERCENTAGE: percentage_value must be provided (e.g., 20 for 20%)
        - OVERTIME: fixed_amount must be provided (the multiplier, e.g., 1.5 for 1.5x)
        - LEAVE_DEDUCTION: no extra fields needed; engine uses daily_rate automatically
        - PYTHON_EXPRESSION: formula string must be provided
        """
        ct = self.computation_type

        if ct == ComputationType.FIXED and self.fixed_amount is None:
            raise ValueError("fixed_amount is required for FIXED rules.")

        if ct == ComputationType.PERCENTAGE and self.percentage_value is None:
            raise ValueError("percentage_value is required for PERCENTAGE rules (e.g., 20 for 20%).")

        if ct == ComputationType.OVERTIME and self.fixed_amount is None:
            raise ValueError(
                "fixed_amount is required for OVERTIME rules. "
                "It represents the multiplier (e.g., 1.5 for time-and-a-half)."
            )

        if ct == ComputationType.PYTHON_EXPRESSION and not self.formula:
            raise ValueError(
                "formula is required for PYTHON_EXPRESSION rules. "
                "Example: 'BASIC + HRA + DA' or 'contract.wage * 0.50'"
            )

        return self


class SalaryRuleOut(BaseModel):
    id: int
    structure_id: int
    name: str
    code: str
    category: RuleCategory
    sequence: int
    computation_type: ComputationType
    # Returned as float from DB; the payroll engine converts to Decimal internally.
    fixed_amount: Optional[float]
    percentage_value: Optional[float]
    formula: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# Needed because SalaryStructureWithRulesOut references SalaryRuleOut
SalaryStructureWithRulesOut.model_rebuild()
