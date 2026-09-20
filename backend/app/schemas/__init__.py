from app.schemas.noticia import (
    NoticiaBase,
    NoticiaCreate,
    NoticiaUpdate,
    NoticiaResponse,
)
from app.schemas.medalista import (
    MedalistaBase,
    MedalistaCreate,
    MedalistaUpdate,
    MedalistaResponse,
)
from app.schemas.olimpiada import (
    OlimpiadaBase,
    OlimpiadaCreate,
    OlimpiadaUpdate,
    OlimpiadaResponse,
)
from app.schemas.galeria import (
    GaleriaBase,
    GaleriaCreate,
    GaleriaUpdate,
    GaleriaResponse,
)
from app.schemas.auth import LoginRequest, TokenResponse, AdminResponse
from app.schemas.video import (
    VideoBase,
    VideoCreate,
    VideoUpdate,
    VideoResponse,
)

__all__ = [
    "NoticiaBase", "NoticiaCreate", "NoticiaUpdate", "NoticiaResponse",
    "MedalistaBase", "MedalistaCreate", "MedalistaUpdate", "MedalistaResponse",
    "OlimpiadaBase", "OlimpiadaCreate", "OlimpiadaUpdate", "OlimpiadaResponse",
    "GaleriaBase", "GaleriaCreate", "GaleriaUpdate", "GaleriaResponse",
    "LoginRequest", "TokenResponse", "AdminResponse",
    "VideoBase", "VideoCreate", "VideoUpdate", "VideoResponse",
]