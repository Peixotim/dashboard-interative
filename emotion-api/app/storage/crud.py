from datetime import datetime, timedelta
from sqlalchemy import delete
from sqlalchemy.orm import Session as SASession
from app.storage.database import SessionLocal
from app.storage.models import Session, EmotionEvent


def db_session() -> SASession:
  return SessionLocal()


def create_session(session_uuid: str):
  db = db_session()
  try:
    s = Session(session_uuid=session_uuid)
    db.add(s)
    db.commit()
  finally:
    db.close()


def insert_emotion_event(session_uuid: str, ts_ms: int, dominant: str, intensity: float, scores: dict):
  db = db_session()
  try:
    ev = EmotionEvent(session_uuid=session_uuid, ts_ms=ts_ms, dominant=dominant, intensity=intensity, scores=scores)
    db.add(ev)
    db.commit()
  finally:
    db.close()


def purge_events_older_than(days: int = 30):
  db = db_session()
  try:
    cutoff_dt = datetime.utcnow() - timedelta(days=days)
    cutoff_ms = int(cutoff_dt.timestamp() * 1000)
    db.execute(delete(EmotionEvent).where(EmotionEvent.ts_ms < cutoff_ms))
    db.commit()
  finally:
    db.close()

