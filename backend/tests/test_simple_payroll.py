from datetime import date
import uuid
import pytest
from app.models.models import (
    Contract,
    ContractStatus,
    Employee,
    LeaveStatus,
    PayrunStatus,
    SalaryStructure,
    TimeOffRequest,
    TimeOffType,
)


def get_or_create_structure(db_session):
    structure = db_session.query(SalaryStructure).filter(SalaryStructure.code == "STD_PAYROLL").first()
    if not structure:
        structure = SalaryStructure(
            name="Standard Payroll Structure",
            code="STD_PAYROLL",
            description="Base structure",
            is_active=True,
        )
        db_session.add(structure)
        db_session.commit()
        db_session.refresh(structure)
    return structure


def get_or_create_unpaid_type(db_session):
    unpaid_type = db_session.query(TimeOffType).filter(TimeOffType.code == "UNPAID_PAYROLL").first()
    if not unpaid_type:
        unpaid_type = TimeOffType(
            name="Unpaid Leave",
            code="UNPAID_PAYROLL",
            is_paid=False,
            requires_allocation=False,
        )
        db_session.add(unpaid_type)
        db_session.commit()
        db_session.refresh(unpaid_type)
    return unpaid_type


def create_dynamic_payroll_employee(db_session, wage=30000.0, leave_days=0.0):
    uid = uuid.uuid4().hex[:6]
    structure = get_or_create_structure(db_session)

    emp = Employee(
        first_name=f"First_{uid}",
        last_name=f"Last_{uid}",
        email=f"emp_{uid}@peoplepay.com",
        department="Engineering",
        job_position="Developer",
    )
    db_session.add(emp)
    db_session.commit()
    db_session.refresh(emp)

    contract = Contract(
        name=f"Contract_{uid}",
        employee_id=emp.id,
        start_date=date(2026, 1, 1),
        end_date=date(2026, 12, 31),
        wage=wage,
        salary_structure_id=structure.id,
        status=ContractStatus.ACTIVE,
    )
    db_session.add(contract)
    db_session.commit()
    db_session.refresh(contract)

    leave = None
    if leave_days > 0:
        unpaid_type = get_or_create_unpaid_type(db_session)
        start_d = date(2026, 9, 1)
        end_d = date(2026, 9, int(leave_days))
        leave = TimeOffRequest(
            employee_id=emp.id,
            time_off_type_id=unpaid_type.id,
            start_date=start_d,
            end_date=end_d,
            days=float(leave_days),
            reason="Unpaid personal leave",
            status=LeaveStatus.APPROVED,
        )
        db_session.add(leave)
        db_session.commit()
        db_session.refresh(leave)

    return emp, contract, leave


def test_1_create_payrun(client, admin_headers):
    period_start = date(2026, 9, 1)
    period_end = date(2026, 9, 30)
    payload = {
        "period_start": period_start.isoformat(),
        "period_end": period_end.isoformat(),
    }
    res = client.post("/payruns", json=payload, headers=admin_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["status"] == PayrunStatus.DRAFT.value
    assert data["period_start"] == payload["period_start"]
    assert data["period_end"] == payload["period_end"]
    assert "id" in data


def test_2_invalid_payrun_dates(client, admin_headers):
    payload = {
        "period_start": date(2026, 9, 30).isoformat(),
        "period_end": date(2026, 9, 1).isoformat(),
    }
    res = client.post("/payruns", json=payload, headers=admin_headers)
    assert res.status_code == 400
    assert "period_end cannot be before period_start" in res.json()["detail"]


def test_3_calculate_payroll(client, admin_headers, db_session):
    create_dynamic_payroll_employee(db_session, wage=25000.0, leave_days=0.0)

    payload = {
        "period_start": date(2026, 9, 1).isoformat(),
        "period_end": date(2026, 9, 30).isoformat(),
    }
    create_res = client.post("/payruns", json=payload, headers=admin_headers)
    assert create_res.status_code == 201
    payrun_id = create_res.json()["id"]

    calc_res = client.post(f"/payruns/{payrun_id}/calculate", headers=admin_headers)
    assert calc_res.status_code == 200
    calc_data = calc_res.json()
    assert calc_data["status"] == PayrunStatus.CALCULATED.value


def test_4_approved_unpaid_leave_deduction(client, admin_headers, db_session):
    test_wage = 30000.0
    test_days = 2.0
    emp, contract, leave = create_dynamic_payroll_employee(db_session, wage=test_wage, leave_days=test_days)

    expected_gross = float(contract.wage)
    daily_rate = expected_gross / 30.0
    expected_deduction = round(float(leave.days) * daily_rate, 2)
    expected_net = round(expected_gross - expected_deduction, 2)

    payload = {
        "period_start": date(2026, 9, 1).isoformat(),
        "period_end": date(2026, 9, 30).isoformat(),
    }
    create_res = client.post("/payruns", json=payload, headers=admin_headers)
    payrun_id = create_res.json()["id"]

    client.post(f"/payruns/{payrun_id}/calculate", headers=admin_headers)

    slips_res = client.get(f"/payruns/{payrun_id}/payslips", headers=admin_headers)
    assert slips_res.status_code == 200
    slips = slips_res.json()

    target_slip = next(s for s in slips if s["employee_id"] == emp.id)
    assert target_slip["gross_salary"] == expected_gross
    assert target_slip["leave_deduction"] == expected_deduction
    assert target_slip["net_salary"] == expected_net
    assert target_slip["status"] == PayrunStatus.CALCULATED.value


def test_5_payslip_creation(client, admin_headers, db_session):
    test_wage = 42000.0
    test_days = 3.0
    emp, contract, leave = create_dynamic_payroll_employee(db_session, wage=test_wage, leave_days=test_days)

    expected_gross = float(contract.wage)
    daily_rate = expected_gross / 30.0
    expected_deduction = round(float(leave.days) * daily_rate, 2)
    expected_net = round(expected_gross - expected_deduction, 2)
    expected_full_name = f"{emp.first_name} {emp.last_name}".strip()

    payload = {
        "period_start": date(2026, 9, 1).isoformat(),
        "period_end": date(2026, 9, 30).isoformat(),
    }
    create_res = client.post("/payruns", json=payload, headers=admin_headers)
    payrun_id = create_res.json()["id"]

    client.post(f"/payruns/{payrun_id}/calculate", headers=admin_headers)

    payrun_res = client.get(f"/payruns/{payrun_id}", headers=admin_headers)
    assert payrun_res.status_code == 200
    payrun_data = payrun_res.json()
    assert any(p["employee_id"] == emp.id for p in payrun_data["payslips"])

    slips_res = client.get(f"/payruns/{payrun_id}/payslips", headers=admin_headers)
    assert slips_res.status_code == 200
    slips = slips_res.json()
    target_slip = next(s for s in slips if s["employee_id"] == emp.id)
    assert target_slip["employee_name"] == expected_full_name

    single_slip_res = client.get(f"/payslips/{target_slip['id']}", headers=admin_headers)
    assert single_slip_res.status_code == 200
    single_slip = single_slip_res.json()
    assert single_slip["employee"]["id"] == emp.id
    assert single_slip["employee"]["first_name"] == emp.first_name
    assert single_slip["employee"]["last_name"] == emp.last_name
    assert single_slip["pay_period"]["period_start"] == payload["period_start"]
    assert single_slip["pay_period"]["period_end"] == payload["period_end"]
    assert single_slip["gross_salary"] == expected_gross
    assert single_slip["leave_deduction"] == expected_deduction
    assert single_slip["net_salary"] == expected_net
    assert single_slip["status"] == PayrunStatus.CALCULATED.value


def test_6_recalculating_payrun_without_duplicates(client, admin_headers, db_session):
    create_dynamic_payroll_employee(db_session, wage=35000.0, leave_days=1.0)

    payload = {
        "period_start": date(2026, 9, 1).isoformat(),
        "period_end": date(2026, 9, 30).isoformat(),
    }
    create_res = client.post("/payruns", json=payload, headers=admin_headers)
    payrun_id = create_res.json()["id"]

    client.post(f"/payruns/{payrun_id}/calculate", headers=admin_headers)
    slips_1 = client.get(f"/payruns/{payrun_id}/payslips", headers=admin_headers).json()
    count_1 = len(slips_1)

    client.post(f"/payruns/{payrun_id}/calculate", headers=admin_headers)
    slips_2 = client.get(f"/payruns/{payrun_id}/payslips", headers=admin_headers).json()
    count_2 = len(slips_2)

    assert count_1 == count_2
    assert count_1 > 0


def test_7_validate_payrun(client, admin_headers, db_session):
    create_dynamic_payroll_employee(db_session, wage=38000.0, leave_days=0.0)

    payload = {
        "period_start": date(2026, 9, 1).isoformat(),
        "period_end": date(2026, 9, 30).isoformat(),
    }
    create_res = client.post("/payruns", json=payload, headers=admin_headers)
    payrun_id = create_res.json()["id"]

    draft_val = client.post(f"/payruns/{payrun_id}/validate", headers=admin_headers)
    assert draft_val.status_code == 400

    client.post(f"/payruns/{payrun_id}/calculate", headers=admin_headers)

    calc_val = client.post(f"/payruns/{payrun_id}/validate", headers=admin_headers)
    assert calc_val.status_code == 200
    assert calc_val.json()["status"] == PayrunStatus.VALIDATED.value


def test_8_mark_payrun_as_paid(client, admin_headers, db_session):
    create_dynamic_payroll_employee(db_session, wage=40000.0, leave_days=1.0)

    payload = {
        "period_start": date(2026, 9, 1).isoformat(),
        "period_end": date(2026, 9, 30).isoformat(),
    }
    create_res = client.post("/payruns", json=payload, headers=admin_headers)
    payrun_id = create_res.json()["id"]

    fail_paid = client.post(f"/payruns/{payrun_id}/mark-paid", headers=admin_headers)
    assert fail_paid.status_code == 400

    client.post(f"/payruns/{payrun_id}/calculate", headers=admin_headers)
    fail_calc_paid = client.post(f"/payruns/{payrun_id}/mark-paid", headers=admin_headers)
    assert fail_calc_paid.status_code == 400

    client.post(f"/payruns/{payrun_id}/validate", headers=admin_headers)

    paid_res = client.post(f"/payruns/{payrun_id}/mark-paid", headers=admin_headers)
    assert paid_res.status_code == 200
    assert paid_res.json()["status"] == PayrunStatus.PAID.value

    slips = client.get(f"/payruns/{payrun_id}/payslips", headers=admin_headers).json()
    for s in slips:
        assert s["status"] == PayrunStatus.PAID.value


def test_list_payruns_and_api_v1_compatibility(client, admin_headers):
    list_res = client.get("/payruns", headers=admin_headers)
    assert list_res.status_code == 200
    data = list_res.json()
    assert len(data) > 0
    first = data[0]
    assert "id" in first
    assert "period_start" in first
    assert "period_end" in first
    assert "status" in first

    v1_res = client.get("/api/v1/payruns", headers=admin_headers)
    assert v1_res.status_code == 200
    assert len(v1_res.json()) == len(data)
