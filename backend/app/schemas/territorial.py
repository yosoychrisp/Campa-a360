import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict


class MunicipioIn(BaseModel):
    nombre: str


class MunicipioOut(MunicipioIn):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID


class CorregimientoIn(BaseModel):
    nombre: str
    municipio_id: uuid.UUID


class CorregimientoOut(CorregimientoIn):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID


class VeredaIn(BaseModel):
    nombre: str
    corregimiento_id: uuid.UUID


class VeredaOut(VeredaIn):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID


class BarrioIn(BaseModel):
    nombre: str
    municipio_id: uuid.UUID


class BarrioOut(BarrioIn):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID


class SectorIn(BaseModel):
    nombre: str
    barrio_id: uuid.UUID


class SectorOut(SectorIn):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID


class PuestoVotacionIn(BaseModel):
    nombre: str
    direccion: Optional[str] = None
    municipio_id: uuid.UUID


class PuestoVotacionOut(PuestoVotacionIn):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID


class MesaIn(BaseModel):
    numero: str
    puesto_votacion_id: uuid.UUID


class MesaOut(MesaIn):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
