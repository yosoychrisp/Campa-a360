import enum
import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class RoleEnum(str, enum.Enum):
    ADMIN = "administrador"
    COORDINADOR = "coordinador"
    LIDER = "lider"
    DIGITADOR = "digitador"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.DIGITADOR)
    is_active = Column(Boolean, default=True)
    phone = Column(String(30), nullable=True)

    # Un líder puede tener contactos a su cargo (self-referential via Contact.leader_id)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    contacts = relationship("Contact", back_populates="leader", foreign_keys="Contact.leader_id")
