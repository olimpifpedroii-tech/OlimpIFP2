import bcrypt

from app.config import settings
from app.database import SessionLocal
from app.models import Admin


def hash_password(password: str) -> str:
    """Gera hash bcrypt a partir de uma senha em texto puro."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


db = SessionLocal()
try:
    existing = db.query(Admin).filter(Admin.email == settings.ADMIN_EMAIL).first()
    if existing:
        print(f"⚠️  Admin {settings.ADMIN_EMAIL} já existe.")
    else:
        admin = Admin(
            email=settings.ADMIN_EMAIL,
            password_hash=hash_password(settings.ADMIN_PASSWORD),
        )
        db.add(admin)
        db.commit()
        print(f"✅ Admin criado: {settings.ADMIN_EMAIL}")
finally:
    db.close()