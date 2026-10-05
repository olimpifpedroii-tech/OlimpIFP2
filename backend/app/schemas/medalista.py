import json
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class MedalistaBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    medal: str = Field("", max_length=50)
    has_trophy: bool = False
    trophies: list[str] = []
    olympiad: str = Field(..., max_length=100)
    scope: str | None = Field(None, max_length=50)
    course: str = Field("", max_length=150)
    quote: str = ""
    photo: str = ""

    @field_validator("trophies", mode="before")
    @classmethod
    def parse_trophies(cls, v):
        """Converte string JSON do banco em lista real."""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return []
        return v or []

    @model_validator(mode="after")
    def validar_medalha_ou_trofeu(self):
        """Se não tem medalha, PRECISA ter pelo menos 1 troféu."""
        if not self.medal and not self.trophies:
            raise ValueError("É preciso ter uma medalha OU pelo menos um troféu.")
        if self.has_trophy and not self.trophies:
            raise ValueError("Se marcar 'tem troféu', é preciso informar pelo menos um nome.")
        return self


class MedalistaCreate(MedalistaBase):
    pass


class MedalistaUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=200)
    medal: str | None = Field(None, max_length=50)
    has_trophy: bool | None = None
    trophies: list[str] | None = None
    olympiad: str | None = Field(None, max_length=100)
    course: str | None = Field(None, max_length=150)
    quote: str | None = None
    photo: str | None = None

    @field_validator("trophies", mode="before")
    @classmethod
    def parse_trophies(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return []
        return v


class MedalistaResponse(MedalistaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime