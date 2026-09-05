from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    PROJECT_NAME: str = "PeoplePay360: HR & Payroll"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./peoplepay360.db"
    
    SECRET_KEY: str = "super-secret-key-peoplepay360-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

