import os
import sys
from datetime import date, timedelta

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.core.security import create_access_token
from app.db.session import SessionLocal
from app.main import app
from app.models.models import Employee, LeaveAllocation, TimeOffType


def verify_module6():
    print("==========================================")
    print("   Module 6 Implementation Verification   ")
    print("==========================================")

    client = TestClient(app)
    db = SessionLocal()

    try:
        hr_token = create_access_token(subject="hr@peoplepay.com")
        emp_token = create_access_token(subject="alex@peoplepay.com")

        hr_headers = {"Authorization": f"Bearer {hr_token}"}
        emp_headers = {"Authorization": f"Bearer {emp_token}"}

        # 1. Test GET /api/v1/time-off/types
        res = client.get("/api/v1/time-off/types", headers=emp_headers)
        assert res.status_code == 200, f"Get leave types failed: {res.text}"
        types = res.json()
        codes = [t["code"] for t in types]
        assert "VACATION" in codes and "SICK" in codes and "UNPAID" in codes
        print(f"[OK] GET /api/v1/time-off/types returned {len(types)} leave types: {codes}")

        # Fetch Alex Vance employee ID
        alex = db.query(Employee).filter(Employee.email == "alex@peoplepay.com").first()
        assert alex is not None, "Alex Vance employee not found in database!"
        vacation_type = db.query(TimeOffType).filter(TimeOffType.code == "VACATION").first()

        # 2. Test GET /api/v1/time-off/allocations
        res = client.get(f"/api/v1/time-off/allocations?employee_id={alex.id}", headers=emp_headers)
        assert res.status_code == 200, f"Get allocations failed: {res.text}"
        allocations = res.json()
        assert len(allocations) >= 1
        alloc = allocations[0]
        assert "remaining_days" in alloc
        print(f"[OK] GET /api/v1/time-off/allocations returned allocation with remaining_days={alloc['remaining_days']}")

        # 3. Test POST /api/v1/time-off/requests (Valid Request)
        today = date.today()
        start = today + timedelta(days=30)
        end = start + timedelta(days=1)

        req_payload = {
            "employee_id": alex.id,
            "time_off_type_id": vacation_type.id,
            "start_date": start.isoformat(),
            "end_date": end.isoformat(),
            "days": 2.0,
            "reason": "Family vacation"
        }
        res = client.post("/api/v1/time-off/requests", json=req_payload, headers=emp_headers)
        assert res.status_code == 201, f"Create leave request failed: {res.text}"
        req_data = res.json()
        req_id = req_data["id"]
        assert req_data["status"] == "PENDING"
        print(f"[OK] POST /api/v1/time-off/requests submitted request ID #{req_id} (Status: PENDING)")

        # 4. Test Insufficient Leave Balance validation (HTTP 400)
        excessive_payload = {
            "employee_id": alex.id,
            "time_off_type_id": vacation_type.id,
            "start_date": start.isoformat(),
            "end_date": (start + timedelta(days=100)).isoformat(),
            "days": 101.0,
            "reason": "Excessive vacation request"
        }
        res = client.post("/api/v1/time-off/requests", json=excessive_payload, headers=emp_headers)
        assert res.status_code == 400, f"Expected 400 for excessive leave, got {res.status_code}"
        assert "Insufficient leave balance" in res.json()["detail"]
        print("[OK] Insufficient leave balance validation verified (HTTP 400)")

        # 5. Test POST /api/v1/time-off/requests/{id}/approve
        # Check initial taken days
        initial_alloc = db.query(LeaveAllocation).filter(
            LeaveAllocation.employee_id == alex.id,
            LeaveAllocation.time_off_type_id == vacation_type.id,
            LeaveAllocation.year == start.year
        ).first()
        initial_taken = initial_alloc.taken_days

        res = client.post(f"/api/v1/time-off/requests/{req_id}/approve", headers=hr_headers)
        assert res.status_code == 200, f"Approve leave request failed: {res.text}"
        assert res.json()["status"] == "APPROVED"

        db.refresh(initial_alloc)
        assert initial_alloc.taken_days == initial_taken + 2.0
        print(f"[OK] POST /api/v1/time-off/requests/{req_id}/approve approved request & updated taken_days ({initial_taken} -> {initial_alloc.taken_days})")

        # 6. Test POST /api/v1/time-off/requests/{id}/refuse
        # Submit another request and refuse it
        req2_payload = {
            "employee_id": alex.id,
            "time_off_type_id": vacation_type.id,
            "start_date": (start + timedelta(days=10)).isoformat(),
            "end_date": (start + timedelta(days=10)).isoformat(),
            "days": 1.0,
            "reason": "Personal day"
        }
        res = client.post("/api/v1/time-off/requests", json=req2_payload, headers=emp_headers)
        req2_id = res.json()["id"]

        res = client.post(f"/api/v1/time-off/requests/{req2_id}/refuse", headers=hr_headers)
        assert res.status_code == 200
        assert res.json()["status"] == "REFUSED"
        print(f"[OK] POST /api/v1/time-off/requests/{req2_id}/refuse refused request (Status: REFUSED)")

        print("\nALL MODULE 6 VERIFICATION CHECKS PASSED PERFECTLY!")

    finally:
        db.close()


if __name__ == "__main__":
    verify_module6()
