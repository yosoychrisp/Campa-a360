"""
Ejecutar con: python -m app.initial_data
Crea todas las tablas (para desarrollo rápido; en producción usar Alembic)
y un usuario administrador inicial si no existe ninguno.
"""
from app.db.session import Base, engine, SessionLocal
from app import models  # noqa
from app.models.user import User, RoleEnum
from app.core.security import get_password_hash


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.role == RoleEnum.ADMIN).first()
        if not admin:
            admin = User(
                full_name="Administrador",
                email="admin@campana360.local",
                role=RoleEnum.ADMIN,
                hashed_password=get_password_hash("CambiarEsta123!"),
            )
            db.add(admin)
            db.commit()
            print("Usuario administrador creado: admin@campana360.local / CambiarEsta123!")
            print("IMPORTANTE: cambia esta contraseña inmediatamente.")
        else:
            print("Ya existe un usuario administrador.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
