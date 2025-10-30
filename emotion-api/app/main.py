from fastapi import FastAPI
from app.api import router

app = FastAPI(title="Emotion API")
app.include_router(router, prefix="/api/v1")

@app.get("/")
def health():
    return {"status": "ok", "service": "emotion-api"}


