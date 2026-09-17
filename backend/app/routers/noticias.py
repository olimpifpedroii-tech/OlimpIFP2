"""CRUD de notícias."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.database import get_db
from app.models import Noticia
from app.schemas import NoticiaCreate, NoticiaResponse, NoticiaUpdate


router = APIRouter(prefix="/api/noticias", tags=["Notícias"])


# ─── LISTAR (público) ─────────────────────────────────
@router.get("", response_model=list[NoticiaResponse])
def listar_noticias(db: Session = Depends(get_db)):
    """Retorna todas as notícias, mais recentes primeiro."""
    return db.query(Noticia).order_by(Noticia.created_at.desc()).all()


# ─── BUSCAR UMA (público) ─────────────────────────────
@router.get("/{noticia_id}", response_model=NoticiaResponse)
def obter_noticia(noticia_id: int, db: Session = Depends(get_db)):
    """Retorna uma notícia específica por ID."""
    noticia = db.get(Noticia, noticia_id)
    if noticia is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notícia não encontrada",
        )
    return noticia


# ─── CRIAR (admin) ────────────────────────────────────
@router.post("", response_model=NoticiaResponse, status_code=status.HTTP_201_CREATED)
def criar_noticia(
    payload: NoticiaCreate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin),  # 🔒 protege
):
    """Cria uma nova notícia."""
    noticia = Noticia(**payload.model_dump())
    db.add(noticia)
    db.commit()
    db.refresh(noticia)
    return noticia


# ─── EDITAR (admin) ───────────────────────────────────
@router.put("/{noticia_id}", response_model=NoticiaResponse)
def editar_noticia(
    noticia_id: int,
    payload: NoticiaUpdate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin),  # 🔒 protege
):
    """Atualiza uma notícia (campos enviados; os demais ficam intactos)."""
    noticia = db.get(Noticia, noticia_id)
    if noticia is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notícia não encontrada",
        )

    # Atualiza só os campos que vieram no payload
    dados = payload.model_dump(exclude_unset=True)
    for campo, valor in dados.items():
        setattr(noticia, campo, valor)

    db.commit()
    db.refresh(noticia)
    return noticia


# ─── DELETAR (admin) ──────────────────────────────────
@router.delete("/{noticia_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_noticia(
    noticia_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin),  # 🔒 protege
):
    """Apaga uma notícia."""
    noticia = db.get(Noticia, noticia_id)
    if noticia is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notícia não encontrada",
        )
    db.delete(noticia)
    db.commit()
    return None