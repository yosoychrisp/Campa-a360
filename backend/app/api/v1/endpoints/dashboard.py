import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.contact import Contact, ContactStatus
from app.models.agenda import Evento
from app.models.communication import Mensaje, MensajeEstado

router = APIRouter()


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_contactos = db.query(func.count(Contact.id)).scalar()
    activos = db.query(func.count(Contact.id)).filter(Contact.estado == ContactStatus.ACTIVO).scalar()
    pendientes = db.query(func.count(Contact.id)).filter(Contact.estado == ContactStatus.PENDIENTE).scalar()

    hoy = datetime.datetime.utcnow()
    en_7_dias = hoy + datetime.timedelta(days=7)
    reuniones_proximas = db.query(func.count(Evento.id)).filter(
        Evento.fecha_inicio >= hoy, Evento.fecha_inicio <= en_7_dias
    ).scalar()

    inicio_dia = hoy.replace(hour=0, minute=0, second=0, microsecond=0)
    fin_dia = inicio_dia + datetime.timedelta(days=1)
    actividades_hoy = db.query(func.count(Evento.id)).filter(
        Evento.fecha_inicio >= inicio_dia, Evento.fecha_inicio < fin_dia
    ).scalar()

    mensajes_enviados = db.query(func.count(Mensaje.id)).filter(
        Mensaje.estado.in_([MensajeEstado.ENVIADO, MensajeEstado.ENTREGADO, MensajeEstado.LEIDO])
    ).scalar()

    # Distribución de contactos por estado (para gráfico)
    por_estado = (
        db.query(Contact.estado, func.count(Contact.id))
        .group_by(Contact.estado)
        .all()
    )

    return {
        "total_contactos": total_contactos,
        "personas_activas": activos,
        "personas_pendientes": pendientes,
        "reuniones_proximas": reuniones_proximas,
        "actividades_hoy": actividades_hoy,
        "mensajes_enviados": mensajes_enviados,
        "distribucion_por_estado": {estado.value: count for estado, count in por_estado},
    }
