"""Endpoints de autenticação do admin."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.auth.security import create_access_token, verify_password
from app.database import get_db
from app.models import Admin
from app.schemas import AdminResponse, LoginRequest, TokenResponse


router = APIRouter(prefix="/api/auth", tags=["Autenticação"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Recebe email + senha, devolve um token JWT válido por 24h.
    """
    admin = db.query(Admin).filter(Admin.email == payload.email).first()

    if admin is None or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha inválidos",
        )

    token = create_access_token(subject=admin.email)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=AdminResponse)
def me(admin: Admin = Depends(get_current_admin)):
    """
    Retorna os dados do admin autenticado (requer token no header).
    """
    return AdminResponse(id=admin.id, email=admin.email)