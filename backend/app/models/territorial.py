import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base


class Municipio(Base):
    __tablename__ = "municipios"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(150), nullable=False, unique=True)

    corregimientos = relationship("Corregimiento", back_populates="municipio")
    barrios = relationship("Barrio", back_populates="municipio")
    puestos_votacion = relationship("PuestoVotacion", back_populates="municipio")


class Corregimiento(Base):
    __tablename__ = "corregimientos"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(150), nullable=False)
    municipio_id = Column(UUID(as_uuid=True), ForeignKey("municipios.id"), nullable=False)

    municipio = relationship("Municipio", back_populates="corregimientos")
    veredas = relationship("Vereda", back_populates="corregimiento")


class Vereda(Base):
    __tablename__ = "veredas"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(150), nullable=False)
    corregimiento_id = Column(UUID(as_uuid=True), ForeignKey("corregimientos.id"), nullable=False)

    corregimiento = relationship("Corregimiento", back_populates="veredas")


class Barrio(Base):
    __tablename__ = "barrios"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(150), nullable=False)
    municipio_id = Column(UUID(as_uuid=True), ForeignKey("municipios.id"), nullable=False)

    municipio = relationship("Municipio", back_populates="barrios")
    sectores = relationship("Sector", back_populates="barrio")


class Sector(Base):
    __tablename__ = "sectores"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(150), nullable=False)
    barrio_id = Column(UUID(as_uuid=True), ForeignKey("barrios.id"), nullable=False)

    barrio = relationship("Barrio", back_populates="sectores")


class PuestoVotacion(Base):
    __tablename__ = "puestos_votacion"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(200), nullable=False)
    direccion = Column(String(250), nullable=True)
    municipio_id = Column(UUID(as_uuid=True), ForeignKey("municipios.id"), nullable=False)

    municipio = relationship("Municipio", back_populates="puestos_votacion")
    mesas = relationship("Mesa", back_populates="puesto_votacion")


class Mesa(Base):
    __tablename__ = "mesas"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    numero = Column(String(20), nullable=False)
    puesto_votacion_id = Column(UUID(as_uuid=True), ForeignKey("puestos_votacion.id"), nullable=False)

    puesto_votacion = relationship("PuestoVotacion", back_populates="mesas")
