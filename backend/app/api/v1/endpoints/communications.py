import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user, require_roles
from app.models.user import User, RoleEnum
from app.models.contact import Contact
from app.models.communication import Mensaje, PlantillaMensaje, MensajeEstado, MensajeTipo
from app.schemas.communication import (
    PlantillaIn, PlantillaOut, MensajeCreate, MensajeMasivoCreate, MensajeOut,
)
from app.services.whatsapp import whatsapp_service

router = APIRouter()


# ---------- Plantillas ----------

@router.get("/plantillas", response_model=list[PlantillaOut])
def list_plantillas(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return db.query(PlantillaMensaje).order_by(PlantillaMensaje.creado_en.desc()).all()


@router.post("/plantillas", response_model=PlantillaOut, status_code=201)
def create_plantilla(
    payload: PlantillaIn,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(RoleEnum.ADMIN, RoleEnum.COORDINADOR)),
):
    plantilla = PlantillaMensaje(**payload.model_dump())
    db.add(plantilla)
    db.commit()
    db.refresh(plantilla)
    return plantilla


@router.delete("/plantillas/{plantilla_id}", status_code=204)
def delete_plantilla(
    plantilla_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(RoleEnum.ADMIN, RoleEnum.COORDINADOR)),
):
    plantilla = db.query(PlantillaMensaje).filter(PlantillaMensaje.id == plantilla_id).first()
    if not plantilla:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    db.delete(plantilla)
    db.commit()


# ---------- Mensajes ----------

def _enviar_o_programar(db: Session, contact: Contact, payload: MensajeCreate, usuario_id) -> Mensaje:
    if not contact.telefono:
        raise HTTPException(status_code=400, detail=f"El contacto {contact.nombre} no tiene teléfono registrado")
    if contact.acepta_comunicaciones != "si":
        raise HTTPException(
            status_code=400,
            detail=f"El contacto {contact.nombre} no ha dado consentimiento para recibir mensajes",
        )

    mensaje = Mensaje(
        contact_id=contact.id,
        enviado_por_id=usuario_id,
        plantilla_id=payload.plantilla_id,
        tipo=payload.tipo,
        contenido=payload.contenido,
        media_url=payload.media_url,
        programado_para=payload.programado_para,
        estado=MensajeEstado.PROGRAMADO if payload.programado_para else MensajeEstado.PROGRAMADO,
    )
    db.add(mensaje)
    db.flush()

    # Si no es un envío programado a futuro, se envía de inmediato vía la API de WhatsApp
    if not payload.programado_para:
        try:
            if payload.tipo == MensajeTipo.TEXTO:
                result = whatsapp_service.send_text(contact.telefono, payload.contenido or "")
            else:
                result = whatsapp_service.send_media(
                    contact.telefono, payload.media_url or "", payload.tipo.value, payload.contenido
                )
            mensaje.estado = MensajeEstado.ENVIADO
            mensaje.wa_message_id = result.get("messages", [{}])[0].get("id") if isinstance(result, dict) else None
            mensaje.enviado_en = datetime.datetime.utcnow()
        except Exception:
            mensaje.estado = MensajeEstado.FALLIDO

    return mensaje


@router.post("/mensajes", response_model=MensajeOut, status_code=201)
def enviar_mensaje(
    payload: MensajeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contact = db.query(Contact).filter(Contact.id == payload.contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contacto no encontrado")
    mensaje = _enviar_o_programar(db, contact, payload, current_user.id)
    db.commit()
    db.refresh(mensaje)
    return mensaje


@router.post("/mensajes/masivo", response_model=list[MensajeOut], status_code=201)
def enviar_mensaje_masivo(
    payload: MensajeMasivoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.ADMIN, RoleEnum.COORDINADOR)),
):
    contactos = db.query(Contact).filter(Contact.id.in_(payload.contact_ids)).all()
    enviados = []
    for contact in contactos:
        individual = MensajeCreate(
            contact_id=contact.id,
            plantilla_id=payload.plantilla_id,
            tipo=payload.tipo,
            contenido=payload.contenido,
            media_url=payload.media_url,
            programado_para=payload.programado_para,
        )
        try:
            enviados.append(_enviar_o_programar(db, contact, individual, current_user.id))
        except HTTPException:
            continue  # se omiten los contactos sin teléfono o sin consentimiento
    db.commit()
    for m in enviados:
        db.refresh(m)
    return enviados


@router.get("/mensajes", response_model=list[MensajeOut])
def list_mensajes(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
    contact_id: uuid.UUID | None = None,
):
    query = db.query(Mensaje)
    if contact_id:
        query = query.filter(Mensaje.contact_id == contact_id)
    return query.order_by(Mensaje.programado_para.desc().nullslast()).limit(200).all()
