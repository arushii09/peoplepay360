from fastapi import APIRouter

from app.api.v1 import contracts, employees

api_router = APIRouter()

api_router.include_router(employees.router, prefix="/employees", tags=["Employees"])
api_router.include_router(contracts.router, prefix="/contracts", tags=["Contracts"])
