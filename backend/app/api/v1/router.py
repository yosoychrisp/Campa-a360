from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, users, contacts, dashboard, territorial, agenda,
    communications, reports, audit, settings as settings_endpoint, backup,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Autenticación"])
api_router.include_router(users.router, prefix="/users", tags=["Usuarios"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["Contactos"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(territorial.router, prefix="/territorial", tags=["Organización territorial"])
api_router.include_router(agenda.router, prefix="/agenda", tags=["Agenda"])
api_router.include_router(communications.router, prefix="/comunicaciones", tags=["Comunicaciones"])
api_router.include_router(reports.router, prefix="/reportes", tags=["Reportes"])
api_router.include_router(audit.router, prefix="/auditoria", tags=["Seguridad / Auditoría"])
api_router.include_router(settings_endpoint.router, prefix="/configuracion", tags=["Configuración"])
api_router.include_router(backup.router, prefix="/backup", tags=["Respaldo Google Drive"])
