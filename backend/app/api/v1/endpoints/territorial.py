import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user, require_roles
from app.models.user import User, RoleEnum
from app.models.territorial import Municipio, Corregimiento, Vereda, Barrio, Sector, PuestoVotacion, Mesa
from app.schemas.territorial import (
    MunicipioIn, MunicipioOut, CorregimientoIn, CorregimientoOut, VeredaIn, VeredaOut,
    BarrioIn, BarrioOut, SectorIn, SectorOut, PuestoVotacionIn, PuestoVotacionOut, MesaIn, MesaOut,
)

router = APIRouter()


def _crud_router(model, schema_in, schema_out, prefix_label: str):
    """Genera un mini set de endpoints CRUD reutilizable para cada nivel territorial."""
    sub = APIRouter()

    @sub.get("/", response_model=list[schema_out])
    def listar(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
        return db.query(model).order_by(model.nombre if hasattr(model, "nombre") else model.numero).all()

    @sub.post("/", response_model=schema_out, status_code=201)
    def crear(
        payload: schema_in,
        db: Session = Depends(get_db),
        _: User = Depends(require_roles(RoleEnum.ADMIN, RoleEnum.COORDINADOR)),
    ):
        obj = model(**payload.model_dump())
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @sub.delete("/{item_id}", status_code=204)
    def eliminar(
        item_id: uuid.UUID,
        db: Session = Depends(get_db),
        _: User = Depends(require_roles(RoleEnum.ADMIN, RoleEnum.COORDINADOR)),
    ):
        obj = db.query(model).filter(model.id == item_id).first()
        if not obj:
            raise HTTPException(status_code=404, detail=f"{prefix_label} no encontrado")
        db.delete(obj)
        db.commit()

    return sub


router.include_router(_crud_router(Municipio, MunicipioIn, MunicipioOut, "Municipio"), prefix="/municipios", tags=["Territorial - Municipios"])
router.include_router(_crud_router(Corregimiento, CorregimientoIn, CorregimientoOut, "Corregimiento"), prefix="/corregimientos", tags=["Territorial - Corregimientos"])
router.include_router(_crud_router(Vereda, VeredaIn, VeredaOut, "Vereda"), prefix="/veredas", tags=["Territorial - Veredas"])
router.include_router(_crud_router(Barrio, BarrioIn, BarrioOut, "Barrio"), prefix="/barrios", tags=["Territorial - Barrios"])
router.include_router(_crud_router(Sector, SectorIn, SectorOut, "Sector"), prefix="/sectores", tags=["Territorial - Sectores"])
router.include_router(_crud_router(PuestoVotacion, PuestoVotacionIn, PuestoVotacionOut, "Puesto de votación"), prefix="/puestos-votacion", tags=["Territorial - Puestos de votación"])
router.include_router(_crud_router(Mesa, MesaIn, MesaOut, "Mesa"), prefix="/mesas", tags=["Territorial - Mesas"])
