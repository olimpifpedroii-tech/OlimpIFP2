from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class VideoBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    description: str = ""
    video_type: str = Field("youtube", max_length=20)
    youtube_url: str = ""
    video_url: str = ""
    thumbnail: str = ""
    date: str = Field("", max_length=50)
    category: str = Field("Geral", max_length=80)


class VideoCreate(VideoBase):
    pass


class VideoUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=300)
    description: str | None = None
    video_type: str | None = Field(None, max_length=20)
    youtube_url: str | None = None
    video_url: str | None = None
    thumbnail: str | None = None
    date: str | None = Field(None, max_length=50)
    category: str | None = Field(None, max_length=80)


class VideoResponse(VideoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime