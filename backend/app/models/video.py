from datetime import datetime
from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Video(Base):
    __tablename__ = "videos"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(300))
    description: Mapped[str] = mapped_column(Text, default="")
    video_type: Mapped[str] = mapped_column(String(20), default="youtube")  # "youtube" ou "upload"
    youtube_url: Mapped[str] = mapped_column(Text, default="")
    video_url: Mapped[str] = mapped_column(Text, default="")
    thumbnail: Mapped[str] = mapped_column(Text, default="")
    date: Mapped[str] = mapped_column(String(50), default="")
    category: Mapped[str] = mapped_column(String(80), default="Geral")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())