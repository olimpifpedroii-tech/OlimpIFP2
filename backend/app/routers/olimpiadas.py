"""CRUD de olimpíadas."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.database import get_db
from app.models import Olimpiada
from app.schemas import OlimpiadaCreate, OlimpiadaResponse, OlimpiadaUpdate


router = APIRouter(prefix="/api/olimpiadas", tags=["Olimpíadas"])


@router.get("", response_model=list[OlimpiadaResponse])
def listar_olimpiadas(db: Session = Depends(get_db)):
    return db.query(Olimpiada).order_by(Olimpiada.name.asc()).all()


@router.get("/paginado")
def listar_olimpiadas_paginado(
    skip: int = Query(0, ge=0),
    limit: int = Query(9, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Olimpiada).order_by(Olimpiada.name.asc())
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return {
        "items": items,
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + len(items) < total,
    }


@router.get("/{olimpiada_id}", response_model=OlimpiadaResponse)
def obter_olimpiada(olimpiada_id: int, db: Session = Depends(get_db)):
    olimpiada = db.get(Olimpiada, olimpiada_id)
    if olimpiada is None:
        raise HTTPException(404, "Olimpíada não encontrada")
    return olimpiada


@router.post("", response_model=OlimpiadaResponse, status_code=status.HTTP_201_CREATED)
def criar_olimpiada(
    payload: OlimpiadaCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    olimpiada = Olimpiada(**payload.model_dump())
    db.add(olimpiada)
    db.commit()
    db.refresh(olimpiada)
    return olimpiada


@router.put("/{olimpiada_id}", response_model=OlimpiadaResponse)
def editar_olimpiada(
    olimpiada_id: int,
    payload: OlimpiadaUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    olimpiada = db.get(Olimpiada, olimpiada_id)
    if olimpiada is None:
        raise HTTPException(404, "Olimpíada não encontrada")
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(olimpiada, campo, valor)
    db.commit()
    db.refresh(olimpiada)
    return olimpiada


@router.delete("/{olimpiada_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_olimpiada(
    olimpiada_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    olimpiada = db.get(Olimpiada, olimpiada_id)
    if olimpiada is None:
        raise HTTPException(404, "Olimpíada não encontrada")
    db.delete(olimpiada)
    db.commit()
    return None