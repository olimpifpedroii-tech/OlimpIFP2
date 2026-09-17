"""CRUD de álbuns da galeria."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.database import get_db
from app.models import GaleriaAlbum
from app.schemas import GaleriaCreate, GaleriaResponse, GaleriaUpdate


router = APIRouter(prefix="/api/galeria", tags=["Galeria"])


@router.get("", response_model=list[GaleriaResponse])
def listar_galeria(db: Session = Depends(get_db)):
    return db.query(GaleriaAlbum).order_by(GaleriaAlbum.created_at.desc()).all()


@router.get("/{album_id}", response_model=GaleriaResponse)
def obter_album(album_id: int, db: Session = Depends(get_db)):
    album = db.get(GaleriaAlbum, album_id)
    if album is None:
        raise HTTPException(404, "Álbum não encontrado")
    return album


@router.post("", response_model=GaleriaResponse, status_code=status.HTTP_201_CREATED)
def criar_album(
    payload: GaleriaCreate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin),
):
    album = GaleriaAlbum(**payload.model_dump())
    db.add(album)
    db.commit()
    db.refresh(album)
    return album


@router.put("/{album_id}", response_model=GaleriaResponse)
def editar_album(
    album_id: int,
    payload: GaleriaUpdate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin),
):
    album = db.get(GaleriaAlbum, album_id)
    if album is None:
        raise HTTPException(404, "Álbum não encontrado")
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(album, campo, valor)
    db.commit()
    db.refresh(album)
    return album


@router.delete("/{album_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_album(
    album_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin),
):
    album = db.get(GaleriaAlbum, album_id)
    if album is None:
        raise HTTPException(404, "Álbum não encontrado")
    db.delete(album)
    db.commit()
    return None