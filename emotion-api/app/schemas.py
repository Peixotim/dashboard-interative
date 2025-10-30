from pydantic import BaseModel, Field
from typing import Dict



class SessionStartIn(BaseModel):
    device_info: Dict = Field(default_factory=dict)
    consent: Dict = Field(default_factory=dict)


class SessionStartOut(BaseModel):
    session_uuid: str


class FrameIn(BaseModel):
    session_uuid: str
    timestamp: int
    frame_base64: str  # dataURL base64 (ex.: data:image/png;base64,AAA...)


class FrameOut(BaseModel):
    status: str
    received_at: int
    dominant: str | None = None
    intensity: float | None = None
    scores: Dict | None = None


