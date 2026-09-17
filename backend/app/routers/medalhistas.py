"""CRUD de medalhistas."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.database import get_db
from app.models import Medalista
from app.schemas import MedalistaCreate, MedalistaResponse, MedalistaUpdate


router = APIRouter(prefix="/api/medalhistas", tags=["Medalhistas"])


@router.get("", response_model=list[MedalistaResponse])
def listar_medalhistas(db: Session = Depends(get_db)):
    return db.query(Medalista).order_by(Medalista.created_at.desc()).all()


@router.get("/{medalista_id}", response_model=MedalistaResponse)
def obter_medalista(medalista_id: int, db: Session = Depends(get_db)):
    medalista = db.get(Medalista, medalista_id)
    if medalista is None:
        raise HTTPException(404, "Medalista não encontrado")
    return medalista


@router.post("", response_model=MedalistaResponse, status_code=status.HTTP_201_CREATED)
def criar_medalista(
    payload: MedalistaCreate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin),
):
    medalista = Medalista(**payload.model_dump())
    db.add(medalista)
    db.commit()
    db.refresh(medalista)
    return medalista


@router.put("/{medalista_id}", response_model=MedalistaResponse)
def editar_medalista(
    medalista_id: int,
    payload: MedalistaUpdate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin),
):
    medalista = db.get(Medalista, medalista_id)
    if medalista is None:
        raise HTTPException(404, "Medalista não encontrado")
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(medalista, campo, valor)
    db.commit()
    db.refresh(medalista)
    return medalista


@router.delete("/{medalista_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_medalista(
    medalista_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin),
):
    medalista = db.get(Medalista, medalista_id)
    if medalista is None:
        raise HTTPException(404, "Medalista não encontrado")
    db.delete(medalista)
    db.commit()
    return None