"""CRUD de eventos."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.database import get_db
from app.models import Evento
from app.schemas import EventoCreate, EventoResponse, EventoUpdate


router = APIRouter(prefix="/api/eventos", tags=["Eventos"])


@router.get("", response_model=list[EventoResponse])
def listar_eventos(db: Session = Depends(get_db)):
    """Lista todos os eventos, mais recentes primeiro."""
    return db.query(Evento).order_by(Evento.created_at.desc()).all()


@router.get("/{evento_id}", response_model=EventoResponse)
def obter_evento(evento_id: int, db: Session = Depends(get_db)):
    evento = db.get(Evento, evento_id)
    if evento is None:
        raise HTTPException(404, "Evento não encontrado")
    return evento


@router.post("", response_model=EventoResponse, status_code=status.HTTP_201_CREATED)
def criar_evento(
    payload: EventoCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    evento = Evento(**payload.model_dump())
    db.add(evento)
    db.commit()
    db.refresh(evento)
    return evento


@router.put("/{evento_id}", response_model=EventoResponse)
def editar_evento(
    evento_id: int,
    payload: EventoUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    evento = db.get(Evento, evento_id)
    if evento is None:
        raise HTTPException(404, "Evento não encontrado")
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(evento, campo, valor)
    db.commit()
    db.refresh(evento)
    return evento


@router.delete("/{evento_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_evento(
    evento_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    evento = db.get(Evento, evento_id)
    if evento is None:
        raise HTTPException(404, "Evento não encontrado")
    db.delete(evento)
    db.commit()
    return None