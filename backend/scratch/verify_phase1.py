import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.session import SessionLocal
from app.models.models import (
    Attendance,
    Contract,
    Employee,
    LeaveAllocation,
    SalaryRule,
    SalaryStructure,
    TimeOffRequest,
    TimeOffType,
    User,
    UserRole,
    WorkingSchedule,
)


def verify_all():
    print("==========================================")
    print("     Phase 1 Implementation Verification  ")
    print("==========================================")

    # 1. Config Check
    print(f"[OK] Project Name: {settings.PROJECT_NAME}")
    print(f"[OK] Database URL: {settings.DATABASE_URL}")
    print(f"[OK] Algorithm: {settings.ALGORITHM}")

    # 2. Security Check
    test_pwd = "employee123"
    hashed = get_password_hash(test_pwd)
    assert verify_password(test_pwd, hashed) is True, "Password verification failed!"
    assert verify_password("wrongpassword", hashed) is False, "Invalid password passed verification!"
    print("[OK] Password hashing & verification passed")

    token = create_access_token(subject="alex@peoplepay.com")
    assert token is not None and len(token) > 20, "Token creation failed!"
    print("[OK] JWT Access token creation passed")

    # 3. DB Queries Check
    db = SessionLocal()
    try:
        # Check Users
        users = db.query(User).all()
        print(f"[OK] Seeded Users count: {len(users)}")
        assert len(users) >= 5, f"Expected at least 5 users, got {len(users)}"
        
        user_roles = {u.email: u.role for u in users}
        assert user_roles.get("admin@peoplepay.com") == UserRole.ADMIN
        assert user_roles.get("hr@peoplepay.com") == UserRole.HR_MANAGER
        assert user_roles.get("payroll@peoplepay.com") == UserRole.HR_PAYROLL_MANAGER
        assert user_roles.get("alex@peoplepay.com") == UserRole.EMPLOYEE
        assert user_roles.get("bob@peoplepay.com") == UserRole.EMPLOYEE
        print("[OK] User roles verified correctly")

        # Check Working Schedule
        schedules = db.query(WorkingSchedule).all()
        assert len(schedules) >= 1, "Working schedule not found!"
        print(f"[OK] Working Schedule: '{schedules[0].name}' ({schedules[0].weekly_hours} hrs/week)")

        # Check Time Off Types
        tot = db.query(TimeOffType).all()
        codes = [t.code for t in tot]
        assert "VACATION" in codes and "SICK" in codes and "UNPAID" in codes
        print(f"[OK] Time Off Types verified: {codes}")

        # Check Salary Structure & Rules
        structure = db.query(SalaryStructure).filter(SalaryStructure.code == "CORP_EXEC_2026").first()
        assert structure is not None, "Salary structure missing!"
        rule_codes = [r.code for r in structure.rules]
        print(f"[OK] Salary Structure '{structure.code}' with rules: {rule_codes}")
        assert rule_codes == ["BASIC", "HRA", "DA", "GROSS", "PF", "NET"], f"Unexpected rules: {rule_codes}"

        # Check Hero Employee (Alex Vance)
        alex = db.query(Employee).filter(Employee.email == "alex@peoplepay.com").first()
        assert alex is not None, "Alex Vance not found!"
        assert alex.bank_account_no == "1234567890" and alex.tax_id == "TX-ALEX-9988"
        assert len(alex.contracts) >= 1 and alex.contracts[0].wage == 6000.0
        assert len(alex.leave_allocations) >= 1 and alex.leave_allocations[0].allocated_days == 20.0
        assert len(alex.leave_requests) >= 1 and alex.leave_requests[0].days == 2.0
        assert len(alex.attendances) == 5
        print(f"[OK] Hero Employee (Alex Vance) verified: Contract=${alex.contracts[0].wage}/mo, {len(alex.attendances)} attendances, {alex.leave_allocations[0].allocated_days} leave days allocated.")

        # Check Problem Employee (Bob Miller)
        bob = db.query(Employee).filter(Employee.email == "bob@peoplepay.com").first()
        assert bob is not None, "Bob Miller not found!"
        assert bob.bank_account_no is None and bob.tax_id is None, "Bob Miller bank details should be missing!"
        assert len(bob.contracts) >= 1 and bob.contracts[0].wage == 4000.0
        print(f"[OK] Problem Employee (Bob Miller) verified: Contract=${bob.contracts[0].wage}/mo, Missing Bank Acc & Tax ID as required.")

        print("\nALL VERIFICATION CHECKS PASSED PERFECTLY!")
    finally:
        db.close()


if __name__ == "__main__":
    verify_all()
