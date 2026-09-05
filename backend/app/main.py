from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import settings

tags_metadata = [
    {"name": "Authentication", "description": "User login and profile verification."},
    {"name": "Employees", "description": "Employee directory, profiles, and onboarding."},
    {"name": "Contracts", "description": "Employment contracts, wage rates, and active assignments."},
    {"name": "Attendance", "description": "Daily attendance punches, working hours, and status tracking."},
    {"name": "Time Off", "description": "Leave applications, annual allocations, and approvals."},
    {"name": "Salary", "description": "Salary structures, pay components, and calculation rules."},
    {"name": "Health", "description": "Service health and status monitoring."},
    {"name": "hi", "description":"greets hi"}

]

app = FastAPI(
    title="PeoplePay360 API",
    description="REST API documentation for PeoplePay360 HR & Payroll engine.",
    version="1.0.0",
    openapi_tags=tags_metadata,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1 import payruns, payslips
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(payruns.router, prefix="/payruns", tags=["Payruns"], include_in_schema=False)
app.include_router(payslips.router, prefix="/payslips", tags=["Payslips"], include_in_schema=False)



@app.get("/health", tags=["Health"])
def health_check():
    
    return {"status": "ok", "project": settings.PROJECT_NAME}

@app.get("/hi", tags=["hi"])
def hi():
    return {"message":"hi"}
