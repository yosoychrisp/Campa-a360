import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.session import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    accion = Column(String(100), nullable=False)  # ej: "CREATE_CONTACT", "LOGIN", "DELETE_USER"
    entidad = Column(String(100), nullable=True)  # ej: "Contact"
    entidad_id = Column(String(100), nullable=True)
    detalle = Column(JSON, nullable=True)
    ip_origen = Column(String(45), nullable=True)
    fecha = Column(DateTime(timezone=True), server_default=func.now())
