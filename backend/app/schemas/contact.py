import uuid
import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.models.contact import ContactStatus


class ContactBase(BaseModel):
    nombre: str
    apellido: str
    documento: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[str] = None
    direccion: Optional[str] = None
    municipio_id: Optional[uuid.UUID] = None
    barrio_id: Optional[uuid.UUID] = None
    vereda_id: Optional[uuid.UUID] = None
    puesto_votacion_id: Optional[uuid.UUID] = None
    mesa_id: Optional[uuid.UUID] = None
    dependencia: Optional[str] = None
    cargo: Optional[str] = None
    leader_id: Optional[uuid.UUID] = None
    estado: ContactStatus = ContactStatus.PENDIENTE
    observaciones: Optional[str] = None
    acepta_comunicaciones: str = "no"


class ContactCreate(ContactBase):
    tag_ids: Optional[List[uuid.UUID]] = []


class ContactUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    documento: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[str] = None
    direccion: Optional[str] = None
    estado: Optional[ContactStatus] = None
    observaciones: Optional[str] = None
    leader_id: Optional[uuid.UUID] = None
    acepta_comunicaciones: Optional[str] = None


class ContactOut(ContactBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    fecha_creacion: datetime.datetime
    ultimo_contacto: Optional[datetime.datetime] = None


class ContactPage(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[ContactOut]
