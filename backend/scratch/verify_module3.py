import os
import sys
from datetime import date

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.core.security import create_access_token
from app.db.session import SessionLocal
from app.main import app
from app.models.models import User, UserRole
from app.services.contract_service import get_active_contract_for_period


def verify_module3():
    print("==========================================")
    print("   Module 3 Implementation Verification   ")
    print("==========================================")

    client = TestClient(app)
    db = SessionLocal()

    try:
        # 1. Health check
        res = client.get("/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("[OK] Health check endpoint passed")

        # 2. Get tokens for HR Admin & Employee
        hr_token = create_access_token(subject="hr@peoplepay.com")
        emp_token = create_access_token(subject="alex@peoplepay.com")

        hr_headers = {"Authorization": f"Bearer {hr_token}"}
        emp_headers = {"Authorization": f"Bearer {emp_token}"}

        # 3. Test List Employees with search & filters
        res = client.get("/api/v1/employees?search=Alex", headers=emp_headers)
        assert res.status_code == 200, f"List employees search failed: {res.text}"
        data = res.json()
        assert len(data) >= 1 and data[0]["email"] == "alex@peoplepay.com"
        print(f"[OK] GET /api/v1/employees?search=Alex returned {len(data)} employee(s)")

        res = client.get("/api/v1/employees?department=Sales", headers=emp_headers)
        assert res.status_code == 200
        data = res.json()
        assert len(data) >= 1 and data[0]["first_name"] == "Bob"
        print(f"[OK] GET /api/v1/employees?department=Sales returned {len(data)} employee(s)")

        # 4. Test Create Employee (POST /api/v1/employees)
        new_emp_payload = {
            "first_name": "Charlie",
            "last_name": "Davis",
            "email": "charlie@peoplepay.com",
            "department": "Engineering",
            "job_position": "QA Engineer",
            "status": "ACTIVE"
        }
        res = client.post("/api/v1/employees", json=new_emp_payload, headers=hr_headers)
        assert res.status_code == 201, f"Create employee failed: {res.text}"
        charlie = res.json()
        print(f"[OK] POST /api/v1/employees created employee ID: {charlie['id']}")

        # Duplicate email test
        res = client.post("/api/v1/employees", json=new_emp_payload, headers=hr_headers)
        assert res.status_code == 400, f"Expected 400 for duplicate email, got: {res.status_code}"
        print("[OK] Duplicate email prevention verified (HTTP 400)")

        # 5. Test Get & Update Employee
        res = client.get(f"/api/v1/employees/{charlie['id']}", headers=emp_headers)
        assert res.status_code == 200
        assert res.json()["first_name"] == "Charlie"
        print(f"[OK] GET /api/v1/employees/{charlie['id']} verified")

        update_payload = {"phone": "+1-555-9999", "job_position": "Lead QA Engineer"}
        res = client.put(f"/api/v1/employees/{charlie['id']}", json=update_payload, headers=hr_headers)
        assert res.status_code == 200
        assert res.json()["job_position"] == "Lead QA Engineer"
        print(f"[OK] PUT /api/v1/employees/{charlie['id']} verified")

        # 6. Test Smart Counts (GET /api/v1/employees/{id}/smart-counts)
        # Fetch Alex Vance ID from email search
        alex_res = client.get("/api/v1/employees?search=alex@peoplepay.com", headers=emp_headers).json()
        alex_id = alex_res[0]["id"]

        res = client.get(f"/api/v1/employees/{alex_id}/smart-counts", headers=emp_headers)
        assert res.status_code == 200
        counts = res.json()
        print(f"[OK] Smart Counts for Alex Vance: Active Contracts={counts['active_contracts_count']}, Attendance Days={counts['attendance_days_this_month']}, Remaining Leave={counts['remaining_leave_balance']}")
        assert counts["active_contracts_count"] >= 1
        assert counts["remaining_leave_balance"] == 18.0

        # 7. Test Contract Period Service Function
        active_contract = get_active_contract_for_period(
            db=db,
            employee_id=alex_id,
            period_start=date(2026, 8, 1),
            period_end=date(2026, 8, 31)
        )
        assert active_contract is not None and active_contract.wage == 6000.0
        print(f"[OK] get_active_contract_for_period service function returned active contract ID: {active_contract.id} (${active_contract.wage}/mo)")

        # 8. Test Contract End Date Validation (POST /api/v1/contracts)
        invalid_contract_payload = {
            "name": "Invalid Date Contract",
            "employee_id": alex_id,
            "start_date": "2026-12-31",
            "end_date": "2026-01-01",
            "wage": 5000.0,
            "salary_structure_id": 1,
            "status": "ACTIVE"
        }
        res = client.post("/api/v1/contracts", json=invalid_contract_payload, headers=hr_headers)
        assert res.status_code == 400, f"Expected HTTP 400 for invalid dates, got: {res.status_code}"
        print("[OK] Contract date validation (start_date < end_date) verified (HTTP 400)")

        print("\nALL MODULE 3 VERIFICATION CHECKS PASSED PERFECTLY!")

    finally:
        db.close()


if __name__ == "__main__":
    verify_module3()
