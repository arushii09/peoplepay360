from datetime import date, datetime
from app.core.security import get_password_hash
from app.db.session import engine, SessionLocal
from app.models.models import (
    Attendance,
    AttendanceStatus,
    Base,
    Contract,
    ContractStatus,
    ComputationType,
    Employee,
    LeaveAllocation,
    LeaveStatus,
    RuleCategory,
    SalaryRule,
    SalaryStructure,
    TimeOffRequest,
    TimeOffType,
    User,
    UserRole,
    WorkingSchedule,
)


def seed_database():
    """
    Populates database with realistic test data for Phase 1 development and testing.
    Creates tables if they don't exist and seeds users, schedules, time off types,
    salary structures, rules, and hero/problem employee records.
    """
    print("[1/6] Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("[2/6] Seeding system users with distinct roles...")
        users_to_seed = [
            {"email": "admin@peoplepay.com", "password": "admin123", "full_name": "System Admin", "role": UserRole.ADMIN},
            {"email": "hr@peoplepay.com", "password": "hr123", "full_name": "HR Manager", "role": UserRole.HR_MANAGER},
            {"email": "payroll@peoplepay.com", "password": "payroll123", "full_name": "Payroll Manager", "role": UserRole.HR_PAYROLL_MANAGER},
            {"email": "alex@peoplepay.com", "password": "employee123", "full_name": "Alex Vance", "role": UserRole.EMPLOYEE},
            {"email": "bob@peoplepay.com", "password": "employee123", "full_name": "Bob Miller", "role": UserRole.EMPLOYEE},
        ]
        
        user_records = {}
        for u in users_to_seed:
            user = db.query(User).filter(User.email == u["email"]).first()
            if not user:
                user = User(
                    email=u["email"],
                    hashed_password=get_password_hash(u["password"]),
                    full_name=u["full_name"],
                    role=u["role"],
                    is_active=True
                )
                db.add(user)
                db.flush()
            user_records[u["email"]] = user
        
        print("[3/6] Seeding default 40h working schedule...")
        schedule = db.query(WorkingSchedule).filter(WorkingSchedule.name == "Standard 40h Schedule").first()
        if not schedule:
            schedule = WorkingSchedule(
                name="Standard 40h Schedule",
                schedule_type="FULL_TIME",
                weekly_hours=40.0,
                pattern_json={
                    "monday": {"start": "09:00", "end": "17:00", "break_hours": 1.0},
                    "tuesday": {"start": "09:00", "end": "17:00", "break_hours": 1.0},
                    "wednesday": {"start": "09:00", "end": "17:00", "break_hours": 1.0},
                    "thursday": {"start": "09:00", "end": "17:00", "break_hours": 1.0},
                    "friday": {"start": "09:00", "end": "17:00", "break_hours": 1.0},
                }
            )
            db.add(schedule)
            db.flush()

        print("[4/6] Seeding time off categories...")
        time_off_data = [
            {"name": "Paid Annual Leave", "code": "VACATION", "is_paid": True, "requires_allocation": True},
            {"name": "Sick Leave", "code": "SICK", "is_paid": True, "requires_allocation": True},
            {"name": "Unpaid Leave", "code": "UNPAID", "is_paid": False, "requires_allocation": False},
        ]
        
        time_off_records = {}
        for tot in time_off_data:
            tot_obj = db.query(TimeOffType).filter(TimeOffType.code == tot["code"]).first()
            if not tot_obj:
                tot_obj = TimeOffType(**tot)
                db.add(tot_obj)
                db.flush()
            time_off_records[tot["code"]] = tot_obj

        print("[5/6] Seeding salary structure (CORP_EXEC_2026) & 6 sequenced calculation rules...")
        salary_structure = db.query(SalaryStructure).filter(SalaryStructure.code == "CORP_EXEC_2026").first()
        if not salary_structure:
            salary_structure = SalaryStructure(
                name="Standard Corporate Executive 2026",
                code="CORP_EXEC_2026",
                description="Standard Executive Salary Structure for 2026",
                is_active=True
            )
            db.add(salary_structure)
            db.flush()

            # Sequence defines rule execution order in payroll engine
            rules = [
                {"name": "Basic Salary", "code": "BASIC", "category": RuleCategory.BASIC, "sequence": 10, "formula": "contract.wage * 0.50"},
                {"name": "House Rent Allowance", "code": "HRA", "category": RuleCategory.ALLOWANCE, "sequence": 20, "formula": "contract.wage * 0.20"},
                {"name": "Dearness Allowance", "code": "DA", "category": RuleCategory.ALLOWANCE, "sequence": 30, "formula": "contract.wage * 0.10"},
                {"name": "Gross Earnings", "code": "GROSS", "category": RuleCategory.GROSS, "sequence": 40, "formula": "BASIC + HRA + DA"},
                {"name": "Provident Fund", "code": "PF", "category": RuleCategory.DEDUCTION, "sequence": 50, "formula": "BASIC * 0.12"},
                {"name": "Net Salary", "code": "NET", "category": RuleCategory.NET, "sequence": 100, "formula": "GROSS - PF"},
            ]
            for r in rules:
                db.add(SalaryRule(
                    structure_id=salary_structure.id,
                    name=r["name"],
                    code=r["code"],
                    category=r["category"],
                    sequence=r["sequence"],
                    computation_type=ComputationType.PYTHON_EXPRESSION,
                    formula=r["formula"],
                    is_active=True
                ))
            db.flush()

        print("[6/6] Seeding realistic Hero and Problem employee records...")
        
        # 1. Hero Employee: Alex Vance (Complete record, valid bank details, active contract, leave, attendances)
        alex_emp = db.query(Employee).filter(Employee.email == "alex@peoplepay.com").first()
        if not alex_emp:
            alex_emp = Employee(
                user_id=user_records["alex@peoplepay.com"].id,
                first_name="Alex",
                last_name="Vance",
                email="alex@peoplepay.com",
                phone="+1-555-0101",
                department="Engineering",
                job_position="Senior Software Engineer",
                schedule_id=schedule.id,
                status="ACTIVE",
                bank_account_no="1234567890",
                bank_name="Chase Bank",
                ifsc_code="CHAS0001234",
                tax_id="TX-ALEX-9988"
            )
            db.add(alex_emp)
            db.flush()

            # Active Contract: $6,000 / month
            db.add(Contract(
                name="Alex Vance - Senior Engineer Contract",
                employee_id=alex_emp.id,
                start_date=date(2026, 1, 1),
                wage=6000.0,
                salary_structure_id=salary_structure.id,
                status=ContractStatus.ACTIVE
            ))

            # 20 Annual Leave Days Allocated
            vacation_type = time_off_records["VACATION"]
            db.add(LeaveAllocation(
                employee_id=alex_emp.id,
                time_off_type_id=vacation_type.id,
                allocated_days=20.0,
                taken_days=2.0,
                year=2026
            ))

            # Approved 2-day Leave Request
            db.add(TimeOffRequest(
                employee_id=alex_emp.id,
                time_off_type_id=vacation_type.id,
                start_date=date(2026, 8, 10),
                end_date=date(2026, 8, 11),
                days=2.0,
                reason="Summer Vacation",
                status=LeaveStatus.APPROVED
            ))

            # 5 Days Attendance with Overtime
            for day_num in range(3, 8):
                db.add(Attendance(
                    employee_id=alex_emp.id,
                    date=date(2026, 8, day_num),
                    check_in=datetime(2026, 8, day_num, 9, 0, 0),
                    check_out=datetime(2026, 8, day_num, 18, 30, 0),
                    worked_hours=8.0,
                    overtime_hours=1.5,
                    status=AttendanceStatus.OVERTIME,
                    notes="Sprint release overtime"
                ))

        # 2. Problem Employee: Bob Miller (Active contract $4,000/mo, but missing bank info to test payroll validation)
        bob_emp = db.query(Employee).filter(Employee.email == "bob@peoplepay.com").first()
        if not bob_emp:
            bob_emp = Employee(
                user_id=user_records["bob@peoplepay.com"].id,
                first_name="Bob",
                last_name="Miller",
                email="bob@peoplepay.com",
                phone="+1-555-0102",
                department="Sales",
                job_position="Sales Representative",
                schedule_id=schedule.id,
                status="ACTIVE",
                bank_account_no=None,  # Intentionally missing to trigger validation warnings
                bank_name=None,
                ifsc_code=None,
                tax_id=None
            )
            db.add(bob_emp)
            db.flush()

            # Active Contract: $4,000 / month
            db.add(Contract(
                name="Bob Miller - Sales Contract",
                employee_id=bob_emp.id,
                start_date=date(2026, 1, 1),
                wage=4000.0,
                salary_structure_id=salary_structure.id,
                status=ContractStatus.ACTIVE
            ))

        db.commit()
        print("Database seed completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
