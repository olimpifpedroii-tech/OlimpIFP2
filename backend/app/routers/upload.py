"""Endpoint de upload de imagens para o Supabase Storage."""

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

# Tipos permitidos
ALLOWED_TYPES = {
    "image/jpeg", "image/jpg", "image/png",
    "image/webp", "image/gif", "image/svg+xml",
}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("")
async def upload_image(
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
):
    """
    Recebe uma imagem e envia para o Supabase Storage.
    Retorna a URL pública.
    """
    # 1. Valida tipo
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo não permitido: {file.content_type}. Use JPEG, PNG, WebP, GIF ou SVG.",
        )

    # 2. Lê e valida tamanho
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Arquivo muito grande. Máximo: {MAX_SIZE // (1024*1024)} MB",
        )

    # 3. Gera nome único
    ext = file.filename.split(".")[-1].lower() if file.filename else "jpg"
    nome_unico = f"{uuid.uuid4().hex}.{ext}"

    # 4. Faz upload
    try:
        supabase.storage.from_(BUCKET).upload(
            path=nome_unico,
            file=content,
            file_options={"content-type": file.content_type},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao enviar imagem: {str(e)}",
        )

    # 5. Pega URL pública
    public_url = supabase.storage.from_(BUCKET).get_public_url(nome_unico)

    return {"url": public_url, "filename": nome_unico}
