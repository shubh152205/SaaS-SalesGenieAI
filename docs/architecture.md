# Architecture — SaaS AI Powered Sales Intelligence Forecasting

**Version:** 1.0.0  
**Stack:** FastAPI + React 19 + Scikit-Learn + Faster-Whisper + NVIDIA NIM  
**Deployment:** Render (Backend Docker) + Vercel (Frontend SPA)

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT / BROWSER TIER                        │
│   React 19 + Vite 8 SPA  ·  React Router 7  ·  Recharts       │
│   @dnd-kit Kanban  ·  Axios JWT Interceptor  ·  MediaRecorder  │
│   AuthContext (JWT)  ·  ThemeContext (Dark/Light)               │
└─────────────────────┬───────────────────────────────────────────┘
                      │  HTTPS REST  (Bearer Token)
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                 API GATEWAY / SECURITY TIER                     │
│   FastAPI 0.115  ·  Uvicorn ASGI  ·  Pydantic v2 Validation   │
│   CORS Middleware  ·  PyJWT HS256  ·  PBKDF2-HMAC-SHA256      │
│   APScheduler Background Tasks  ·  /docs Swagger UI            │
└────┬────────────────┬──────────────────┬────────────────────────┘
     │                │                  │
     ▼                ▼                  ▼
┌──────────┐   ┌────────────┐   ┌────────────────────┐
│ ML TIER  │   │  STT TIER  │   │  GENERATIVE AI     │
│          │   │            │   │  TIER              │
│ Random   │   │ Faster-    │   │ NVIDIA NIM         │
│ Forest   │   │ Whisper    │   │ Llama 3.1 70B      │
│ (120T)   │   │ INT8/CPU   │   │ (zero-retention)   │
│          │   │ + FFmpeg   │   │                    │
│ TF-IDF   │   │ + VAD      │   │ Deterministic      │
│ Cosine   │   │            │   │ Offline Fallback   │
│ Sim.     │   │ TextBlob   │   │                    │
└────┬─────┘   └─────┬──────┘   └──────────┬─────────┘
     │               │                      │
     └───────────────┴──────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA TIER                                  │
│   SQLite WAL Mode  ·  7 B-Tree Indexes  ·  60+ Seed Records    │
│   Tables: users, leads, meetings, outreach_logs                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

### 2.1 Application Shell

```
src/
├── App.jsx               # Root router + AuthContext + ThemeContext providers
├── index.css             # Design system tokens (CSS custom properties)
├── api/
│   └── client.js         # Axios singleton with JWT Bearer interceptor
├── context/
│   ├── AuthContext.jsx   # JWT state: login / logout / token persistence
│   └── ThemeContext.jsx  # Dark/Light mode: localStorage + HTML class toggle
├── components/
│   ├── Navbar.jsx        # Top nav: theme toggle, user profile, notifications
│   ├── Sidebar.jsx       # Left nav: branded logo + route links + live pulse
│   ├── SalesGenieLogo.jsx # SVG brand lockup + animated glow ring
│   └── TextToSpeechPlayer.jsx  # Audio playback for AI outreach TTS
└── pages/
    ├── AuthPage.jsx           # 3D Torus Knot canvas + 1-click demo login
    ├── Dashboard.jsx          # KPI cards + Recharts + urgency panel
    ├── LeadIntelligence.jsx   # Lead table + ML score display + filters
    ├── DealPipeline.jsx       # @dnd-kit 5-stage Kanban + ARR aggregation
    ├── AIOutreach.jsx         # NIM email / cadence / InMail generators
    ├── MeetingIntelligence.jsx # Whisper STT + mic recording + sentiment
    └── Settings.jsx           # ML config + theme + API status
```

### 2.2 Data Flow (Frontend → Backend)

```
User Action
    │
    ▼
React Component State
    │
    ▼
api/client.js (Axios)
    ├─ Injects: Authorization: Bearer <JWT>
    ├─ Base URL: VITE_API_URL (env variable)
    └─ Timeout: 30s
    │
    ▼
FastAPI Endpoint
    │
    ▼
Response → Component State Update → UI Re-render
```

### 2.3 State Management

| Concern | Mechanism |
|:---|:---|
| Authentication | `AuthContext` — JWT in `localStorage`, decoded on mount |
| Theme | `ThemeContext` — `dark` CSS class on `<html>`, persisted in `localStorage` |
| Server state | Local `useState` + `useEffect` per page — no global store |
| Kanban drag state | `@dnd-kit` `useSensors` + `DndContext` within `DealPipeline.jsx` |
| Audio recording | `useRef` on `MediaRecorder` instance within `MeetingIntelligence.jsx` |

---

## 3. Backend Architecture

### 3.1 FastAPI Application Structure

```
backend/
├── main.py           # App factory: CORS, router registration, startup lifecycle
├── auth.py           # PBKDF2 hasher + PyJWT encode/decode utilities
├── database.py       # SQLite WAL connection, schema DDL, seed data (60+ accounts)
├── scheduler.py      # APScheduler: daily digest job + ML retrain job
├── ml/
│   └── engine.py     # LeadScorer (RandomForest) + DealMatcher (TF-IDF) classes
├── models/
│   └── schemas.py    # Pydantic v2 request/response models for all routes
├── routers/
│   ├── auth.py       # POST /register, POST /login, GET /me
│   ├── crm.py        # CRUD /leads, GET /pipeline, PATCH /deals/{id}/stage
│   ├── dashboard.py  # GET /kpis, /funnel, /followup-priorities, /activity
│   ├── ml.py         # POST /score, /similar-deals, GET /recommendation/{id}
│   ├── outreach.py   # POST /generate-email, /generate-followup, /generate-linkedin
│   ├── meetings.py   # POST /upload-audio, /transcribe-only, GET /summary
│   └── automation.py # POST /send-followup-digest, GET /status
└── services/
    ├── nim_client.py     # Async HTTPX client for NVIDIA NIM API + fallback
    └── whisper_service.py # Faster-Whisper singleton + FFmpeg converter + VAD
```

### 3.2 Request Lifecycle

```
HTTP Request
    │
    ▼
CORSMiddleware (origins whitelist)
    │
    ▼
JWT Auth Check (dependency injection on protected routes)
    │
    ├─ /api/ml/*     → ml/engine.py → LeadScorer.predict() or DealMatcher.find_similar()
    │                                  └─ SQLite reads + Scikit-Learn inference
    │
    ├─ /api/meetings/upload-audio
    │   └─ whisper_service.py
    │       ├─ FFmpeg: any format → 16kHz mono PCM WAV
    │       ├─ WhisperModel.transcribe() [beam=3, vad=True]
    │       ├─ TextBlob sentiment analysis
    │       └─ nim_client.call_nim() → action item extraction
    │
    ├─ /api/outreach/*  → nim_client.py → NVIDIA NIM API
    │                                      └─ Deterministic fallback if unavailable
    │
    └─ /api/crm/*      → database.py → SQLite WAL read/write
```

---

## 4. ML Engine Architecture

### 4.1 Lead Scoring (`RandomForestClassifier`)

```
Input Features (7):
┌─────────────────────────────┬───────────────────────────┐
│ email_opens (int)           │ Engagement signal          │
│ website_visits (int)        │ Product interest           │
│ demo_requested (bool 0/1)   │ High-intent trigger (+24) │
│ company_size (encoded)      │ Small/Medium/Enterprise    │
│ industry (encoded)          │ 20+ SaaS-adjacent verticals│
│ funding_stage (encoded)     │ Seed → Series D → Public  │
│ days_since_contact (int)    │ Recency penalty            │
└─────────────────────────────┴───────────────────────────┘

Model: RandomForestClassifier(n_estimators=120, random_state=42)
Target: Binary classification (status == "Won" → 1, else → 0)

Output:
  probability (0.0–1.0) from model.predict_proba()
  engagement_boost = (visits × 0.8) + (opens × 1.2) + (demo × 24.0)
  composite_score  = clamp(probability × 40 + boost, 15, 99)

Score → Badge:
  ≥ 80 → 🔥 Hot Lead   → "Schedule Product Demo Immediately"
  ≥ 60 → ✅ Qualified  → "Send Personalized Proposal"
  ≥ 40 → 🌡️ Warm Lead  → "Nurture with Educational Content"
  <  40 → ❄️ Cold Lead  → "Add to Long-term Drip Campaign"
```

### 4.2 Deal Benchmarking (`TF-IDF + Cosine Similarity`)

```
Input: Lead profile dict (tech stack, industry, size, deal notes)
         ↓ stringify and normalize
TfidfVectorizer.fit_transform([historical_deals + [new_lead]])
         ↓
linear_kernel(new_lead_vec, historical_vecs)
         ↓
Top-K similar Closed-Won deals with similarity % + deal metadata
```

### 4.3 Retraining Lifecycle

```
APScheduler (interval: 24h)
    └─ LeadScorer.train()
        └─ SELECT * FROM leads WHERE len > 5
            └─ re-fit RandomForestClassifier
                └─ self.is_trained = True
```

---

## 5. Speech-to-Text Pipeline

```
Audio Input (browser upload or live mic)
    │
    ▼
/api/meetings/upload-audio (multipart/form-data)
    │
    ▼
Save → /backend/uploads/<uuid>.<ext>
    │
    ▼
whisper_service.convert_audio_to_wav()
    └─ ffmpeg -i input -vn -ar 16000 -ac 1 -c:a pcm_s16le output.wav -y
    │
    ▼
whisper_service.get_whisper_model() → cached WhisperModel singleton
    └─ WhisperModel("base", device="cpu", compute_type="int8")
    │
    ▼
model.transcribe(wav, beam_size=3, vad_filter=True)
    └─ Returns: segments iterator + info
    │
    ▼
Segment assembly → full transcript text
    │
    ▼
TextBlob(text).sentiment → polarity → sentiment label
    │
    ▼
nim_client.call_nim() → action item extraction prompt
    │
    ▼
Response: {success, text, language, duration, segments, sentiment, action_items}
    │
    ▼
Cleanup: delete temp WAV file
```

---

## 6. Generative AI (NVIDIA NIM) Architecture

```
nim_client.call_nim(prompt, system_prompt, max_tokens)
    │
    ▼
HTTPX Async POST → https://integrate.api.nvidia.com/v1/chat/completions
    Headers: Authorization: Bearer {NVIDIA_API_KEY}
    Body: {model: "meta/llama-3.1-70b-instruct", messages: [...], max_tokens}
    │
    ├─ Success (200) → extract choices[0].message.content
    │
    └─ Failure (no API key / timeout / error)
         └─ _deterministic_fallback(lead_data, outreach_type)
              └─ Template-based generation with lead interpolation
```

---

## 7. Database Schema

```sql
-- Users
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'sales_rep',
    created_at TEXT DEFAULT (datetime('now'))
);

-- Leads (Core CRM Entity)
CREATE TABLE leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    industry TEXT,
    company_size TEXT,          -- Small / Medium / Enterprise
    funding_stage TEXT,         -- Seed / Series A-D / Public
    tech_stack TEXT,            -- JSON array of technologies
    status TEXT DEFAULT 'New',  -- New / Qualified / Proposal / Negotiation / Won / Lost
    score INTEGER DEFAULT 0,
    email_opens INTEGER DEFAULT 0,
    website_visits INTEGER DEFAULT 0,
    demo_requested INTEGER DEFAULT 0,
    last_contact_date TEXT,
    deal_value REAL DEFAULT 0,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Meetings / Call Intelligence
CREATE TABLE meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER REFERENCES leads(id),
    transcript TEXT,
    summary TEXT,
    action_items TEXT,           -- JSON array
    sentiment TEXT,              -- Positive / Neutral / Negative
    sentiment_score REAL,
    duration REAL,
    audio_filename TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes (7 B-Tree)
CREATE INDEX idx_leads_status    ON leads(status);
CREATE INDEX idx_leads_score     ON leads(score);
CREATE INDEX idx_leads_industry  ON leads(industry);
CREATE INDEX idx_leads_created   ON leads(created_at);
CREATE INDEX idx_meetings_lead   ON meetings(lead_id);
CREATE INDEX idx_meetings_created ON meetings(created_at);
CREATE INDEX idx_users_email     ON users(email);
```

---

## 8. Deployment Architecture

### 8.1 Render (Backend)

```
GitHub Push → Render Build Trigger
    │
    ▼
docker build -f Dockerfile .           (Root directory: empty)
    ├─ FROM python:3.11-slim
    ├─ RUN apt-get install ffmpeg curl build-essential
    ├─ COPY backend/requirements.txt → pip install
    ├─ RUN python3 -c "WhisperModel('base'...)"  # Pre-cache model weights
    ├─ COPY backend/ .
    └─ CMD uvicorn main:app --host 0.0.0.0 --port 8000
    │
    ▼
Container deployed → oregon region → health check GET /
    │
    ▼
ENV: PORT=8000, NVIDIA_API_KEY=..., WHISPER_MODEL_NAME=base
```

### 8.2 Vercel (Frontend)

```
GitHub Push → Vercel Build
    │
    ▼
Root Directory: frontend
Build Command: npm run build
Output: dist/
    │
    ▼
vercel.json SPA rewrite:
  { "source": "/(.*)", "destination": "/index.html" }
    │
    ▼
ENV: VITE_API_URL=https://<backend>.onrender.com
```

---

## 9. Security Architecture

| Layer | Mechanism |
|:---|:---|
| **Password Storage** | PBKDF2-HMAC-SHA256 with 260,000 iterations + 32-byte random salt |
| **Session Management** | Stateless JWT (HS256, 7-day expiry), no server-side sessions |
| **Token Transmission** | HTTP-only via Axios `Authorization: Bearer` header (not cookies) |
| **CORS** | Explicit origin whitelist: `localhost:5173`, `localhost:3000`, production Vercel domain, wildcard removed in production |
| **AI Privacy** | NVIDIA NIM zero-retention API — no prompt data persisted by provider |
| **File Upload** | Audio files stored in `/backend/uploads/`, deleted after transcription |
| **SQL Safety** | All queries use parameterized statements via SQLite cursor |

---

## 10. Performance Characteristics

| Operation | Typical Latency |
|:---|:---|
| JWT decode + route dispatch | < 5ms |
| ML lead scoring (RandomForest) | < 50ms |
| TF-IDF cosine similarity | < 100ms |
| SQLite CRUD (WAL, indexed) | < 30ms |
| NIM API (cold) | 2–6s |
| NIM API (warm) | 1–3s |
| Deterministic fallback | < 50ms |
| Whisper transcription (1 min audio) | 8–15s on CPU INT8 |
| FFmpeg audio conversion | 1–3s |
| Full audio upload pipeline | 15–25s (5 min call) |
| Frontend bundle load (cached) | < 200ms |
| First Contentful Paint | < 800ms |
