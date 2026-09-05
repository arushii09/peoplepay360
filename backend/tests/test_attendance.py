from datetime import date, datetime
import pytest
from app.models.models import Attendance, AttendanceStatus, Employee
from app.schemas.schemas import AttendanceCreate, AttendanceUpdate
from app.services.attendance_service import (
    create_attendance,
    get_attendance_payroll_summary,
    update_attendance,
)


@pytest.fixture(scope="module")
def sample_employee(db_session):
    """Fixture providing a persistent employee for attendance tests."""
    emp = db_session.query(Employee).filter(Employee.email == "att_test@peoplepay.com").first()
    if not emp:
        emp = Employee(
            first_name="Attendance",
            last_name="Tester",
            email="att_test@peoplepay.com",
            department="Engineering",
            job_position="Dev",
            status="ACTIVE"
        )
        db_session.add(emp)
        db_session.commit()
        db_session.refresh(emp)
    return emp


class TestAttendanceCRUD:
    def test_create_attendance_success(self, client, admin_headers, sample_employee):
        payload = {
            "employee_id": sample_employee.id,
            "date": "2026-09-01",
            "check_in": "2026-09-01T09:00:00",
            "check_out": "2026-09-01T17:00:00",
            "worked_hours": 8.0,
            "overtime_hours": 0.0,
            "notes": "Regular shift"
        }
        res = client.post("/api/v1/attendance", json=payload, headers=admin_headers)
        assert res.status_code == 201
        data = res.json()
        assert data["employee_id"] == sample_employee.id
        assert data["worked_hours"] == 8.0
        assert data["overtime_hours"] == 0.0
        assert data["status"] == "NORMAL"

    def test_retrieve_attendance_by_id_and_list(self, client, admin_headers, sample_employee):
        res = client.get(f"/api/v1/attendance?employee_id={sample_employee.id}", headers=admin_headers)
        assert res.status_code == 200
        items = res.json()
        assert len(items) >= 1
        att_id = items[0]["id"]

        detail_res = client.get(f"/api/v1/attendance/{att_id}", headers=admin_headers)
        assert detail_res.status_code == 200
        assert detail_res.json()["id"] == att_id

    def test_update_attendance(self, client, admin_headers, sample_employee):
        # Create a record on Sept 2 without check-out
        payload = {
            "employee_id": sample_employee.id,
            "date": "2026-09-02",
            "check_in": "2026-09-02T09:00:00"
        }
        res = client.post("/api/v1/attendance", json=payload, headers=admin_headers)
        assert res.status_code == 201
        att_id = res.json()["id"]

        # Update check_out and overtime
        update_payload = {
            "check_out": "2026-09-02T19:00:00",
            "worked_hours": 8.0,
            "overtime_hours": 2.0,
            "notes": "Late release"
        }
        patch_res = client.patch(f"/api/v1/attendance/{att_id}", json=update_payload, headers=admin_headers)
        assert patch_res.status_code == 200
        data = patch_res.json()
        assert data["overtime_hours"] == 2.0
        assert data["status"] == "OVERTIME"


class TestAttendanceValidations:
    def test_reject_invalid_employee(self, client, admin_headers):
        payload = {
            "employee_id": 999999,
            "date": "2026-09-03",
            "check_in": "2026-09-03T09:00:00"
        }
        res = client.post("/api/v1/attendance", json=payload, headers=admin_headers)
        assert res.status_code == 404
        assert "not found" in res.json()["detail"].lower()

    def test_reject_checkout_before_checkin(self, client, admin_headers, sample_employee):
        payload = {
            "employee_id": sample_employee.id,
            "date": "2026-09-03",
            "check_in": "2026-09-03T18:00:00",
            "check_out": "2026-09-03T09:00:00"
        }
        res = client.post("/api/v1/attendance", json=payload, headers=admin_headers)
        assert res.status_code == 400
        assert "earlier" in res.json()["detail"].lower()

    def test_reject_negative_hours(self, client, admin_headers, sample_employee):
        payload = {
            "employee_id": sample_employee.id,
            "date": "2026-09-04",
            "check_in": "2026-09-04T09:00:00",
            "worked_hours": -5.0
        }
        res = client.post("/api/v1/attendance", json=payload, headers=admin_headers)
        assert res.status_code == 400
        assert "negative" in res.json()["detail"].lower()

    def test_reject_duplicate_attendance_same_day(self, client, admin_headers, sample_employee):
        payload = {
            "employee_id": sample_employee.id,
            "date": "2026-09-05",
            "check_in": "2026-09-05T09:00:00",
            "worked_hours": 8.0
        }
        first = client.post("/api/v1/attendance", json=payload, headers=admin_headers)
        assert first.status_code == 201

        # Second creation on same date must be rejected
        second = client.post("/api/v1/attendance", json=payload, headers=admin_headers)
        assert second.status_code == 400
        assert "already exists" in second.json()["detail"].lower()

    def test_auto_calculate_worked_and_overtime_hours(self, client, admin_headers, sample_employee):
        # 9:00 to 18:30 is 9.5 hours -> 8.0 normal, 1.5 overtime
        payload = {
            "employee_id": sample_employee.id,
            "date": "2026-09-06",
            "check_in": "2026-09-06T09:00:00",
            "check_out": "2026-09-06T18:30:00"
        }
        res = client.post("/api/v1/attendance", json=payload, headers=admin_headers)
        assert res.status_code == 201
        data = res.json()
        assert data["worked_hours"] == 8.0
        assert data["overtime_hours"] == 1.5
        assert data["status"] == "OVERTIME"


class TestAttendancePayrollIntegration:
    def test_payroll_summary_service(self, db_session, sample_employee):
        """
        Integration test verifying that the internal python service contract
        aggregates hours accurately for a defined pay period without making HTTP calls.
        """
        summary = get_attendance_payroll_summary(
            db=db_session,
            employee_id=sample_employee.id,
            period_start=date(2026, 9, 1),
            period_end=date(2026, 9, 30)
        )
        assert summary.employee_id == sample_employee.id
        assert summary.total_worked_hours >= 24.0
        assert summary.total_overtime_hours >= 3.5
        assert summary.attendance_days_count >= 3
