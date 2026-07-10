import uuid
import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.models.communication import MensajeEstado, MensajeTipo


class PlantillaIn(BaseModel):
    nombre: str
    contenido: str
    whatsapp_template_name: Optional[str] = None


class PlantillaOut(PlantillaIn):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    creado_en: datetime.datetime


class MensajeCreate(BaseModel):
    contact_id: uuid.UUID
    plantilla_id: Optional[uuid.UUID] = None
    tipo: MensajeTipo = MensajeTipo.TEXTO
    contenido: Optional[str] = None
    media_url: Optional[str] = None
    programado_para: Optional[datetime.datetime] = None


class MensajeMasivoCreate(BaseModel):
    """Envío del mismo mensaje/plantilla a varios contactos a la vez."""
    contact_ids: list[uuid.UUID]
    plantilla_id: Optional[uuid.UUID] = None
    tipo: MensajeTipo = MensajeTipo.TEXTO
    contenido: Optional[str] = None
    media_url: Optional[str] = None
    programado_para: Optional[datetime.datetime] = None


class MensajeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    contact_id: uuid.UUID
    tipo: MensajeTipo
    contenido: Optional[str] = None
    media_url: Optional[str] = None
    estado: MensajeEstado
    wa_message_id: Optional[str] = None
    programado_para: Optional[datetime.datetime] = None
    enviado_en: Optional[datetime.datetime] = None
