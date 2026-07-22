"""
Servicio de respaldo automático en Google Drive.

Usa una "cuenta de servicio" de Google Cloud (no requiere que ningún usuario
inicie sesión manualmente). El administrador comparte una carpeta de su Drive
con el correo de la cuenta de servicio, y el sistema sube ahí un Excel
actualizado cada vez que cambian los contactos.

Variables de entorno requeridas (ver .env.example):
  - GOOGLE_SERVICE_ACCOUNT_JSON: contenido completo del archivo JSON de credenciales
  - GOOGLE_DRIVE_FOLDER_ID: ID de la carpeta de Drive destino
"""
import io
import json
import logging
from typing import Optional

from app.core.config import settings

logger = logging.getLogger("gdrive_backup")

SCOPES = ["https://www.googleapis.com/auth/drive.file"]
BACKUP_FILENAME = "contactos_campana360.xlsx"


def _get_service():
    if not settings.GOOGLE_SERVICE_ACCOUNT_JSON or not settings.GOOGLE_DRIVE_FOLDER_ID:
        return None
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build

        info = json.loads(settings.GOOGLE_SERVICE_ACCOUNT_JSON)
        creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
        return build("drive", "v3", credentials=creds, cache_discovery=False)
    except Exception:
        logger.exception("No se pudo inicializar el cliente de Google Drive")
        return None


def is_configured() -> bool:
    return bool(settings.GOOGLE_SERVICE_ACCOUNT_JSON and settings.GOOGLE_DRIVE_FOLDER_ID)


def upload_bytes(filename: str, data: bytes, mime_type: str) -> Optional[str]:
    """Sube (o sobrescribe si ya existe) un archivo en la carpeta configurada."""
    service = _get_service()
    if not service:
        return None
    try:
        from googleapiclient.http import MediaIoBaseUpload

        folder_id = settings.GOOGLE_DRIVE_FOLDER_ID
        query = f"name='{filename}' and '{folder_id}' in parents and trashed=false"
        results = service.files().list(q=query, fields="files(id)").execute()
        media = MediaIoBaseUpload(io.BytesIO(data), mimetype=mime_type, resumable=False)

        files = results.get("files", [])
        if files:
            file_id = files[0]["id"]
            service.files().update(fileId=file_id, media_body=media).execute()
            return file_id
        else:
            metadata = {"name": filename, "parents": [folder_id]}
            file = service.files().create(body=metadata, media_body=media, fields="id").execute()
            return file.get("id")
    except Exception:
        logger.exception("Error subiendo el respaldo a Google Drive")
        return None
