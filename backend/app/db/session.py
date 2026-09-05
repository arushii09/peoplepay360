from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

# SQLite requires check_same_thread=False because FastAPI handles requests across multiple worker threads
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# create_engine manages database connection pooling
# pool_pre_ping=True tests connection health before executing queries to prevent stale connection errors
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

# SessionLocal factory creates new database sessions per HTTP request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all SQLAlchemy ORM models
Base = declarative_base()


def get_db() -> Generator:
    """
    FastAPI dependency yielding a database session for a request and ensuring proper closure.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
