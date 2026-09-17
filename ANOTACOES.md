# OlimpIFP2 — Notas do projeto

## Como rodar

### Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
→ http://localhost:8000/docs

### Frontend
cd . (raiz)
npm run dev
→ http://localhost:5173

### Banco
psql -h localhost -U olimpifp2_user -d olimpifp2_db

## Acesso Admin
http://localhost:5173/login
email: olimpif.pedroii@gmail.com
senha: (a que está no .env)

## Estrutura
- /backend — API Python (FastAPI)
- /src — Frontend React
- /src/lib/api.js — cliente HTTP
- /src/hooks/use-api-data.js — hook de fetch

## Cores por página
- Home: verde + dourado
- Notícias: azul
- Conquistas: âmbar
- Galeria: violeta
- Destaques: âmbar escuro
- Olimpíadas: multicor por área