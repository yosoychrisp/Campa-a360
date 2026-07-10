import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import require_roles, get_current_user
from app.models.user import User, RoleEnum
from app.schemas.user import UserOut, UserCreate, UserUpdate
from app.core.security import get_password_hash

router = APIRouter()


@router.get("/", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.ADMIN, RoleEnum.COORDINADOR)),
):
    return db.query(User).order_by(User.full_name).all()


@router.post("/", response_model=UserOut, status_code=201)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.ADMIN)),
):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    user = User(
        full_name=payload.full_name,
        email=payload.email,
        role=payload.role,
        phone=payload.phone,
        is_active=payload.is_active,
        hashed_password=get_password_hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/me", response_model=UserOut)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: uuid.UUID,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.ADMIN)),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    data = payload.model_dump(exclude_unset=True)
    if "password" in data and data["password"]:
        user.hashed_password = get_password_hash(data.pop("password"))
    for field, value in data.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.ADMIN)),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user.is_active = False  # borrado lógico
    db.commit()
