"""Respaldo automático de la base de datos de contactos hacia Google Drive."""
import io
import logging

from app.db.session import SessionLocal
from app.models.contact import Contact
from app.models.user import User
from app.services.gdrive import upload_bytes, is_configured, BACKUP_FILENAME

logger = logging.getLogger("backup")


def sync_contacts_to_drive(_unused_db=None) -> None:
    """Genera un Excel con todos los contactos y lo sube (sobrescribe) en Drive.
    Abre su propia sesión de base de datos porque se ejecuta en segundo plano,
    después de que la sesión original de la petición ya se cerró.
    No lanza errores hacia arriba: si falla, solo queda registrado en el log,
    para no afectar la respuesta al usuario que creó/editó el contacto.
    """
    if not is_configured():
        return

    db = SessionLocal()
    try:
        from openpyxl import Workbook

        contacts = db.query(Contact).order_by(Contact.fecha_creacion.desc()).all()
        lideres = {u.id: u.full_name for u in db.query(User).all()}

        wb = Workbook()
        ws = wb.active
        ws.title = "Contactos"
        ws.append([
            "Nombre", "Apellido", "Documento", "Teléfono", "Correo", "Dirección",
            "Estado", "Encargado", "Último contacto", "Fecha de registro",
        ])
        for c in contacts:
            ws.append([
                c.nombre,
                c.apellido,
                c.documento or "",
                c.telefono or "",
                c.correo or "",
                c.direccion or "",
                c.estado.value if c.estado else "",
                lideres.get(c.leader_id, "") if c.leader_id else "",
                str(c.ultimo_contacto or ""),
                str(c.fecha_creacion or ""),
            ])

        buf = io.BytesIO()
        wb.save(buf)
        upload_bytes(
            BACKUP_FILENAME,
            buf.getvalue(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        logger.info("Respaldo de contactos sincronizado con Google Drive (%s registros)", len(contacts))
    except Exception:
        logger.exception("No se pudo generar/subir el respaldo de contactos")
    finally:
        db.close()
