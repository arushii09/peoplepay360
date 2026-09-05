from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import auth, salary

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Integrated HR + Payroll Management Platform",
    version="1.0.0",
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

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(salary.router, prefix=f"{settings.API_V1_STR}", tags=["Salary"])


@app.get("/health", tags=["Health"])
def health_check():
    """Simple health check endpoint. Useful for deployment probes."""
    return {"status": "ok", "project": settings.PROJECT_NAME}
