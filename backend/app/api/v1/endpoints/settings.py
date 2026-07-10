from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import require_roles
from app.models.user import User, RoleEnum
from app.models.settings import Settings
from app.schemas.audit import SettingsIn, SettingsOut

router = APIRouter()


def _get_or_create(db: Session) -> Settings:
    settings_row = db.query(Settings).filter(Settings.clave == "default").first()
    if not settings_row:
        settings_row = Settings(clave="default")
        db.add(settings_row)
        db.commit()
        db.refresh(settings_row)
    return settings_row


@router.get("/", response_model=SettingsOut)
def get_settings(db: Session = Depends(get_db)):
    return _get_or_create(db)


@router.put("/", response_model=SettingsOut)
def update_settings(
    payload: SettingsIn,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(RoleEnum.ADMIN)),
):
    settings_row = _get_or_create(db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(settings_row, field, value)
    db.commit()
    db.refresh(settings_row)
    return settings_row
