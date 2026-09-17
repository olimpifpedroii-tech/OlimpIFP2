from app.database import Base, engine
from app import models  # noqa: F401  — importa os modelos pra registrar no Base

print("Criando tabelas...")
Base.metadata.create_all(bind=engine)
print("✅ Tabelas criadas com sucesso!")