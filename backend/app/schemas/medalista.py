from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class MedalistaBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    medal: str = Field(..., max_length=50)
    olympiad: str = Field(..., max_length=100)
    course: str = Field(..., max_length=150)
    quote: str = ""
    photo: str = ""


class MedalistaCreate(MedalistaBase):
    pass


class MedalistaUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=200)
    medal: str | None = Field(None, max_length=50)
    olympiad: str | None = Field(None, max_length=100)
    course: str | None = Field(None, max_length=150)
    quote: str | None = None
    photo: str | None = None


class MedalistaResponse(MedalistaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime