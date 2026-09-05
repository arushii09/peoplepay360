from fastapi import APIRouter

from app.api.routes import auth, salary
from app.api.v1 import attendance, contracts, employees, payruns, payslips, time_off

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(employees.router, prefix="/employees", tags=["Employees"])
api_router.include_router(contracts.router, prefix="/contracts", tags=["Contracts"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])
api_router.include_router(time_off.router, prefix="/time-off", tags=["Time Off"])
api_router.include_router(salary.router, tags=["Salary"])
api_router.include_router(payruns.router, prefix="/payruns", tags=["Payruns"])
api_router.include_router(payslips.router, prefix="/payslips", tags=["Payslips"])


