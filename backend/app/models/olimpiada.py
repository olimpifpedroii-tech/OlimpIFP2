from datetime import datetime
from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Olimpiada(Base):
    __tablename__ = "olimpiadas"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    area: Mapped[str] = mapped_column(String(100))
    level: Mapped[str] = mapped_column(String(100))
    desc: Mapped[str] = mapped_column(Text, default="")
    medal: Mapped[str] = mapped_column(String(50), default="Ouro")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())