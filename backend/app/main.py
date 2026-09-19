from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth as auth_router
from app.routers import noticias as noticias_router
from app.routers import medalhistas as medalhistas_router
from app.routers import olimpiadas as olimpiadas_router
from app.routers import galeria as galeria_router


app = FastAPI(
    title="OlimpIFP2 API",
    description="Backend do site institucional OlimpIFP2",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://olimpifp2.vercel.app",
        "https://olimpifp2-*.vercel.app",  # previews da Vercel
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", tags=["Sistema"])
async def health_check():
    return {"status": "ok", "service": "OlimpIFP2 API"}


# ─── Routers ──────────────────────────────────────────
app.include_router(auth_router.router)
app.include_router(noticias_router.router)
app.include_router(medalhistas_router.router)
app.include_router(olimpiadas_router.router)
app.include_router(galeria_router.router)
