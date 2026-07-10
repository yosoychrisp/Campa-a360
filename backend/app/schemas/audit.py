import uuid
import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict


class AuditLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    usuario_id: Optional[uuid.UUID] = None
    accion: str
    entidad: Optional[str] = None
    entidad_id: Optional[str] = None
    detalle: Optional[Any] = None
    ip_origen: Optional[str] = None
    fecha: datetime.datetime


class SettingsIn(BaseModel):
    nombre_campana: Optional[str] = None
    logo_url: Optional[str] = None
    color_primario: Optional[str] = None
    color_acento: Optional[str] = None


class SettingsOut(SettingsIn):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
