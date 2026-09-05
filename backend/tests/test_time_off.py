from datetime import date
import pytest
from app.models.models import (
    Employee,
    LeaveAllocation,
    LeaveStatus,
    TimeOffRequest,
    TimeOffType,
)
from app.services.time_off_service import (
    approve_time_off_request,
    create_time_off_request,
    get_time_off_payroll_summary,
    reject_time_off_request,
)


@pytest.fixture(scope="module")
def sample_emp_and_types(db_session):
    """Fixture providing a test employee and paid/unpaid leave types."""
    emp = db_session.query(Employee).filter(Employee.email == "leave_test@peoplepay.com").first()
    if not emp:
        emp = Employee(
            first_name="Leave",
            last_name="Tester",
            email="leave_test@peoplepay.com",
            department="Operations",
            job_position="Analyst",
            status="ACTIVE"
        )
        db_session.add(emp)
        db_session.commit()
        db_session.refresh(emp)

    vacation_type = db_session.query(TimeOffType).filter(TimeOffType.code == "VACATION_TEST").first()
    if not vacation_type:
        vacation_type = TimeOffType(
            name="Test Vacation",
            code="VACATION_TEST",
            is_paid=True,
            requires_allocation=True
        )
        db_session.add(vacation_type)
        db_session.commit()
        db_session.refresh(vacation_type)

    unpaid_type = db_session.query(TimeOffType).filter(TimeOffType.code == "UNPAID_TEST").first()
    if not unpaid_type:
        unpaid_type = TimeOffType(
            name="Test Unpaid",
            code="UNPAID_TEST",
            is_paid=False,
            requires_allocation=False
        )
        db_session.add(unpaid_type)
        db_session.commit()
        db_session.refresh(unpaid_type)

    # Add allocation for vacation
    alloc = db_session.query(LeaveAllocation).filter(
        LeaveAllocation.employee_id == emp.id,
        LeaveAllocation.time_off_type_id == vacation_type.id,
        LeaveAllocation.year == 2026
    ).first()
    if not alloc:
        alloc = LeaveAllocation(
            employee_id=emp.id,
            time_off_type_id=vacation_type.id,
            allocated_days=15.0,
            taken_days=0.0,
            year=2026
        )
        db_session.add(alloc)
        db_session.commit()

    return emp, vacation_type, unpaid_type


class TestTimeOffLifecycle:
    def test_create_leave_request_pending(self, client, admin_headers, sample_emp_and_types):
        emp, vac_type, _ = sample_emp_and_types
        payload = {
            "employee_id": emp.id,
            "time_off_type_id": vac_type.id,
            "start_date": "2026-09-10",
            "end_date": "2026-09-12",
            "reason": "Trip"
        }
        res = client.post("/api/v1/time-off", json=payload, headers=admin_headers)
        assert res.status_code == 201
        data = res.json()
        assert data["employee_id"] == emp.id
        # 10th, 11th, 12th inclusive = 3.0 days
        assert data["days"] == 3.0
        assert data["status"] == "PENDING"

    def test_approve_leave_request(self, client, admin_headers, sample_emp_and_types, db_session):
        emp, vac_type, _ = sample_emp_and_types
        # Create request to approve
        payload = {
            "employee_id": emp.id,
            "time_off_type_id": vac_type.id,
            "start_date": "2026-09-15",
            "end_date": "2026-09-16",
            "reason": "Family function"
        }
        create_res = client.post("/api/v1/time-off", json=payload, headers=admin_headers)
        req_id = create_res.json()["id"]

        # Approve
        res = client.post(f"/api/v1/time-off/{req_id}/approve", headers=admin_headers)
        assert res.status_code == 200
        assert res.json()["status"] == "APPROVED"

        # Check that allocation taken_days was updated
        alloc = db_session.query(LeaveAllocation).filter(
            LeaveAllocation.employee_id == emp.id,
            LeaveAllocation.time_off_type_id == vac_type.id,
            LeaveAllocation.year == 2026
        ).first()
        assert alloc.taken_days >= 2.0

    def test_reject_leave_request(self, client, admin_headers, sample_emp_and_types):
        emp, vac_type, _ = sample_emp_and_types
        payload = {
            "employee_id": emp.id,
            "time_off_type_id": vac_type.id,
            "start_date": "2026-09-20",
            "end_date": "2026-09-21"
        }
        create_res = client.post("/api/v1/time-off", json=payload, headers=admin_headers)
        req_id = create_res.json()["id"]

        res = client.post(f"/api/v1/time-off/{req_id}/reject", headers=admin_headers)
        assert res.status_code == 200
        assert res.json()["status"] == "REFUSED"


class TestTimeOffValidations:
    def test_reject_invalid_date_range(self, client, admin_headers, sample_emp_and_types):
        emp, vac_type, _ = sample_emp_and_types
        payload = {
            "employee_id": emp.id,
            "time_off_type_id": vac_type.id,
            "start_date": "2026-09-25",
            "end_date": "2026-09-20"  # start after end
        }
        res = client.post("/api/v1/time-off", json=payload, headers=admin_headers)
        assert res.status_code == 400
        assert "cannot be after" in res.json()["detail"].lower()

    def test_reject_nonexistent_employee(self, client, admin_headers, sample_emp_and_types):
        _, vac_type, _ = sample_emp_and_types
        payload = {
            "employee_id": 999999,
            "time_off_type_id": vac_type.id,
            "start_date": "2026-09-10",
            "end_date": "2026-09-11"
        }
        res = client.post("/api/v1/time-off", json=payload, headers=admin_headers)
        assert res.status_code == 404

    def test_reject_nonexistent_leave_type(self, client, admin_headers, sample_emp_and_types):
        emp, _, _ = sample_emp_and_types
        payload = {
            "employee_id": emp.id,
            "time_off_type_id": 999999,
            "start_date": "2026-09-10",
            "end_date": "2026-09-11"
        }
        res = client.post("/api/v1/time-off", json=payload, headers=admin_headers)
        assert res.status_code == 404


class TestTimeOffPayrollIntegration:
    def test_payroll_summary_filters_only_approved_leave(self, db_session, sample_emp_and_types, client, admin_headers):
        """
        CRITICAL ARCHITECTURAL TEST:
        Proves that PENDING and REFUSED leaves are strictly IGNORED by the payroll summary.
        Only APPROVED leaves count, distinguishing paid vs unpaid days.
        """
        emp, vac_type, unpaid_type = sample_emp_and_types

        # 1. Create a PENDING request for October (3 days)
        pending_res = client.post("/api/v1/time-off", json={
            "employee_id": emp.id,
            "time_off_type_id": vac_type.id,
            "start_date": "2026-10-01",
            "end_date": "2026-10-03"
        }, headers=admin_headers)
        assert pending_res.status_code == 201

        # 2. Create and REJECT a request for October (2 days)
        reject_res = client.post("/api/v1/time-off", json={
            "employee_id": emp.id,
            "time_off_type_id": vac_type.id,
            "start_date": "2026-10-05",
            "end_date": "2026-10-06"
        }, headers=admin_headers)
        rejected_id = reject_res.json()["id"]
        client.post(f"/api/v1/time-off/{rejected_id}/reject", headers=admin_headers)

        # 3. Create and APPROVE a PAID request for October (2 days: Oct 12 - Oct 13)
        paid_res = client.post("/api/v1/time-off", json={
            "employee_id": emp.id,
            "time_off_type_id": vac_type.id,
            "start_date": "2026-10-12",
            "end_date": "2026-10-13"
        }, headers=admin_headers)
        paid_id = paid_res.json()["id"]
        client.post(f"/api/v1/time-off/{paid_id}/approve", headers=admin_headers)

        # 4. Create and APPROVE an UNPAID request for October (1 day: Oct 20)
        unpaid_res = client.post("/api/v1/time-off", json={
            "employee_id": emp.id,
            "time_off_type_id": unpaid_type.id,
            "start_date": "2026-10-20",
            "end_date": "2026-10-20"
        }, headers=admin_headers)
        unpaid_id = unpaid_res.json()["id"]
        client.post(f"/api/v1/time-off/{unpaid_id}/approve", headers=admin_headers)

        # 5. Query internal Payroll Summary for October
        summary = get_time_off_payroll_summary(
            db=db_session,
            employee_id=emp.id,
            period_start=date(2026, 10, 1),
            period_end=date(2026, 10, 31)
        )

        # Verification:
        # Total approved days = 2 (paid) + 1 (unpaid) = 3 days
        # PENDING (3 days) and REFUSED (2 days) MUST NOT be included!
        assert summary.approved_requests_count == 2
        assert summary.total_approved_days == 3.0
        assert summary.paid_leave_days == 2.0
        assert summary.unpaid_leave_days == 1.0
