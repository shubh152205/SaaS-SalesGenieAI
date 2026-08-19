# Phases — SaaS AI Powered Sales Intelligence Forecasting

**Version:** 1.0.0  
**Timeline:** Development Phases Completed & Planned

---

## Phase Map Overview

```
Phase 0: Foundation       → ✅ Complete
Phase 1: ML Core          → ✅ Complete
Phase 2: Intelligence     → ✅ Complete
Phase 3: Generative AI    → ✅ Complete
Phase 4: Dashboard & UX   → ✅ Complete
Phase 5: Production       → ✅ Complete
Phase 6: Scale & Growth   → 🔵 Planned
```

---

## ✅ Phase 0 — Foundation (Project Scaffold & Auth)

**Goal:** Establish the full-stack scaffold, authentication system, and SQLite data layer with seed data.

### Deliverables
- [x] Vite + React 19 frontend scaffold with React Router 7
- [x] FastAPI backend with Uvicorn ASGI server
- [x] SQLite schema with WAL mode and 7 B-Tree indexes
- [x] JWT HS256 stateless authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`)
- [x] PBKDF2-HMAC-SHA256 password hashing
- [x] 60+ pre-seeded enterprise SaaS accounts (Snowflake, Datadog, Stripe, Twilio, Elastic, GitLab, etc.)
- [x] Axios HTTP client with JWT Bearer interceptor
- [x] `AuthContext` with persistent token in `localStorage`
- [x] 1-click instant demo login (`demo@salesgenie.ai` / `password123`)
- [x] `start.sh` one-command local launcher

### Key Technical Decisions
- **SQLite over PostgreSQL** for zero-infrastructure local development and Render free tier compatibility. WAL mode enables concurrent reads without locking.
- **Stateless JWT** to avoid server-side session state and simplify horizontal scaling.

---

## ✅ Phase 1 — ML Lead Scoring Engine

**Goal:** Build the core supervised ML lead intent scoring and deal benchmarking engine.

### Deliverables
- [x] `LeadScorer` class: `RandomForestClassifier` with 120 estimators, trained on 7 behavioral and firmographic features
- [x] Feature encoding: `LabelEncoder` for industry (20 categories), company size, and funding stage (Seed → Public)
- [x] Composite score formula: `clamp(probability × 40 + engagement_boost, 15, 99)`
- [x] Score → Badge → Next Action recommendation mapping (Hot / Qualified / Warm / Cold)
- [x] `DealMatcher` class: `TfidfVectorizer` + `linear_kernel` cosine similarity against historical Closed-Won SaaS contracts
- [x] Auto-retrain on startup if ≥ 5 labeled leads exist
- [x] ML router: `POST /api/ml/score`, `/api/ml/score-lead`, `/api/ml/similar-deals`, `GET /api/ml/recommendation/{id}`
- [x] ML metrics endpoint: model accuracy, feature importance rankings
- [x] 22 automated Pytest unit tests covering all scoring boundaries

### Key Technical Decisions
- **RandomForest over Logistic Regression** for non-linear feature interactions (demo_requested × funding_stage signals are not linearly separable).
- **Composite score over raw probability** to maintain interpretability for sales reps who need a 0–100 scale, not a 0.0–1.0 float.

---

## ✅ Phase 2 — CRM & Kanban Deal Pipeline

**Goal:** Build the full CRM data layer and interactive 5-stage Kanban deal pipeline.

### Deliverables
- [x] CRM router: `GET/POST /api/crm/leads`, `PATCH /api/crm/leads/{id}/stage`, `DELETE /api/crm/leads/{id}`
- [x] Pipeline router: `GET /api/crm/pipeline` returning leads grouped by stage with ARR aggregation
- [x] `DealPipeline.jsx`: 5-stage Kanban board with `@dnd-kit` drag-and-drop
- [x] Per-stage ARR card aggregation visible at top of each column
- [x] Quick-action stage progression buttons on each deal card
- [x] `LeadIntelligence.jsx`: sortable, filterable lead table with ML intent scores, badges, and company metadata
- [x] Lead detail panel with engagement metrics (email opens, website visits, demo status)
- [x] `PATCH /api/crm/deals/{id}/stage` endpoint for programmatic stage updates

### Key Technical Decisions
- **`@dnd-kit` over `react-beautiful-dnd`** for React 19 compatibility and full TypeScript support.
- **Stage grouping on server** (`/api/crm/pipeline`) rather than client to reduce data transfer for large pipelines.

---

## ✅ Phase 3 — Call Intelligence & Faster-Whisper STT

**Goal:** Build the real-time speech-to-text pipeline for demo call transcription and NLP analysis.

### Deliverables
- [x] `whisper_service.py`: Faster-Whisper singleton with threading lock, INT8 quantization on CPU
- [x] FFmpeg audio converter: any format → 16kHz mono PCM WAV
- [x] VAD (Voice Activity Detection) filter to remove silence before transcription
- [x] Live browser microphone recording via `MediaRecorder` API in `MeetingIntelligence.jsx`
- [x] Audio upload endpoint: `POST /api/meetings/upload-audio`
- [x] TextBlob sentiment polarity scoring: Positive / Neutral / Negative + numeric polarity
- [x] NIM-powered action item extraction from transcripts
- [x] Fallback: Google Speech Recognition when Whisper model unavailable
- [x] Meeting storage: transcript, summary, action items, sentiment saved to SQLite
- [x] `GET /api/meetings/summary` — meeting statistics
- [x] Automatic temp file cleanup in `finally` block

### Key Technical Decisions
- **`faster-whisper` over OpenAI `whisper` package** for 4× faster inference on CPU via CTranslate2 INT8 quantization.
- **`base` model by default**: best accuracy/speed tradeoff for 5-10 minute sales demo calls on CPU. Configurable via `WHISPER_MODEL_NAME` env variable.
- **FFmpeg preprocessing mandatory**: raw WebM/OGG from browser `MediaRecorder` cannot be reliably decoded by Whisper — normalization to 16kHz mono WAV is non-negotiable.

---

## ✅ Phase 4 — Agentic NVIDIA NIM Outreach Engine

**Goal:** Build the LLM-powered outreach generation system with zero-retention inference and deterministic fallback.

### Deliverables
- [x] `nim_client.py`: async HTTPX client for `meta/llama-3.1-70b-instruct` via NVIDIA NIM API
- [x] Cold email generator with funding-round hooks and tech-stack alignment: `POST /api/outreach/generate-email`
- [x] 48h / 72h follow-up cadence generator: `POST /api/outreach/generate-followup`
- [x] LinkedIn InMail generator (exec peer-to-peer voice): `POST /api/outreach/generate-linkedin`
- [x] Unified endpoint: `POST /api/outreach/generate-outreach`
- [x] Industry-specific strategy recommendations: `GET /api/outreach/strategy/{lead_id}`
- [x] Deterministic offline fallback engine: full template-based generation when NIM is unavailable
- [x] `AIOutreach.jsx`: 3-panel UI (Cold Email / Follow-up / LinkedIn) with real-time generation feedback
- [x] Copy-to-clipboard for all generated content
- [x] Meeting context injection: follow-up emails reference previous call transcript context

### Key Technical Decisions
- **Zero-retention NVIDIA NIM** (not OpenAI) to ensure no training on proprietary deal data.
- **Deterministic fallback over empty states**: the platform must produce usable output even without a paid API key, making it viable for offline demos.

---

## ✅ Phase 5 — Executive Dashboard, Theme System & Production Deployment

**Goal:** Build the executive KPI dashboard, implement global Light/Dark theme, and deploy to production.

### Deliverables

**Dashboard:**
- [x] 6-card KPI suite: Active Pipeline ARR, Hot Leads, Win Rate, Avg Deal Size, Response Time, Sales Cycle
- [x] Period filtering: Monthly / Quarterly / Yearly / All-Time
- [x] Recharts funnel stage visualization
- [x] AI follow-up urgency triage panel (Critical / Moderate / Healthy)
- [x] ML metrics card: model accuracy + feature importance
- [x] APScheduler: background daily follow-up digest + 24h ML retraining
- [x] `POST /api/dashboard/automation/trigger-followup` manual trigger

**Theme & UX:**
- [x] `ThemeContext`: persistent Light/Dark mode via `localStorage` + `<html>` CSS class toggling
- [x] Full design system in `index.css` with CSS custom property tokens for both modes
- [x] `SalesGenieLogo.jsx`: SVG brand lockup with animated pulse glow ring + "SaaS" pill badge
- [x] Consistent branding across all 7 pages (subtitle: "SaaS AI Powered Sales Intelligence Forecasting")

**Production:**
- [x] Root-level `Dockerfile` for Render with Whisper model pre-cache
- [x] `vercel.json` with SPA `/*` → `/index.html` rewrite rule
- [x] `render.yaml` infrastructure-as-code blueprint
- [x] Production CORS whitelist for Vercel domain
- [x] Frontend deployed to Vercel (Root Directory: `frontend`)
- [x] Backend deployed to Render (Docker, empty Root Directory)

---

## 🔵 Phase 6 — Scale, Collaboration & Enterprise (Planned)

**Goal:** Evolve from a single-user demo platform to a multi-user enterprise revenue operations system.

### Planned Deliverables

**Multi-User & RBAC:**
- [ ] Role-based access control: Admin, Sales Manager, AE, SDR
- [ ] Team lead assignment and ownership tracking
- [ ] Activity audit log per user

**CRM Integrations:**
- [ ] Salesforce bidirectional sync (leads + deal stages)
- [ ] HubSpot CRM integration
- [ ] Gmail / Outlook sent email tracking for opens

**AI Enhancements:**
- [ ] Fine-tuned Llama model on historical Closed-Won deal transcripts
- [ ] Semantic search over meeting transcript corpus (FAISS / pgvector)
- [ ] Real-time WebSocket-based transcript streaming during live calls
- [ ] Automated follow-up email dispatch (SMTP / SendGrid integration)

**Infrastructure:**
- [ ] Migrate SQLite → PostgreSQL for multi-user concurrent writes
- [ ] Redis caching layer for ML predictions (TTL: 5 minutes per lead)
- [ ] Horizontal scaling behind load balancer
- [ ] Prometheus + Grafana observability stack

**Analytics:**
- [ ] Cohort-based conversion funnel analysis
- [ ] Rep performance leaderboard
- [ ] Forecast accuracy tracking (predicted vs. actual conversion)
- [ ] Revenue waterfall chart by quarter

---

## Phase Completion Summary

| Phase | Status | Core Contribution |
|:---|:---|:---|
| 0 — Foundation | ✅ Complete | Auth, SQLite, seed data, scaffold |
| 1 — ML Core | ✅ Complete | RandomForest scoring, TF-IDF matching, 22 tests |
| 2 — CRM & Kanban | ✅ Complete | CRUD leads, @dnd-kit pipeline, ARR aggregation |
| 3 — Call Intelligence | ✅ Complete | Faster-Whisper STT, FFmpeg, VAD, sentiment, mic |
| 4 — Agentic Outreach | ✅ Complete | NVIDIA NIM LLM, cold email/follow-up/InMail, fallback |
| 5 — Dashboard & Production | ✅ Complete | KPIs, theme system, Render + Vercel deployment |
| 6 — Enterprise Scale | 🔵 Planned | RBAC, CRM sync, PostgreSQL, WebSocket STT |
