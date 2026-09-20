from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class EventoBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    date: str = Field(..., max_length=50)
    time: str = Field("", max_length=20)
    location: str = Field("", max_length=200)
    description: str = ""


class EventoCreate(EventoBase):
    pass


class EventoUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=300)
    date: str | None = Field(None, max_length=50)
    time: str | None = Field(None, max_length=20)
    location: str | None = Field(None, max_length=200)
    description: str | None = None


class EventoResponse(EventoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime