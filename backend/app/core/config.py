"""
Application configuration settings
"""
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database mode: "supabase" or "sqlite"
    # Default to SQLite for local development if Supabase is not configured
    DATABASE_MODE: str = "sqlite"
    USE_SQLITE: str = "true"  # Default to SQLite for local development
    
    # Supabase (required if DATABASE_MODE is "supabase")
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # JWT
    JWT_SECRET_KEY: str = "dev-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    # Railway
    RAILWAY_ENVIRONMENT: str = "production"
    PORT: int = 8000
    
    # n8n
    N8N_WEBHOOK_URL: str = ""
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert CORS origins string to list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields in .env

settings = Settings()

