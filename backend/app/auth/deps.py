"""Dependências de autenticação para rotas protegidas."""

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.security import decode_access_token
from app.database import get_db
from app.models import Admin


def get_current_admin(
    authorization: str | None = Header(None),
    db: Session = Depends(get_db),
) -> Admin:
    """
    Lê o header 'Authorization: Bearer <token>' manualmente.
    Não usa HTTPBearer pra não exibir o cadeado no Swagger.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação ausente",
        )

    # Aceita "Bearer xxx" ou só "xxx"
    token = authorization.removeprefix("Bearer ").strip()

    email = decode_access_token(token)
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )

    admin = db.query(Admin).filter(Admin.email == email).first()
    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin não encontrado",
        )

    return admin