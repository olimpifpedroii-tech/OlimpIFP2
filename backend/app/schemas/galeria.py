from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class GaleriaBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    date: str = Field(..., max_length=50)
    category: str = Field(..., max_length=80)
    photos: int = 0
    image: str = ""


class GaleriaCreate(GaleriaBase):
    pass


class GaleriaUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    date: str | None = Field(None, max_length=50)
    category: str | None = Field(None, max_length=80)
    photos: int | None = None
    image: str | None = None


class GaleriaResponse(GaleriaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime