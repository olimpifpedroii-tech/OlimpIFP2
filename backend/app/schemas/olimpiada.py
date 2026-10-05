import json
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class OlimpiadaBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    area: str = Field(..., max_length=100)
    level: str = Field(..., max_length=100)
    desc: str = ""
    medals: list[str] = []
    site_url: str = ""

    @field_validator("medals", mode="before")
    @classmethod
    def parse_medals(cls, v):
        """Converte string JSON do banco em lista real."""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return []
        return v or []


class OlimpiadaCreate(OlimpiadaBase):
    pass


class OlimpiadaUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    area: str | None = Field(None, max_length=100)
    level: str | None = Field(None, max_length=100)
    desc: str | None = None
    medals: list[str] | None = None
    site_url: str | None = None

    @field_validator("medals", mode="before")
    @classmethod
    def parse_medals(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return []
        return v


class OlimpiadaResponse(OlimpiadaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime