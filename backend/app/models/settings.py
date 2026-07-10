import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base


class Settings(Base):
    """Configuración global de la campaña (fila única, clave fija 'default')."""
    __tablename__ = "settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clave = Column(String(50), unique=True, default="default")
    nombre_campana = Column(String(150), default="Mi Campaña")
    logo_url = Column(String(500), nullable=True)
    color_primario = Column(String(20), default="#3763f4")
    color_acento = Column(String(20), default="#f4a13a")
