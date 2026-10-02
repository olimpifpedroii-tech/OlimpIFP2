from datetime import datetime
from sqlalchemy import String, Text, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Medalista(Base):
    __tablename__ = "medalhistas"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    # ⚠️ medal agora é OPCIONAL (pode ter só troféu)
    medal: Mapped[str] = mapped_column(String(50), default="")
    # ⚠️ NOVO: tem troféu?
    has_trophy: Mapped[bool] = mapped_column(Boolean, default=False)
    # ⚠️ NOVO: nomes dos troféus em JSON. Ex: ["Melhor da Escola", "Destaque"]
    trophies: Mapped[str] = mapped_column(Text, default="[]")
    olympiad: Mapped[str] = mapped_column(String(100))
    course: Mapped[str] = mapped_column(String(150))
    quote: Mapped[str] = mapped_column(Text, default="")
    photo: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())