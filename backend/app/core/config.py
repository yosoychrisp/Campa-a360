from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "Campaña 360"
    API_V1_PREFIX: str = "/api/v1"

    # Base de datos
    DATABASE_URL: str = "postgresql://campana360:campana360@db:5432/campana360"

    # JWT
    SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION_USE_ENV_VAR"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 8  # 8 horas
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 días

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost"]

    # WhatsApp Business API (Meta Cloud API)
    WHATSAPP_API_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    WHATSAPP_API_VERSION: str = "v20.0"

    # Respaldo automático en Google Drive
    GOOGLE_SERVICE_ACCOUNT_JSON: str = ""  # contenido completo del archivo JSON de la cuenta de servicio
    GOOGLE_DRIVE_FOLDER_ID: str = ""  # ID de la carpeta de Drive donde se guarda el respaldo

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
