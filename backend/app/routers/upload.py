
"""Upload de imagens e vídeos para o ImageKit."""

import uuid
from pathlib import Path

import requests
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.auth.deps import get_current_admin
from app.config import settings
from app.models import Admin


router = APIRouter(prefix="/api/upload", tags=["Upload"])

IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload"
IMAGEKIT_FOLDER = "/olimpifp2/medalhistas"

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
}

ALLOWED_VIDEO_TYPES = {
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
}

MAX_IMAGE_SIZE = 10 * 1024 * 1024
MAX_VIDEO_SIZE = 50 * 1024 * 1024


def enviar_para_imagekit(content, filename, content_type, folder):
    """Envia um arquivo ao ImageKit e retorna sua URL pública."""

    try:
        response = requests.post(
            IMAGEKIT_UPLOAD_URL,
            auth=(settings.IMAGEKIT_PRIVATE_KEY, ""),
            files={
                "file": (filename, content, content_type),
            },
            data={
                "fileName": filename,
                "folder": folder,
                "useUniqueFileName": "false",
            },
            timeout=90,
        )

        response.raise_for_status()
        result = response.json()

        public_url = result.get("url")

        if not public_url:
            raise ValueError("O ImageKit não retornou uma URL pública.")

        return public_url

    except requests.RequestException as error:
        print(
            "Erro de comunicação com o ImageKit:",
            type(error).__name__,
            flush=True,
        )
        raise HTTPException(
            status_code=502,
            detail="Não foi possível enviar o arquivo ao ImageKit.",
        ) from error

    except (ValueError, KeyError) as error:
        print("Resposta inválida do ImageKit:", str(error), flush=True)
        raise HTTPException(
            status_code=502,
            detail="O ImageKit retornou uma resposta inválida.",
        ) from error


@router.post("")
async def upload_image(
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
):
    """Recebe uma imagem e retorna sua URL pública."""

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipo não permitido. Use JPEG, PNG, WebP, GIF ou SVG.",
        )

    content = await file.read(MAX_IMAGE_SIZE + 1)

    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Imagem muito grande. Máximo: 10 MB.",
        )

    ext = Path(file.filename or "imagem.jpg").suffix.lower()

    if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}:
        raise HTTPException(
            status_code=400,
            detail="Extensão de imagem não permitida.",
        )

    nome_unico = f"img-{uuid.uuid4().hex}{ext}"

    public_url = enviar_para_imagekit(
        content,
        nome_unico,
        file.content_type,
        IMAGEKIT_FOLDER,
    )

    return {
        "url": public_url,
        "filename": nome_unico,
        "type": "image",
    }


@router.post("/video")
async def upload_video(
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
):
    """Recebe um vídeo e retorna sua URL pública."""

    if file.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipo não permitido. Use MP4, WebM, MOV ou AVI.",
        )

    content = await file.read(MAX_VIDEO_SIZE + 1)

    if len(content) > MAX_VIDEO_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vídeo muito grande. Máximo: 50 MB.",
        )

    ext = Path(file.filename or "video.mp4").suffix.lower()

    if ext not in {".mp4", ".webm", ".mov", ".avi"}:
        raise HTTPException(
            status_code=400,
            detail="Extensão de vídeo não permitida.",
        )

    nome_unico = f"vid-{uuid.uuid4().hex}{ext}"

    public_url = enviar_para_imagekit(
        content,
        nome_unico,
        file.content_type,
        "/olimpifp2/videos",
    )

    return {
        "url": public_url,
        "filename": nome_unico,
        "type": "video",
    }
