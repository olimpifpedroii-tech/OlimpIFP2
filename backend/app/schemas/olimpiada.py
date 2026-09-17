from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class OlimpiadaBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    area: str = Field(..., max_length=100)
    level: str = Field(..., max_length=100)
    desc: str = ""
    medal: str = Field("Ouro", max_length=50)


class OlimpiadaCreate(OlimpiadaBase):
    pass


class OlimpiadaUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    area: str | None = Field(None, max_length=100)
    level: str | None = Field(None, max_length=100)
    desc: str | None = None
    medal: str | None = Field(None, max_length=50)


class OlimpiadaResponse(OlimpiadaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime