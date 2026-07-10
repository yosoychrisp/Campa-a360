from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import require_roles
from app.models.user import User, RoleEnum
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogOut

router = APIRouter()


@router.get("/", response_model=list[AuditLogOut])
def list_audit_logs(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(RoleEnum.ADMIN, RoleEnum.COORDINADOR)),
    limit: int = 200,
):
    return db.query(AuditLog).order_by(AuditLog.fecha.desc()).limit(limit).all()
