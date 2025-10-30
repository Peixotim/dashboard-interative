# Dashboard Emocional Integrativo – Monorepo (Frontend + Backend)

Um MVP completo para captura e análise emocional em tempo real:
- Frontend Next.js (Tailwind + Recharts + Framer Motion + shadcn/ui)
- Backend FastAPI (análise facial – DeepFace opcional – e pronto para evoluir com áudio)
- Docker Compose para subir API e PostgreSQL (DB reservado para próxima etapa)

---

## 1. Visão Geral

O usuário acessa o site, aceita os termos LGPD (ConsentGate), e a webcam é ativada (WebcamCapture). Periodicamente um frame é capturado e enviado ao backend. A API retorna a emoção dominante e scores (mock ou DeepFace, se habilitado). O dashboard exibe o estado em tempo real.

---

## 2. Arquitetura do Repositório

```
.
├─ docker-compose.yml                 # Sobe API (FastAPI) e Postgres
├─ README.md                          # ESTE DOCUMENTO
├─ emotion-api/                       # Backend FastAPI
│  ├─ app/
│  │  ├─ main.py                     # App FastAPI
│  │  ├─ api.py                      # Rotas /session/start e /analyze/frame
│  │  ├─ schemas.py                  # Pydantic Schemas
│  │  └─ services/
│  │     └─ facial_analysis.py       # Serviço de análise facial (DeepFace ou mock)
│  ├─ Dockerfile
│  ├─ requirements.txt               # Dependências da API
│  └─ README.md                      # Instruções específicas da API
└─ src/                               # Frontend Next.js
   ├─ app/
   │  ├─ page.tsx                    # Integração ConsentGate + WebcamCapture + Dashboard
   │  └─ layout.tsx
   ├─ components/
   │  ├─ ConsentGate.tsx             # Modal LGPD (bloqueia uso até aceitar)
   │  ├─ WebcamCapture.tsx           # Captura webcam e envia frames para API
   │  ├─ EmotionCard.tsx             # Emoção dominante + intensidade
   │  ├─ TimelineChart.tsx           # Variação de intensidade
   │  ├─ Heatmap.tsx                 # Mini timeline
   │  ├─ PieChart.tsx                # Distribuição de emoções
   │  └─ ui/                         # shadcn/ui (dropdown, select, card, button...)
   ├─ services/
   │  └─ api.ts                      # Cliente HTTP (startSession, analyzeFrame)
   └─ ...
```

---

## 3. Pré‑requisitos
- Node.js 18+
- Docker Desktop (ou Docker Engine + Compose)
- (Opcional) Python 3.11+ se preferir rodar API fora do Docker

---

## 4. Subir tudo com Docker Compose (API + DB)

Na raiz do projeto:
```bash
docker compose up -d --build
```
- API: http://localhost:8000
- Docs (Swagger): http://localhost:8000/docs
- Postgres: exposto em 5432 (user: `emotion`, pass: `emotion`, db: `emotiondb`)

Comandos úteis:
```bash
# Ver logs da API
docker compose logs -f api
# Parar/Remover
docker compose down
```

> Observação: Neste MVP a API ainda não grava no DB; o compose já deixa tudo pronto para a próxima etapa (SQLAlchemy + Alembic).

---

## 5. Rodar o Frontend (Next.js)

Crie `.env.local` na raiz do frontend (no mesmo nível de `src/`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```
Instale e rode:
```bash
npm install
npm run dev
```
Acesse: http://localhost:3000

Fluxo UX:
1) O modal `ConsentGate` pede consentimento LGPD.
2) Após aceitar, abrimos sessão na API (`/session/start`).
3) `WebcamCapture` captura um frame a cada 2s e envia para `/analyze/frame`.
4) O backend devolve emoção dominante/scores (mock ou DeepFace) – pronto para alimentar os gráficos/componentes.

---

## 6. Rodar a API localmente (sem Docker)

```bash
cd emotion-api
python -m venv .venv && . .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
- API: http://localhost:8000
- DeepFace é opcional. Se houver problemas de build, comente no `requirements.txt` e use o mock (o sistema continua funcional).

---

## 7. Variáveis de Ambiente

Frontend (`.env.local`):
- `NEXT_PUBLIC_API_URL`: base da API (ex.: `http://localhost:8000/api/v1`)

Backend (ex.: via compose):
- `DATABASE_URL`: `postgresql+psycopg2://emotion:emotion@db:5432/emotiondb` (reservado para próxima etapa)

---

## 8. API – Endpoints (MVP)

### POST `/api/v1/session/start`
Inicia sessão e retorna `session_uuid`.

Body exemplo:
```json
{ "device_info": {"ua": "..."}, "consent": {"camera": true} }
```
Resp:
```json
{ "session_uuid": "<uuid>" }
```

### POST `/api/v1/analyze/frame`
Recebe frame base64 e retorna emoção.

Body exemplo:
```json
{
  "session_uuid": "<uuid>",
  "timestamp": 1698776299000,
  "frame_base64": "data:image/png;base64,AAA..."
}
```
Resp:
```json
{
  "status": "ok",
  "received_at": 1698776300123,
  "dominant": "neutral",
  "intensity": 0.12,
  "scores": {"joy": 0.08, "sadness": 0.05, ...}
}
```

---

## 9. Boas Práticas já aplicadas
- ConsentGate bloqueia a experiência até o aceite (LGPD by default)
- API cliente isolado em `src/services/api.ts`, baseURL via env
- `WebcamCapture` desacoplado (captura local + callback onCapture)
- Docker Compose organiza serviços (api/db) para dev
- Backend modular (services/), fácil de trocar engine de inferência

Próximas refatorações (planejadas):
- Camada de estado global (zustand/context) para `session_uuid` e últimas emoções
- Retry/exponential backoff no cliente `api.ts`
- Tipos compartilhados entre FE/BE (geração com OpenAPI ou manual)
- Interfaces para serviços (facial/audio) com injeção de dependência
- CORS e logging estruturado (loguru) no backend
- Compose override de desenvolvimento com hot-reload

---

## 10. Roadmap de Evolução
- Persistência real (SQLAlchemy + Alembic): sessões, eventos emocionais, métricas
- Áudio: endpoint e serviço de análise (librosa/torch)
- WebSocket para streaming bidirecional (latência menor que REST)
- Autenticação e quotas de sessão
- Deploy AWS (ECS/EKS) + RDS Postgres + S3 (se gravar artefatos)

---

## 11. Troubleshooting
- **DeepFace falhou no build**: comente a linha no `emotion-api/requirements.txt` e rebuild. O sistema usará mock estável.
- **CORS**: se acessar a API de outra origem, habilitar CORS no FastAPI.
- **Câmera bloqueada**: verifique permissões do navegador.
- **Portas ocupadas**: altere mapeamentos no compose.

---

## 12. Segurança & LGPD
- O ConsentGate explica e coleta consentimento granular (câmera/mic/biometria/armazenamento).
- Em produção, use HTTPS, tokens temporários e consent hash.
- Evite enviar mídia crua quando possível (prefira features/landmarks embarcadas no navegador).

---

## 13. Comandos Úteis
```bash
# Subir API + DB
docker compose up -d --build
# Logs API
docker compose logs -f api
# Parar
docker compose down
# Frontend
npm run dev
```

---

## 14. Licença
MVP educacional/demonstrativo. Ajuste conforme sua necessidade de produto.
