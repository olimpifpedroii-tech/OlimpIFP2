"""CRUD de vídeos."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.database import get_db
from app.models import Video
from app.schemas import VideoCreate, VideoResponse, VideoUpdate


router = APIRouter(prefix="/api/videos", tags=["Vídeos"])


@router.get("", response_model=list[VideoResponse])
def listar_videos(db: Session = Depends(get_db)):
    """Lista todos os vídeos, mais recentes primeiro."""
    return db.query(Video).order_by(Video.created_at.desc()).all()


@router.get("/{video_id}", response_model=VideoResponse)
def obter_video(video_id: int, db: Session = Depends(get_db)):
    """Retorna um vídeo específico."""
    video = db.get(Video, video_id)
    if video is None:
        raise HTTPException(404, "Vídeo não encontrado")
    return video


@router.post("", response_model=VideoResponse, status_code=status.HTTP_201_CREATED)
def criar_video(
    payload: VideoCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """Cria um novo vídeo."""
    video = Video(**payload.model_dump())
    db.add(video)
    db.commit()
    db.refresh(video)
    return video


@router.put("/{video_id}", response_model=VideoResponse)
def editar_video(
    video_id: int,
    payload: VideoUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """Edita um vídeo."""
    video = db.get(Video, video_id)
    if video is None:
        raise HTTPException(404, "Vídeo não encontrado")
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(video, campo, valor)
    db.commit()
    db.refresh(video)
    return video


@router.delete("/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_video(
    video_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """Apaga um vídeo."""
    video = db.get(Video, video_id)
    if video is None:
        raise HTTPException(404, "Vídeo não encontrado")
    db.delete(video)
    db.commit()
    return None