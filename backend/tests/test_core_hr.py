from datetime import date
import pytest
from app.core.security import get_password_hash
from app.models.models import Contract, Employee, SalaryStructure, User, UserRole
from app.services.contract_service import get_active_contract_for_period


@pytest.fixture(scope="module")
def setup_hr_data(db_session):
    """Seed prerequisite user and structure for Core HR tests."""
    user = db_session.query(User).filter(User.email == "hr_test_admin@peoplepay.com").first()
    if not user:
        user = User(
            email="hr_test_admin@peoplepay.com",
            hashed_password=get_password_hash("hrpass123"),
            full_name="HR Test Admin",
            role=UserRole.ADMIN,
            is_active=True
        )
        db_session.add(user)
        db_session.commit()

    structure = db_session.query(SalaryStructure).filter(SalaryStructure.code == "HR_TEST_STRUCT").first()
    if not structure:
        structure = SalaryStructure(
            name="HR Test Structure",
            code="HR_TEST_STRUCT",
            description="Testing contract linkages",
            is_active=True
        )
        db_session.add(structure)
        db_session.commit()
        db_session.refresh(structure)

    return user, structure


class TestAuthentication:
    def test_login_success(self, client, setup_hr_data):
        payload = {"username": "hr_test_admin@peoplepay.com", "password": "hrpass123"}
        res = client.post("/api/v1/auth/login", data=payload)
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_password(self, client, setup_hr_data):
        payload = {"username": "hr_test_admin@peoplepay.com", "password": "wrongpassword"}
        res = client.post("/api/v1/auth/login", data=payload)
        assert res.status_code == 401
        assert "incorrect" in res.json()["detail"].lower()

    def test_get_current_user_me(self, client, admin_headers):
        res = client.get("/api/v1/auth/me", headers=admin_headers)
        assert res.status_code == 200
        data = res.json()
        assert "email" in data
        assert "role" in data


class TestEmployees:
    def test_create_employee_success(self, client, admin_headers):
        payload = {
            "first_name": "Diana",
            "last_name": "Prince",
            "email": "diana@peoplepay.com",
            "department": "Security",
            "job_position": "Director",
            "status": "ACTIVE"
        }
        res = client.post("/api/v1/employees", json=payload, headers=admin_headers)
        assert res.status_code == 201
        data = res.json()
        assert data["email"] == "diana@peoplepay.com"
        assert "id" in data

    def test_reject_duplicate_employee_email(self, client, admin_headers):
        payload = {
            "first_name": "Diana",
            "last_name": "Prince",
            "email": "diana@peoplepay.com",
            "department": "Security",
            "job_position": "Director"
        }
        res = client.post("/api/v1/employees", json=payload, headers=admin_headers)
        assert res.status_code == 400
        assert "already registered" in res.json()["detail"].lower()

    def test_list_and_search_employees(self, client, admin_headers):
        res = client.get("/api/v1/employees?search=Diana", headers=admin_headers)
        assert res.status_code == 200
        data = res.json()
        assert len(data) >= 1
        assert data[0]["email"] == "diana@peoplepay.com"

    def test_get_employee_smart_counts(self, client, admin_headers):
        # Fetch Diana
        diana = client.get("/api/v1/employees?search=diana@peoplepay.com", headers=admin_headers).json()[0]
        res = client.get(f"/api/v1/employees/{diana['id']}/smart-counts", headers=admin_headers)
        assert res.status_code == 200
        counts = res.json()
        assert "active_contracts_count" in counts
        assert "attendance_days_this_month" in counts
        assert "remaining_leave_balance" in counts


class TestContracts:
    def test_create_contract_success(self, client, admin_headers, setup_hr_data):
        _, structure = setup_hr_data
        diana = client.get("/api/v1/employees?search=diana@peoplepay.com", headers=admin_headers).json()[0]

        payload = {
            "name": "Diana Executive Contract",
            "employee_id": diana["id"],
            "start_date": "2026-01-01",
            "end_date": "2026-12-31",
            "wage": 8500.0,
            "salary_structure_id": structure.id,
            "status": "ACTIVE"
        }
        res = client.post("/api/v1/contracts", json=payload, headers=admin_headers)
        assert res.status_code == 201
        data = res.json()
        assert data["wage"] == 8500.0
        assert data["status"] == "ACTIVE"

    def test_reject_contract_end_before_start(self, client, admin_headers, setup_hr_data):
        _, structure = setup_hr_data
        diana = client.get("/api/v1/employees?search=diana@peoplepay.com", headers=admin_headers).json()[0]

        payload = {
            "name": "Invalid Contract",
            "employee_id": diana["id"],
            "start_date": "2026-06-01",
            "end_date": "2026-05-01",
            "wage": 5000.0,
            "salary_structure_id": structure.id
        }
        res = client.post("/api/v1/contracts", json=payload, headers=admin_headers)
        assert res.status_code == 400
        assert "after start_date" in res.json()["detail"].lower()

    def test_contract_service_active_lookup(self, db_session, admin_headers, client):
        diana = client.get("/api/v1/employees?search=diana@peoplepay.com", headers=admin_headers).json()[0]
        contract = get_active_contract_for_period(
            db=db_session,
            employee_id=diana["id"],
            period_start=date(2026, 7, 1),
            period_end=date(2026, 7, 31)
        )
        assert contract is not None
        assert contract.wage == 8500.0
