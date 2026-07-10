import enum
import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class ContactStatus(str, enum.Enum):
    ACTIVO = "activo"
    PENDIENTE = "pendiente"
    INACTIVO = "inactivo"
    NO_INTERESADO = "no_interesado"


contact_tags = Table(
    "contact_tags",
    Base.metadata,
    Column("contact_id", UUID(as_uuid=True), ForeignKey("contacts.id"), primary_key=True),
    Column("tag_id", UUID(as_uuid=True), ForeignKey("tags.id"), primary_key=True),
)


class Tag(Base):
    __tablename__ = "tags"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(80), unique=True, nullable=False)
    color = Column(String(20), default="#6366f1")


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    nombre = Column(String(100), nullable=False, index=True)
    apellido = Column(String(100), nullable=False, index=True)
    documento = Column(String(30), unique=True, index=True, nullable=True)
    telefono = Column(String(30), index=True, nullable=True)
    correo = Column(String(150), nullable=True)
    direccion = Column(String(250), nullable=True)

    municipio_id = Column(UUID(as_uuid=True), ForeignKey("municipios.id"), nullable=True)
    barrio_id = Column(UUID(as_uuid=True), ForeignKey("barrios.id"), nullable=True)
    vereda_id = Column(UUID(as_uuid=True), ForeignKey("veredas.id"), nullable=True)
    puesto_votacion_id = Column(UUID(as_uuid=True), ForeignKey("puestos_votacion.id"), nullable=True)
    mesa_id = Column(UUID(as_uuid=True), ForeignKey("mesas.id"), nullable=True)

    dependencia = Column(String(150), nullable=True)
    cargo = Column(String(150), nullable=True)

    leader_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    leader = relationship("User", back_populates="contacts", foreign_keys=[leader_id])

    estado = Column(Enum(ContactStatus), default=ContactStatus.PENDIENTE, nullable=False)
    observaciones = Column(Text, nullable=True)

    acepta_comunicaciones = Column(String(10), default="no")  # 'si' / 'no' -> consentimiento WhatsApp

    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    ultimo_contacto = Column(DateTime(timezone=True), nullable=True)

    tags = relationship("Tag", secondary=contact_tags, backref="contacts")
    seguimientos = relationship("Seguimiento", back_populates="contact", cascade="all, delete-orphan")


class SeguimientoTipo(str, enum.Enum):
    LLAMADA = "llamada"
    MENSAJE = "mensaje"
    VISITA = "visita"
    REUNION = "reunion"
    OBSERVACION = "observacion"
    COMPROMISO = "compromiso"


class Seguimiento(Base):
    """Historial de interacción con cada contacto."""
    __tablename__ = "seguimientos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=False)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    tipo = Column(Enum(SeguimientoTipo), nullable=False)
    descripcion = Column(Text, nullable=False)
    fecha = Column(DateTime(timezone=True), server_default=func.now())

    contact = relationship("Contact", back_populates="seguimientos")
