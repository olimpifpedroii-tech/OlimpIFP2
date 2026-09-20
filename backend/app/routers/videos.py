"""CRUD de vídeos."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.database import get_db
from app.models import Video
from app.schemas import VideoCreate, VideoResponse, VideoUpdate


router = APIRouter(prefix="/api/videos", tags=["Vídeos"])


@router.get("", response_model=list[VideoResponse])
def listar_videos(db: Session = Depends(get_db)):
    return db.query(Video).order_by(Video.created_at.desc()).all()


@router.get("/paginado")
def listar_videos_paginado(
    skip: int = Query(0, ge=0),
    limit: int = Query(6, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Video).order_by(Video.created_at.desc())
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return {
        "items": items,
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + len(items) < total,
    }


@router.get("/{video_id}", response_model=VideoResponse)
def obter_video(video_id: int, db: Session = Depends(get_db)):
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
    video = db.get(Video, video_id)
    if video is None:
        raise HTTPException(404, "Vídeo não encontrado")
    db.delete(video)
    db.commit()
    return None