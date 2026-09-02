# 🧠 Comprehensive Memory & Knowledge Base (`memoryy.md`)
**Project:** SaaS AI Powered Sales Intelligence Forecasting (`SaaS-SalesGenieAI`)  
**Maintained For:** AI Assistants, Development Agents, & Revenue Operations Engineers  
**Last Updated:** September 2026  
**Status:** Active & Production-Ready  

---

## 📑 Table of Contents
1. [Executive Summary & Core Objectives](#1-executive-summary--core-objectives)
2. [Full System Architecture & Technology Stack](#2-full-system-architecture--technology-stack)
3. [Repository File Map & Directory Structure](#3-repository-file-map--directory-structure)
4. [Machine Learning & Scoring Engine Contract](#4-machine-learning--scoring-engine-contract)
5. [Audio & Meeting Intelligence Pipeline (Faster-Whisper)](#5-audio--meeting-intelligence-pipeline-faster-whisper)
6. [Agentic AI Outreach (NVIDIA NIM Llama 3.1 70B)](#6-agentic-ai-outreach-nvidia-nim-llama-31-70b)
7. [Database Architecture & Data Persistence (SQLite WAL)](#7-database-architecture--data-persistence-sqlite-wal)
8. [Frontend Architecture & UI/UX Design System](#8-frontend-architecture--uiux-design-system)
9. [DevOps, Cloud Deployment & Environment Config](#9-devops-cloud-deployment--environment-config)
10. [Automated Testing & Quality Assurance](#10-automated-testing--quality-assurance)
11. [Battle-Tested Gotchas & Historical Bug Resolutions](#11-battle-tested-gotchas--historical-bug-resolutions)
12. [Developer CLI Quick Reference & Workflows](#12-developer-cli-quick-reference--workflows)

---

## 1. Executive Summary & Core Objectives

**SaaS-SalesGenieAI** is an enterprise B2B SaaS CRM platform engineered to streamline the end-to-end sales pipeline, accelerate Product-Led Growth (PLG), minimize Customer Acquisition Cost (CAC), and eliminate pipeline leakage through predictive machine learning and agentic AI.

### Four Operational Pillars:
1. **Predictive Lead Scoring & Triage:** 120-tree Random Forest scoring behavioral telemetry, funding stage, and ICP fit.
2. **Historical Deal Benchmarking:** TF-IDF vectorization and Cosine Similarity matching against closed-won SaaS contracts ($50k–$300k ARR).
3. **Conversational Call Intelligence:** Faster-Whisper INT8 Speech-to-Text with Voice Activity Detection (VAD), sentiment polarity analysis, and automatic action item extraction.
4. **Agentic Outreach Orchestration:** NVIDIA NIM (`meta/llama-3.1-70b-instruct`) generating contextual multi-channel cadences (cold emails, 48h follow-ups, LinkedIn InMails) with deterministic fallback templates.

---

## 2. Full System Architecture & Technology Stack

```
                                  +---------------------------------------------+
                                  |              React 19 + Vite 8              |
                                  |      (Vercel SPA - 3D ASCII Torus Knot)     |
                                  +----------------------+----------------------+
                                                         | HTTPS / REST API
                                                         v
                                  +---------------------------------------------+
                                  |              FastAPI Backend                |
                                  |       (Render Docker Container - Py 3.11)   |
                                  +---+------------------+------------------+---+
                                      |                  |                  |
              +-----------------------+                  |                  +-----------------------+
              |                                          |                                          |
              v                                          v                                          v
+---------------------------+              +---------------------------+              +---------------------------+
|      Scikit-Learn ML      |              |    Faster-Whisper STT     |              |     NVIDIA NIM Client     |
| - 120-Tree Random Forest  |              | - INT8 CPU Quantization   |              | - Llama-3.1-70b-Instruct  |
| - TF-IDF Deal Matcher     |              | - FFmpeg 16kHz PCM WAV    |              | - Low Latency Async HTTPX |
| - APScheduler 24h Retrain |              | - VAD Speech Segmentation |              | - Deterministic Fallback  |
+---------------------------+              +---------------------------+              +---------------------------+
              |                                          |                                          |
              +-----------------------+                  |                  +-----------------------+
                                      |                  |                  |
                                      v                  v                  v
                                  +---------------------------------------------+
                                  |             SQLite 3 with WAL Mode          |
                                  |   (Leads, Accounts, Calls, Outreach, Logs)  |
                                  +---------------------------------------------+
```

### Core Tech Stack:
- **Backend Framework:** FastAPI 0.115.0, Uvicorn, Pydantic v2
- **ML / Data Science:** Scikit-Learn 1.5.1, NumPy, Pandas
- **Speech-to-Text:** Faster-Whisper 1.2.1 (`int8` compute), FFmpeg
- **LLM Engine:** NVIDIA NIM (`meta/llama-3.1-70b-instruct`), HTTPX Async
- **Database:** SQLite 3 (Write-Ahead Logging enabled)
- **Frontend Framework:** React 19.2.8, Vite 8.2.0
- **Styling & UI:** TailwindCSS, Custom CSS Tokens, Lucide Icons, Canvas 3D ASCII
- **Testing:** Pytest (22 passing unit tests)
- **DevOps:** Docker, Render Cloud (Backend), Vercel (Frontend)

---

## 3. Repository File Map & Directory Structure

```
salesgenie/
├── memoryy.md                     # Complete persistent project memory (THIS FILE)
├── Dockerfile                     # Root-level Docker configuration for Render
├── render.yaml                    # Infrastructure-as-Code blueprint for Render
├── start.sh                       # Local startup script (runs backend + frontend)
├── package.json                   # Root tooling (Puppeteer for screenshot tests)
├── README.md                      # Public project documentation & badges
├── Title of your Project          # Presentation agenda & project outline
├── capture_screenshots.js         # Automated Puppeteer screenshot test script
├── docs/                          # Comprehensive technical design docs
│   ├── memory.md                  # Concise developer memory reference
│   ├── architecture.md            # In-depth architectural specifications
│   ├── prd.md                     # Product Requirements Document
│   ├── design.md                  # Color palettes, typography & UI guidelines
│   ├── phases.md                  # Milestone trackers (Phases 1-6)
│   └── rules.md                   # Engineering standards & style rules
├── backend/
│   ├── main.py                    # App entry point, CORS, routers & startup hooks
│   ├── database.py                # DB schema initialization & seed datasets (60+ accounts)
│   ├── auth.py                    # JWT authentication & PBKDF2 password hashing
│   ├── scheduler.py               # APScheduler background tasks (24h model retrain)
│   ├── ml/
│   │   └── engine.py              # LeadScorer (RandomForest) & DealSimilarityMatcher (TF-IDF)
│   ├── models/
│   │   └── schemas.py             # Pydantic v2 validation models
│   ├── routers/
│   │   ├── auth.py                # /api/auth/login, /api/auth/register, /api/auth/demo
│   │   ├── crm.py                 # /api/crm/leads, /api/crm/deals, CRUD operations
│   │   ├── dashboard.py           # /api/dashboard/metrics, revenue KPIs
│   │   ├── ml.py                  # /api/ml/score-lead, /api/ml/benchmark-deal
│   │   ├── outreach.py            # /api/outreach/generate-email, cadence generator
│   │   ├── meetings.py            # /api/meetings/upload-audio, transcription & notes
│   │   └── automation.py          # /api/automation/rules, webhook triggers
│   ├── services/
│   │   ├── nim_client.py          # Async NVIDIA NIM LLM client with rule fallback
│   │   └── whisper_service.py     # Faster-Whisper singleton & FFmpeg preprocessor
│   └── tests/
│       └── test_engine.py         # 22 automated unit test assertions
├── frontend/
│   ├── package.json               # React 19 + Vite dependencies
│   ├── vercel.json                # Single-page application rewrite config
│   ├── vite.config.js             # Vite development server & proxy settings
│   └── src/
│       ├── main.jsx               # React DOM entry
│       ├── App.jsx                # Router setup & layout wrapper
│       ├── index.css              # Global styles & CSS variables
│       ├── api/
│       │   └── client.js          # Axios client with JWT interceptor
│       ├── context/
│       │   ├── AuthContext.jsx    # User session & instant demo login state
│       │   └── ThemeContext.jsx   # Dark/Light mode theme state
│       ├── components/
│       │   ├── Navbar.jsx         # Header navigation & theme switcher
│       │   ├── Sidebar.jsx        # Navigation links & active status
│       │   ├── SalesGenieLogo.jsx # SVG brand logo component
│       │   └── TextToSpeechPlayer.jsx # Browser speech synthesis widget
│       └── pages/
│           ├── AuthPage.jsx       # 3D Torus Knot ASCII Login / Demo Access
│           ├── Dashboard.jsx      # High-level SaaS revenue KPI overview
│           ├── LeadIntelligence.jsx # AI lead triage & scoring workbench
│           ├── DealPipeline.jsx   # 5-stage drag-and-drop Kanban pipeline
│           ├── AIOutreach.jsx     # Multi-channel AI cadence generator
│           ├── MeetingIntelligence.jsx # Live microphone & audio STT processor
│           └── Settings.jsx       # System configuration & API key management
└── screenshots/                   # High-resolution retina screenshots of UI
```

---

## 4. Machine Learning & Scoring Engine Contract

### Lead Scoring Model (`LeadScorer`)
- **Algorithm:** 120-tree Random Forest Classifier (`n_estimators=120`, `max_depth=6`, `random_state=42`).
- **Singleton Pattern:** Instantiated once inside `routers/ml.py` to prevent redundant memory allocation.
- **Lazy Training:** Automatically fits on initial request if $\ge 5$ labeled leads exist in the database.
- **APScheduler:** Re-fits the model every 24 hours in the background.

#### Immutable Feature Column Contract:
```python
FEATURE_COLUMNS = [
    "email_opens",         # int: Count of email opens
    "website_visits",       # int: High-intent website pageviews
    "demo_requested",       # int (0 or 1): Explicit demo booking flag
    "size_enc",             # int (0 to 4): Startup=0, SMB=1, Mid-Market=2, Enterprise=3, Strategic=4
    "industry_enc",         # int (0 to 5): Categorical ordinal encoding
    "funding_enc",          # int (0 to 5): Bootstrapped=0, Seed=1, Series A=2, Series B=3, Series C+=4, Public=5
    "days_since_contact"    # int: Recency penalty factor
]
```

#### Score Clamping & Sentinels:
```python
composite_score = round(min(99.0, max(15.0, (probability * 40.0) + engagement_boost)), 1)
```
- **Floor `15.0`:** Prevents dead lead false-negatives on un-engaged accounts.
- **Ceiling `99.0`:** Caps automated score; `100.0` is strictly reserved for manual sales rep hot-overrides.

### Deal Similarity Matcher (`DealSimilarityMatcher`)
- **Algorithm:** TF-IDF Vectorizer + Cosine Similarity comparison against closed-won deals ($50k–$300k ACV).
- **Match Criteria:** Technographic fit, annual revenue tier, industry vertical, and deal timeline.

---

## 5. Audio & Meeting Intelligence Pipeline (Faster-Whisper)

### Audio Pipeline Flow
1. **Client Recording:** Browser `MediaRecorder` captures audio streams in Opus-encoded `.webm`.
2. **FFmpeg Transcoding:** Backend transcodes input stream into 16kHz mono PCM 16-bit `.wav`:
   ```bash
   ffmpeg -i input.webm -vn -ar 16000 -ac 1 -c:a pcm_s16le output.wav -y
   ```
3. **Faster-Whisper Model:** Runs `base` model in `int8` quantization on CPU.
4. **VAD (Voice Activity Detection):** Filter enabled with `min_silence_duration_ms=500` for natural conversational cadence.
5. **NLP Analysis:** Text is passed through sentiment polarity scoring, key phrase extraction, and action item detection.

```python
# Model Initialization Pattern
from faster_whisper import WhisperModel

def get_whisper_model():
    # Singleton pattern avoids reloading 150MB+ model weights into RAM on every call
    if not hasattr(get_whisper_model, "_model"):
        get_whisper_model._model = WhisperModel("base", device="cpu", compute_type="int8")
    return get_whisper_model._model
```

---

## 6. Agentic AI Outreach (NVIDIA NIM Llama 3.1 70B)

### Client Configuration (`services/nim_client.py`)
- **Endpoint:** `https://integrate.api.nvidia.com/v1/chat/completions`
- **Model:** `meta/llama-3.1-70b-instruct`
- **Timeout:** 30 seconds via asynchronous `httpx.AsyncClient`

### Guaranteed Deterministic Fallback Engine
If `NVIDIA_API_KEY` is absent, expired, or the API returns a non-2xx status, the backend seamlessly falls back to a deterministic templating engine. The fallback:
- Injects recipient company name, funding stage, industry, and contact role.
- Generates 3 full cadence touchpoints: Cold Email, 48-Hour Follow-up, and LinkedIn InMail.
- Ensures zero downtime or broken UX during network degradation.

---

## 7. Database Architecture & Data Persistence (SQLite WAL)

### Connection Rules
- All database connections MUST enable **Write-Ahead Logging (WAL)**:
  ```python
  conn = sqlite3.connect("salesgenie.db", check_same_thread=False)
  conn.execute("PRAGMA journal_mode=WAL;")
  conn.row_factory = sqlite3.Row
  ```
- Always use `try...finally: conn.close()` or context managers to eliminate DB lock contention.
- Access row fields exclusively by column name (`row["contact_name"]`), never by numeric index.

### Primary Database Tables
- `users`: ID, email, hashed_password, full_name, role, created_at
- `leads`: ID, company_name, contact_name, email, industry, company_size, funding_stage, email_opens, website_visits, demo_requested, score, priority, status
- `deals`: ID, lead_id, deal_name, amount, stage, win_probability, expected_close_date
- `meetings`: ID, lead_id, title, transcript, summary, sentiment_score, action_items, audio_path
- `outreach_logs`: ID, lead_id, channel, subject, body, sent_at, status
- `automation_rules`: ID, trigger_type, condition_field, threshold_value, action_type

---

## 8. Frontend Architecture & UI/UX Design System

### Design Philosophy
- **Modern Aesthetic:** Dark-mode-first aesthetic with deep slate/indigo background tones (`#0a0f1d`), high-contrast typographic hierarchy (Inter & JetBrains Mono), and subtle border glows (`rgba(99, 102, 241, 0.15)`).
- **3D ASCII Torus Knot:** Interactive canvas rendering a rotating mathematical torus knot using ASCII characters on the Auth Page.
- **Theme Support:** Global `ThemeContext` providing dynamic contrast adaptation for light and dark modes.

### Critical Frontend Rules:
1. **API Client:** Always import `client` from `src/api/client.js` (handles JWT token attachment in `Authorization: Bearer <token>`).
2. **Audio Recorder Cleanup:** Unmount hooks in `MeetingIntelligence.jsx` must stop all media tracks to release microphone hardware locks.

---

## 9. DevOps, Cloud Deployment & Environment Config

### Render Deployment (Backend Docker)
- **Root Directory:** Must be left **EMPTY / BLANK** (do NOT set to `backend/`).
- **Dockerfile:** Points to root `./Dockerfile`.
- **Reason:** The root Dockerfile executes `COPY backend/requirements.txt .` and `COPY backend/ .`. Setting root directory to `backend/` creates path collisions.
- **Pre-downloading Weights:** Dockerfile executes a build-time python hook to download Whisper model weights into the container image, eliminating cold-start latency.

### Vercel Deployment (Frontend)
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **SPA Routing:** Configured in `frontend/vercel.json` (`rewrites: [{ source: "/(.*)", destination: "/index.html" }]`).

### Environment Variables
| Variable | Environment | Description | Example |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | Port number for Uvicorn | `8000` |
| `NVIDIA_API_KEY` | Backend | NVIDIA NIM API Key | `nvapi-xxxx...` |
| `WHISPER_MODEL_NAME` | Backend | Quantized STT model tier | `base` (or `tiny`, `small`) |
| `JWT_SECRET` | Backend | Secret key for signing tokens | `secret-hex-key` |
| `VITE_API_URL` | Frontend | Backend URL for API calls | `http://localhost:8000` |

---

## 10. Automated Testing & Quality Assurance

The codebase includes a comprehensive 22-test automated suite (`backend/tests/test_engine.py`):
1. **Auth & Security:** Password hashing verification, token generation, invalid token rejection.
2. **ML Engine:** Random Forest score consistency, boundary clamping ($15 \le score \le 99$), TF-IDF deal matching.
3. **Audio Preprocessing:** FFmpeg WAV conversion validity, parameter formatting.
4. **CRM & Database:** SQLite WAL integrity, lead updates, cascade relations.
5. **NIM Fallback:** Template interpolation correctness when API key is missing.

Run full test suite:
```bash
pytest backend/tests/test_engine.py -v
```

---

## 11. Battle-Tested Gotchas & Historical Bug Resolutions

### Gotcha 1: Render Docker `COPY: file not found` Build Error
- **Symptom:** Build fails with `COPY backend/requirements.txt: file not found`.
- **Root Cause:** Double nesting if Render Root Directory is set to `backend`.
- **Fix:** Keep Render Root Directory empty; use root-level `Dockerfile`.

### Gotcha 2: WebM Browser Audio Yields Empty Whisper Transcription
- **Symptom:** Faster-Whisper returns blank transcript `""` for recorded audio.
- **Root Cause:** Browser `MediaRecorder` generates Opus-compressed WebM chunks that raw Whisper cannot decode directly.
- **Fix:** Always execute `convert_audio_to_wav()` via FFmpeg before calling `model.transcribe()`.

### Gotcha 3: Git Push Rejected (Non-Fast-Forward)
- **Fix Workflow:**
  ```bash
  git stash
  git pull --rebase origin main
  git stash pop
  git push origin main
  ```

### Gotcha 4: SQLite Database Locked Error
- **Root Cause:** Unclosed cursor connections during concurrent read/write tasks.
- **Fix:** Set `PRAGMA journal_mode=WAL;` and wrap every database block in `try...finally: conn.close()`.

---

## 12. Developer CLI Quick Reference & Workflows

```bash
# 🚀 Launch Full Stack Locally (Backend on :8000, Frontend on :5173)
./start.sh

# 🐍 Run Backend Manually
cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# ⚛️ Run Frontend Manually
cd frontend && npm run dev

# 🧪 Run Pytest Test Suite
pytest backend/tests/test_engine.py -v

# 📸 Capture High-Resolution UI Screenshots
node capture_screenshots.js

# 🐳 Build & Run Docker Container Locally
docker build -t salesgenie-backend -f Dockerfile .
docker run -p 8000:8000 -e PORT=8000 salesgenie-backend
```

---
*End of `memoryy.md`. Keep this file updated whenever new architectural decisions, models, or environment variables are added.*
