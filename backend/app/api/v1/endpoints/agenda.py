import uuid
import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.agenda import Evento
from app.schemas.agenda import EventoOut, EventoCreate, EventoUpdate

router = APIRouter()


@router.get("/", response_model=list[EventoOut])
def list_eventos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    desde: Optional[datetime.datetime] = None,
    hasta: Optional[datetime.datetime] = None,
):
    query = db.query(Evento)
    if desde:
        query = query.filter(Evento.fecha_inicio >= desde)
    if hasta:
        query = query.filter(Evento.fecha_inicio <= hasta)
    return query.order_by(Evento.fecha_inicio.asc()).all()


@router.post("/", response_model=EventoOut, status_code=201)
def create_evento(
    payload: EventoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = payload.model_dump()
    data["responsable_id"] = data.get("responsable_id") or current_user.id
    evento = Evento(**data)
    db.add(evento)
    db.commit()
    db.refresh(evento)
    return evento


@router.put("/{evento_id}", response_model=EventoOut)
def update_evento(
    evento_id: uuid.UUID,
    payload: EventoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    evento = db.query(Evento).filter(Evento.id == evento_id).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(evento, field, value)
    db.commit()
    db.refresh(evento)
    return evento


@router.delete("/{evento_id}", status_code=204)
def delete_evento(
    evento_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    evento = db.query(Evento).filter(Evento.id == evento_id).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    db.delete(evento)
    db.commit()
