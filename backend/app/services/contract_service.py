from datetime import date
from typing import Optional
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.models import Contract, ContractStatus


def get_active_contract_for_period(
    db: Session,
    employee_id: int,
    period_start: date,
    period_end: date
) -> Optional[Contract]:
    """
    Finds the active employment contract for an employee during a given pay period.
    Logic: Matches contract where:
    - employee_id == employee_id
    - status == 'ACTIVE'
    - start_date <= period_end
    - (end_date >= period_start OR end_date IS NULL)
    Ordered by start_date descending to return the latest contract.
    """
    return (
        db.query(Contract)
        .filter(
            Contract.employee_id == employee_id,
            Contract.status == ContractStatus.ACTIVE,
            Contract.start_date <= period_end,
            or_(Contract.end_date >= period_start, Contract.end_date.is_(None)),
        )
        .order_by(Contract.start_date.desc())
        .first()
    )
