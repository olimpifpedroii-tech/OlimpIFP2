"""Endpoints de upload de imagens e vídeos para o Supabase Storage."""

import uuid
import mimetypes

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from supabase import create_client, Client

from app.auth.deps import get_current_admin
from app.config import settings
from app.models import Admin


router = APIRouter(prefix="/api/upload", tags=["Upload"])

# Cliente Supabase (singleton)
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

BUCKET = "olimifp2"

# ─────────────────────────────────────────────────────────
# IMAGENS
# ─────────────────────────────────────────────────────────
ALLOWED_IMAGE_TYPES = {
    "image/jpeg", "image/jpg", "image/png",
    "image/webp", "image/gif", "image/svg+xml",
}
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("")
async def upload_image(
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
):
    """Recebe uma imagem e envia para o Supabase Storage. Retorna a URL pública."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo não permitido: {file.content_type}. Use JPEG, PNG, WebP, GIF ou SVG.",
        )

    content = await file.read()
    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Arquivo muito grande. Máximo: {MAX_IMAGE_SIZE // (1024*1024)} MB",
        )

    ext = file.filename.split(".")[-1].lower() if file.filename else "jpg"
    nome_unico = f"img-{uuid.uuid4().hex}.{ext}"

    try:
        supabase.storage.from_(BUCKET).upload(
            path=nome_unico,
            file=content,
            file_options={"content-type": file.content_type},
        )
    except Exception as e:
        raise HTTPException(500, f"Erro ao enviar imagem: {str(e)}")

    public_url = supabase.storage.from_(BUCKET).get_public_url(nome_unico)
    return {"url": public_url, "filename": nome_unico, "type": "image"}


# ─────────────────────────────────────────────────────────
# VÍDEOS
# ─────────────────────────────────────────────────────────
ALLOWED_VIDEO_TYPES = {
    "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo",
}
MAX_VIDEO_SIZE = 50 * 1024 * 1024  # 50 MB (limite do Supabase plano free)


@router.post("/video")
async def upload_video(
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
):
    """
    Recebe um vídeo e envia para o Supabase Storage.
    Retorna a URL pública.

    ⚠️ Limite: 50 MB por vídeo (devido ao Supabase Storage).
    Para vídeos maiores, use o YouTube.
    """
    if file.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo não permitido: {file.content_type}. Use MP4, WebM, MOV ou AVI.",
        )

    content = await file.read()
    if len(content) > MAX_VIDEO_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Vídeo muito grande. Máximo: {MAX_VIDEO_SIZE // (1024*1024)} MB. Para vídeos maiores, use YouTube.",
        )

    ext = file.filename.split(".")[-1].lower() if file.filename else "mp4"
    nome_unico = f"vid-{uuid.uuid4().hex}.{ext}"

    try:
        supabase.storage.from_(BUCKET).upload(
            path=nome_unico,
            file=content,
            file_options={"content-type": file.content_type},
        )
    except Exception as e:
        raise HTTPException(500, f"Erro ao enviar vídeo: {str(e)}")

    public_url = supabase.storage.from_(BUCKET).get_public_url(nome_unico)
    return {"url": public_url, "filename": nome_unico, "type": "video"}