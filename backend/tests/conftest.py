"""
conftest.py — pytest fixtures shared across all test files.

HOW IT WORKS:
- We override the `get_db` dependency so our app uses the in-memory test DB.
- CRITICAL: We use StaticPool so all connections share the SAME in-memory database.
  Without StaticPool, each new connection creates a fresh empty :memory: DB,
  meaning `create_all` runs on connection A but route handlers query on connection B
  and see no tables at all.
- The admin user is committed before the TestClient is created.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.security import create_access_token, get_password_hash
from app.db.session import get_db
from app.main import app
from app.models.models import Base, User, UserRole

# StaticPool forces all connections to reuse the same underlying SQLite connection.
# This is essential for in-memory SQLite in tests: without it each new connection
# would get an empty database, even within the same process.
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Override get_db BEFORE creating tables — so the app always uses the test engine.
app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Create tables once for the whole test session."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="session")
def db_session(setup_test_database):
    """Session-scoped DB session for inserting seed data in fixtures."""
    db = TestingSessionLocal()
    yield db
    db.close()


@pytest.fixture(scope="session")
def client(db_session):
    """
    Session-scoped TestClient. The same DB state persists across all tests —
    structures created in one test are available to rule tests that run after.
    """
    # Seed the test admin user needed for authenticated requests
    existing = db_session.query(User).filter(User.email == "test_admin@peoplepay.com").first()
    if not existing:
        admin_user = User(
            email="test_admin@peoplepay.com",
            hashed_password=get_password_hash("testpass123"),
            full_name="Test Admin",
            role=UserRole.ADMIN,
            is_active=True,
        )
        db_session.add(admin_user)
        db_session.commit()

    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="session")
def admin_headers():
    """JWT token for the test admin user."""
    token = create_access_token(subject="test_admin@peoplepay.com")
    return {"Authorization": f"Bearer {token}"}
