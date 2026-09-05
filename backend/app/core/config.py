from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central application configuration loaded from environment variables or .env file.
    Uses pydantic-settings for type safety and automatic validation.
    """
    PROJECT_NAME: str = "PeoplePay360: HR & Payroll"
    API_V1_STR: str = "/api/v1"
    
    # Database connection string (defaults to local PostgreSQL, overridden by .env for SQLite fallback)
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/peoplepay360"
    
    # JWT Authentication configuration
    SECRET_KEY: str = "super-secret-key-peoplepay360-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # Token lifespan: 24 hours (1440 minutes)

    # Automatically read settings from .env file if present
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


# Global settings singleton instance
settings = Settings()
