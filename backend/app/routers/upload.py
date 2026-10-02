"""Endpoints de upload de imagens e vídeos para o Supabase Storage."""

import uuid
import socket
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from supabase import create_client, Client

from app.auth.deps import get_current_admin
from app.config import settings
from app.models import Admin


router = APIRouter(prefix="/api/upload", tags=["Upload"])

# Cliente Supabase
supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_KEY
)

BUCKET = "olimifp2"


# ─────────────────────────────────────────────────────────
# DEBUG DE CONEXÃO COM O SUPABASE
# ─────────────────────────────────────────────────────────

def verificar_conexao_supabase():
    """
    Mostra nos logs do Render se o domínio do Supabase
    está sendo encontrado corretamente.

    NÃO exibe a SUPABASE_SERVICE_KEY.
    """

    try:
        host = urlparse(settings.SUPABASE_URL).hostname

        print("\n=== DEBUG SUPABASE ===", flush=True)
        print("URL:", repr(settings.SUPABASE_URL), flush=True)
        print("HOST:", host, flush=True)

        if not host:
            print("ERRO: não foi possível extrair o host da SUPABASE_URL", flush=True)
            print("======================\n", flush=True)
            return

        try:
            resultado_dns = socket.getaddrinfo(host, 443)

            # Não precisamos imprimir tudo.
            # Basta saber que o domínio foi encontrado.
            print("DNS OK", flush=True)

            if resultado_dns:
                print("ENDEREÇO ENCONTRADO:", resultado_dns[0][4][0], flush=True)

        except Exception as erro_dns:
            print("DNS ERRO:", repr(erro_dns), flush=True)

        print("======================\n", flush=True)

    except Exception as erro:
        print("ERRO NO DEBUG DO SUPABASE:", repr(erro), flush=True)


# ─────────────────────────────────────────────────────────
# IMAGENS
# ─────────────────────────────────────────────────────────

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
}

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("")
async def upload_image(
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
):
    """
    Recebe uma imagem e envia para o Supabase Storage.
    Retorna a URL pública.
    """

    # Verifica o tipo do arquivo
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Tipo não permitido: {file.content_type}. "
                "Use JPEG, PNG, WebP, GIF ou SVG."
            ),
        )

    # Lê o arquivo
    content = await file.read()

    # Verifica o tamanho
    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Arquivo muito grande. "
                f"Máximo: {MAX_IMAGE_SIZE // (1024 * 1024)} MB"
            ),
        )

    # Cria nome único
    ext = file.filename.split(".")[-1].lower() if file.filename else "jpg"
    nome_unico = f"img-{uuid.uuid4().hex}.{ext}"

    # Teste de conexão
    verificar_conexao_supabase()

    # Envia para o Supabase
    try:
        supabase.storage.from_(BUCKET).upload(
            path=nome_unico,
            file=content,
            file_options={
                "content-type": file.content_type,
            },
        )

    except Exception as e:
        print("\n=== ERRO UPLOAD SUPABASE ===", flush=True)
        print("TIPO:", type(e).__name__, flush=True)
        print("ERRO:", repr(e), flush=True)
        print("============================\n", flush=True)

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao enviar imagem: {str(e)}",
        )

    # Pega URL pública
    try:
        public_url = supabase.storage.from_(BUCKET).get_public_url(nome_unico)

    except Exception as e:
        print("ERRO AO GERAR URL PÚBLICA:", repr(e), flush=True)

        raise HTTPException(
            status_code=500,
            detail=f"Imagem enviada, mas houve erro ao gerar URL: {str(e)}",
        )

    return {
        "url": public_url,
        "filename": nome_unico,
        "type": "image",
    }


# ─────────────────────────────────────────────────────────
# VÍDEOS
# ─────────────────────────────────────────────────────────

ALLOWED_VIDEO_TYPES = {
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
}

MAX_VIDEO_SIZE = 50 * 1024 * 1024  # 50 MB


@router.post("/video")
async def upload_video(
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
):
    """
    Recebe um vídeo e envia para o Supabase Storage.
    Retorna a URL pública.
    """

    if file.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Tipo não permitido: {file.content_type}. "
                "Use MP4, WebM, MOV ou AVI."
            ),
        )

    content = await file.read()

    if len(content) > MAX_VIDEO_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Vídeo muito grande. "
                f"Máximo: {MAX_VIDEO_SIZE // (1024 * 1024)} MB. "
                "Para vídeos maiores, use YouTube."
            ),
        )

    ext = file.filename.split(".")[-1].lower() if file.filename else "mp4"
    nome_unico = f"vid-{uuid.uuid4().hex}.{ext}"

    # Teste de conexão
    verificar_conexao_supabase()

    try:
        supabase.storage.from_(BUCKET).upload(
            path=nome_unico,
            file=content,
            file_options={
                "content-type": file.content_type,
            },
        )

    except Exception as e:
        print("\n=== ERRO UPLOAD SUPABASE ===", flush=True)
        print("TIPO:", type(e).__name__, flush=True)
        print("ERRO:", repr(e), flush=True)
        print("============================\n", flush=True)

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao enviar vídeo: {str(e)}",
        )

    try:
        public_url = supabase.storage.from_(BUCKET).get_public_url(nome_unico)

    except Exception as e:
        print("ERRO AO GERAR URL PÚBLICA:", repr(e), flush=True)

        raise HTTPException(
            status_code=500,
            detail=f"Vídeo enviado, mas houve erro ao gerar URL: {str(e)}",
        )

    return {
        "url": public_url,
        "filename": nome_unico,
        "type": "video",
    }