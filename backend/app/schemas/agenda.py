import uuid
import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.models.agenda import EventoTipo


class EventoBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    tipo: EventoTipo = EventoTipo.REUNION
    fecha_inicio: datetime.datetime
    fecha_fin: Optional[datetime.datetime] = None
    lugar: Optional[str] = None


class EventoCreate(EventoBase):
    responsable_id: Optional[uuid.UUID] = None


class EventoUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    tipo: Optional[EventoTipo] = None
    fecha_inicio: Optional[datetime.datetime] = None
    fecha_fin: Optional[datetime.datetime] = None
    lugar: Optional[str] = None


class EventoOut(EventoBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    responsable_id: uuid.UUID
    creado_en: datetime.datetime
