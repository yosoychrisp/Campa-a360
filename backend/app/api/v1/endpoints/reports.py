import io
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.contact import Contact, ContactStatus

router = APIRouter()


@router.get("/contactos/pdf")
def reporte_contactos_pdf(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet

    contacts = db.query(Contact).order_by(Contact.fecha_creacion.desc()).limit(500).all()

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = [Paragraph("Reporte de Contactos — Campaña 360", styles["Title"]), Spacer(1, 12)]

    data = [["Nombre", "Teléfono", "Municipio/Estado", "Último contacto"]]
    for c in contacts:
        data.append([
            f"{c.nombre} {c.apellido}",
            c.telefono or "—",
            c.estado.value,
            str(c.ultimo_contacto or "—"),
        ])

    table = Table(data, repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#3763f4")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
    ]))
    elements.append(table)
    doc.build(elements)
    buf.seek(0)

    return StreamingResponse(
        buf, media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=reporte_contactos.pdf"},
    )


@router.get("/resumen")
def reporte_resumen(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    por_estado = db.query(Contact.estado, func.count(Contact.id)).group_by(Contact.estado).all()
    por_municipio = (
        db.query(Contact.municipio_id, func.count(Contact.id))
        .group_by(Contact.municipio_id)
        .all()
    )
    return {
        "por_estado": {estado.value: count for estado, count in por_estado},
        "por_municipio": {str(m): count for m, count in por_municipio if m is not None},
    }
