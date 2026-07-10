import enum
import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class MensajeEstado(str, enum.Enum):
    PROGRAMADO = "programado"
    ENVIADO = "enviado"
    ENTREGADO = "entregado"
    LEIDO = "leido"
    FALLIDO = "fallido"


class MensajeTipo(str, enum.Enum):
    TEXTO = "texto"
    IMAGEN = "imagen"
    DOCUMENTO = "documento"
    VIDEO = "video"
    AUDIO = "audio"


class PlantillaMensaje(Base):
    __tablename__ = "plantillas_mensaje"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(150), nullable=False)
    contenido = Column(Text, nullable=False)
    whatsapp_template_name = Column(String(150), nullable=True)  # nombre aprobado en Meta
    creado_en = Column(DateTime(timezone=True), server_default=func.now())


class Mensaje(Base):
    """Registro de cada mensaje enviado vía WhatsApp Business API (Meta Cloud API)."""
    __tablename__ = "mensajes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=False)
    enviado_por_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    plantilla_id = Column(UUID(as_uuid=True), ForeignKey("plantillas_mensaje.id"), nullable=True)

    tipo = Column(Enum(MensajeTipo), default=MensajeTipo.TEXTO)
    contenido = Column(Text, nullable=True)
    media_url = Column(String(500), nullable=True)

    estado = Column(Enum(MensajeEstado), default=MensajeEstado.PROGRAMADO)
    wa_message_id = Column(String(150), nullable=True)  # id devuelto por Meta API
    programado_para = Column(DateTime(timezone=True), nullable=True)
    enviado_en = Column(DateTime(timezone=True), nullable=True)

    contact = relationship("Contact")
