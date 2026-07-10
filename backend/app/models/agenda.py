import enum
import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class EventoTipo(str, enum.Enum):
    REUNION = "reunion"
    EVENTO = "evento"
    RECORDATORIO = "recordatorio"


class Evento(Base):
    __tablename__ = "eventos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    titulo = Column(String(200), nullable=False)
    descripcion = Column(Text, nullable=True)
    tipo = Column(Enum(EventoTipo), default=EventoTipo.REUNION)

    fecha_inicio = Column(DateTime(timezone=True), nullable=False)
    fecha_fin = Column(DateTime(timezone=True), nullable=True)
    lugar = Column(String(250), nullable=True)

    responsable_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    responsable = relationship("User")
