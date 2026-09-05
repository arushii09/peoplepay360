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
    """Create all database tables and populate initial seed data."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding Users...")
        users_data = [
            {
                "email": "admin@peoplepay.com",
                "password": "admin123",
                "full_name": "System Admin",
                "role": UserRole.ADMIN,
            },
            {
                "email": "hr@peoplepay.com",
                "password": "hr123",
                "full_name": "HR Manager",
                "role": UserRole.HR_MANAGER,
            },
            {
                "email": "payroll@peoplepay.com",
                "password": "payroll123",
                "full_name": "Payroll Manager",
                "role": UserRole.HR_PAYROLL_MANAGER,
            },
            {
                "email": "alex@peoplepay.com",
                "password": "employee123",
                "full_name": "Alex Vance",
                "role": UserRole.EMPLOYEE,
            },
            {
                "email": "bob@peoplepay.com",
                "password": "employee123",
                "full_name": "Bob Miller",
                "role": UserRole.EMPLOYEE,
            },
        ]
        
        user_objects = {}
        for u in users_data:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                user_obj = User(
                    email=u["email"],
                    hashed_password=get_password_hash(u["password"]),
                    full_name=u["full_name"],
                    role=u["role"],
                    is_active=True
                )
                db.add(user_obj)
                db.flush()
                user_objects[u["email"]] = user_obj
            else:
                user_objects[u["email"]] = existing
        
        print("Seeding Working Schedule...")
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

        print("Seeding Time Off Types...")
        time_off_types_data = [
            {"name": "Paid Annual Leave", "code": "VACATION", "is_paid": True, "requires_allocation": True},
            {"name": "Sick Leave", "code": "SICK", "is_paid": True, "requires_allocation": True},
            {"name": "Unpaid Leave", "code": "UNPAID", "is_paid": False, "requires_allocation": False},
        ]
        
        tot_objects = {}
        for tot in time_off_types_data:
            existing = db.query(TimeOffType).filter(TimeOffType.code == tot["code"]).first()
            if not existing:
                tot_obj = TimeOffType(**tot)
                db.add(tot_obj)
                db.flush()
                tot_objects[tot["code"]] = tot_obj
            else:
                tot_objects[tot["code"]] = existing

        print("Seeding Salary Structure and Rules...")
        structure = db.query(SalaryStructure).filter(SalaryStructure.code == "CORP_EXEC_2026").first()
        if not structure:
            structure = SalaryStructure(
                name="Standard Corporate Executive 2026",
                code="CORP_EXEC_2026",
                description="Standard Executive Salary Structure for 2026",
                is_active=True
            )
            db.add(structure)
            db.flush()

            rules_data = [
                {
                    "structure_id": structure.id,
                    "name": "Basic Salary",
                    "code": "BASIC",
                    "category": RuleCategory.BASIC,
                    "sequence": 10,
                    "computation_type": ComputationType.PYTHON_EXPRESSION,
                    "formula": "contract.wage * 0.50",
                    "is_active": True,
                },
                {
                    "structure_id": structure.id,
                    "name": "House Rent Allowance",
                    "code": "HRA",
                    "category": RuleCategory.ALLOWANCE,
                    "sequence": 20,
                    "computation_type": ComputationType.PYTHON_EXPRESSION,
                    "formula": "contract.wage * 0.20",
                    "is_active": True,
                },
                {
                    "structure_id": structure.id,
                    "name": "Dearness Allowance",
                    "code": "DA",
                    "category": RuleCategory.ALLOWANCE,
                    "sequence": 30,
                    "computation_type": ComputationType.PYTHON_EXPRESSION,
                    "formula": "contract.wage * 0.10",
                    "is_active": True,
                },
                {
                    "structure_id": structure.id,
                    "name": "Gross Wage",
                    "code": "GROSS",
                    "category": RuleCategory.GROSS,
                    "sequence": 40,
                    "computation_type": ComputationType.PYTHON_EXPRESSION,
                    "formula": "BASIC + HRA + DA",
                    "is_active": True,
                },
                {
                    "structure_id": structure.id,
                    "name": "Provident Fund",
                    "code": "PF",
                    "category": RuleCategory.DEDUCTION,
                    "sequence": 50,
                    "computation_type": ComputationType.PYTHON_EXPRESSION,
                    "formula": "BASIC * 0.12",
                    "is_active": True,
                },
                {
                    "structure_id": structure.id,
                    "name": "Net Wage",
                    "code": "NET",
                    "category": RuleCategory.NET,
                    "sequence": 100,
                    "computation_type": ComputationType.PYTHON_EXPRESSION,
                    "formula": "GROSS - PF",
                    "is_active": True,
                },
            ]
            for r in rules_data:
                db.add(SalaryRule(**r))
            db.flush()

        print("Seeding Hero Employee (Alex Vance)...")
        alex_emp = db.query(Employee).filter(Employee.email == "alex@peoplepay.com").first()
        if not alex_emp:
            alex_user = user_objects["alex@peoplepay.com"]
            alex_emp = Employee(
                user_id=alex_user.id,
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

            # Active Contract ($6000/mo)
            alex_contract = Contract(
                name="Alex Vance - Senior Engineer Contract",
                employee_id=alex_emp.id,
                start_date=date(2026, 1, 1),
                wage=6000.0,
                salary_structure_id=structure.id,
                status=ContractStatus.ACTIVE
            )
            db.add(alex_contract)

            # Leave Allocation (20 days)
            vacation_tot = tot_objects["VACATION"]
            alex_alloc = LeaveAllocation(
                employee_id=alex_emp.id,
                time_off_type_id=vacation_tot.id,
                allocated_days=20.0,
                taken_days=2.0,
                year=2026
            )
            db.add(alex_alloc)

            # Approved 2-day Leave Request
            alex_leave_req = TimeOffRequest(
                employee_id=alex_emp.id,
                time_off_type_id=vacation_tot.id,
                start_date=date(2026, 8, 10),
                end_date=date(2026, 8, 11),
                days=2.0,
                reason="Summer Vacation",
                status=LeaveStatus.APPROVED
            )
            db.add(alex_leave_req)

            # 5 Days Attendance with Overtime
            for day_num in range(3, 8):
                att = Attendance(
                    employee_id=alex_emp.id,
                    date=date(2026, 8, day_num),
                    check_in=datetime(2026, 8, day_num, 9, 0, 0),
                    check_out=datetime(2026, 8, day_num, 18, 30, 0),
                    worked_hours=8.0,
                    overtime_hours=1.5,
                    status=AttendanceStatus.OVERTIME,
                    notes="Sprint release overtime"
                )
                db.add(att)
            db.flush()

        print("Seeding Problem Employee (Bob Miller)...")
        bob_emp = db.query(Employee).filter(Employee.email == "bob@peoplepay.com").first()
        if not bob_emp:
            bob_user = user_objects["bob@peoplepay.com"]
            bob_emp = Employee(
                user_id=bob_user.id,
                first_name="Bob",
                last_name="Miller",
                email="bob@peoplepay.com",
                phone="+1-555-0102",
                department="Sales",
                job_position="Sales Representative",
                schedule_id=schedule.id,
                status="ACTIVE",
                bank_account_no=None,  # Intentionally missing bank details & tax ID
                bank_name=None,
                ifsc_code=None,
                tax_id=None
            )
            db.add(bob_emp)
            db.flush()

            # Active Contract ($4000/mo)
            bob_contract = Contract(
                name="Bob Miller - Sales Contract",
                employee_id=bob_emp.id,
                start_date=date(2026, 1, 1),
                wage=4000.0,
                salary_structure_id=structure.id,
                status=ContractStatus.ACTIVE
            )
            db.add(bob_contract)
            db.flush()

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
