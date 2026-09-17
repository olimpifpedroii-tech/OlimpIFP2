from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class NoticiaBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    date: str = Field(..., max_length=50)
    category: str = Field(..., max_length=80)
    summary: str = ""
    image: str = ""
    views: int = 0
    read_time: str = Field("3 min", max_length=20)


class NoticiaCreate(NoticiaBase):
    pass


class NoticiaUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=300)
    date: str | None = Field(None, max_length=50)
    category: str | None = Field(None, max_length=80)
    summary: str | None = None
    image: str | None = None
    views: int | None = None
    read_time: str | None = Field(None, max_length=20)


class NoticiaResponse(NoticiaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime