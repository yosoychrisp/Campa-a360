from fastapi import APIRouter, Depends
from app.core.deps import get_current_user
from app.models.user import User
from app.services.gdrive import is_configured

router = APIRouter()


@router.get("/estado")
def estado_backup(_: User = Depends(get_current_user)):
    return {"conectado": is_configured()}
