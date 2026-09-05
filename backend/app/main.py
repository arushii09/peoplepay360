from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import settings
from app.api.routes import auth, salary

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Integrated HR + Payroll Management Platform",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Allow the Next.js frontend (running on localhost:3000) to talk to this API.
# In production, replace "*" with the actual frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include unified API Router under /api/v1
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(salary.router, prefix=f"{settings.API_V1_STR}", tags=["Salary"])


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify backend service status."""
    return {"status": "ok", "project": settings.PROJECT_NAME}
