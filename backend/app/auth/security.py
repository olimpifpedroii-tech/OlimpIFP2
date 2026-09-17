"""Hash de senha e geração/validação de tokens JWT."""

from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt

from app.config import settings


# ─────────────────────────────────────────────────────────
# SENHA (bcrypt direto, sem passlib)
# ─────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Gera hash bcrypt a partir de uma senha em texto puro."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compara senha em texto puro com hash armazenado."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8"),
        )
    except (ValueError, TypeError):
        return False


# ─────────────────────────────────────────────────────────
# TOKEN JWT
# ─────────────────────────────────────────────────────────

def create_access_token(subject: str) -> str:
    """Cria um JWT assinado com 'subject' (ex: email do admin)."""
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {
        "sub": subject,
        "exp": expire,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> str | None:
    """Valida o token e retorna o 'subject'. Retorna None se inválido/expirado."""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload.get("sub")
    except JWTError:
        return None