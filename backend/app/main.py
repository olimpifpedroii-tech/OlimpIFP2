from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth as auth_router
from app.routers import noticias as noticias_router
from app.routers import medalhistas as medalhistas_router
from app.routers import olimpiadas as olimpiadas_router
from app.routers import galeria as galeria_router
from app.routers import upload as upload_router
from app.routers import videos as videos_router
from app.routers import eventos as eventos_router


app = FastAPI(
    title="OlimpIFP2 API",
    description="Backend do site institucional OlimpIFP2",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://(olimpifp2.*\.vercel\.app|.*\.supabase\.co)|http://localhost(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["Sistema"])
async def health_check():
    return {"status": "ok", "service": "OlimpIFP2 API"}


app.include_router(auth_router.router)
app.include_router(noticias_router.router)
app.include_router(medalhistas_router.router)
app.include_router(olimpiadas_router.router)
app.include_router(galeria_router.router)
app.include_router(upload_router.router)
app.include_router(videos_router.router)
app.include_router(eventos_router.router)