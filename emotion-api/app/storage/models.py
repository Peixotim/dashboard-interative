from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, Float, JSON, func

Base = declarative_base()

class Session(Base):
  __tablename__ = "session"
  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
  session_uuid: Mapped[str] = mapped_column(String(64), unique=True, index=True)
  created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

class EmotionEvent(Base):
  __tablename__ = "emotion_event"
  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
  session_uuid: Mapped[str] = mapped_column(String(64), index=True)
  ts_ms: Mapped[int] = mapped_column(Integer, index=True)
  dominant: Mapped[str] = mapped_column(String(32))
  intensity: Mapped[float] = mapped_column(Float)
  scores: Mapped[dict] = mapped_column(JSON)
  created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

