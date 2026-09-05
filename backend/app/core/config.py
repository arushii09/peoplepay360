import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "PeoplePay360: HR & Payroll"
    API_V1_STR: str = "/api/v1"
    
    # Database Settings: Default to PostgreSQL, with SQLite fallback support
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/peoplepay360"
    
    # JWT Security Settings
    SECRET_KEY: str = "super-secret-key-peoplepay360-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
