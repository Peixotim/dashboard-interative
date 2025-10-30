from fastapi import APIRouter, HTTPException
from app.schemas import SessionStartIn, SessionStartOut, FrameIn, FrameOut
from app.services.facial_analysis import analyze_face
import uuid
import time

router = APIRouter()

_SESSIONS: set[str] = set()

@router.post("/session/start", response_model=SessionStartOut)
def start_session(payload: SessionStartIn):
    sid = uuid.uuid4().hex
    _SESSIONS.add(sid)
    return SessionStartOut(session_uuid=sid)

@router.post("/analyze/frame", response_model=FrameOut)
def analyze_frame(payload: FrameIn):
    if payload.session_uuid not in _SESSIONS:
        raise HTTPException(404, detail="Sessão não encontrada")
    res = analyze_face(payload.frame_base64)
    return FrameOut(
        status="ok",
        received_at=int(time.time() * 1000),
        dominant=res.get("dominant"),
        intensity=res.get("intensity"),
        scores=res.get("scores"),
    )


