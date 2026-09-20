"""CRUD de notícias."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.database import get_db
from app.models import Noticia
from app.schemas import NoticiaCreate, NoticiaResponse, NoticiaUpdate


router = APIRouter(prefix="/api/noticias", tags=["Notícias"])


# ─── LISTAR (público) ─────────────────────────────────
@router.get("", response_model=list[NoticiaResponse])
def listar_noticias(db: Session = Depends(get_db)):
    """Retorna TODAS as notícias, mais recentes primeiro."""
    return db.query(Noticia).order_by(Noticia.created_at.desc()).all()


# ─── LISTAR PAGINADO (público) ────────────────────────
@router.get("/paginado")
def listar_noticias_paginado(
    skip: int = Query(0, ge=0, description="Quantos itens pular"),
    limit: int = Query(9, ge=1, le=100, description="Quantos itens retornar"),
    db: Session = Depends(get_db),
):
    """
    Retorna uma página de notícias + metadados.
    Formato: {"items": [...], "total": 42, "skip": 0, "limit": 9}
    """
    query = db.query(Noticia).order_by(Noticia.created_at.desc())
    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return {
        "items": items,
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + len(items) < total,
    }


# ─── BUSCAR UMA (público) ─────────────────────────────
@router.get("/{noticia_id}", response_model=NoticiaResponse)
def obter_noticia(noticia_id: int, db: Session = Depends(get_db)):
    noticia = db.get(Noticia, noticia_id)
    if noticia is None:
        raise HTTPException(404, "Notícia não encontrada")
    return noticia


# ─── CRIAR (admin) ────────────────────────────────────
@router.post("", response_model=NoticiaResponse, status_code=status.HTTP_201_CREATED)
def criar_noticia(
    payload: NoticiaCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
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
    admin=Depends(get_current_admin),
):
    noticia = db.get(Noticia, noticia_id)
    if noticia is None:
        raise HTTPException(404, "Notícia não encontrada")
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(noticia, campo, valor)
    db.commit()
    db.refresh(noticia)
    return noticia


# ─── DELETAR (admin) ──────────────────────────────────
@router.delete("/{noticia_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_noticia(
    noticia_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    noticia = db.get(Noticia, noticia_id)
    if noticia is None:
        raise HTTPException(404, "Notícia não encontrada")
    db.delete(noticia)
    db.commit()
    return None