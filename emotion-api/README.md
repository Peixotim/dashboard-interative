# Emotion API (FastAPI)

API mínima para análise emocional facial a partir de frames base64 (webcam). Preparada para evoluir com áudio, banco e deploy.

## Rodando local

```bash
cd emotion-api
python -m venv .venv && . .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Acesse `http://localhost:8000` e `http://localhost:8000/docs`.

> Nota: Para usar DeepFace, descomente a linha no `requirements.txt` e instale. Pode ser pesado e requer dependências adicionais.

## Endpoints
- `POST /api/v1/session/start` → inicia sessão
- `POST /api/v1/analyze/frame` → recebe frame base64, devolve emoção dominante + scores

### Exemplo de payload
```json
{
  "session_uuid": "<uuid>",
  "timestamp": 1698776299000,
  "frame_base64": "data:image/png;base64,AAA..."
}
```

### Resposta
```json
{
  "status": "ok",
  "received_at": 1698776300123,
  "dominant": "neutral",
  "intensity": 0.12,
  "scores": {"joy": 0.08, "sadness": 0.05, "anger": 0.03, "fear": 0.04, "surprise": 0.06, "disgust": 0.02, "neutral": 0.72}
}
```

## Docker

```bash
cd emotion-api
docker build -t emotion-api:dev .
docker run -p 8000:8000 emotion-api:dev
```

## Próximos passos
- Áudio: endpoint e serviço de análise (librosa/torch/…)
- Persistência: PostgreSQL via SQLAlchemy/Alembic
- Celery/Redis para jobs assíncronos
- Autenticação e quotas
