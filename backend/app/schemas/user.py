import uuid
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.user import RoleEnum


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: RoleEnum = RoleEnum.DIGITADOR
    phone: Optional[str] = None
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[RoleEnum] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    full_name: str
    email: str
    role: RoleEnum
    phone: Optional[str] = None
    is_active: bool = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
