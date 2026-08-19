# Memory — SaaS AI Powered Sales Intelligence Forecasting

**Purpose:** A persistent technical reference for AI agents, LLM assistants, and future engineers working in this codebase. Contains battle-tested decisions, known patterns, gotchas, and resolved issues.  
**Version:** 1.0.0  
**Last Updated:** 2026-08-20

---

## 1. Critical Configuration Facts

### Render Deployment (Backend Docker)
- **Root Directory:** Must be **empty / blank** — not `backend/`, not `./`.
- **Dockerfile Path:** `Dockerfile` (root-level, NOT `backend/Dockerfile`).
- **Why:** The root `Dockerfile` uses `COPY backend/requirements.txt` and `COPY backend/ .` paths. If Root Directory is set to `backend/`, the build context is wrong and paths break.
- **The root `Dockerfile`** pre-downloads the Whisper `base` model during the `docker build` step to avoid cold-start timeouts at runtime:
  ```dockerfile
  RUN python3 -c "from faster_whisper import WhisperModel; WhisperModel('base', device='cpu', compute_type='int8')"
  ```

### Vercel Deployment (Frontend)
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **SPA Routing:** `frontend/vercel.json` contains the required rewrite rule:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- **API URL:** Set `VITE_API_URL` to the full Render backend URL (e.g., `https://salesgenie-backend.onrender.com`).

### CORS
- `main.py` currently includes `"*"` in `allow_origins` for development convenience.
- For production hardening, replace with the exact Vercel domain in the `FRONTEND_URL` env variable.

---

## 2. ML Engine Patterns

### LeadScorer Initialization
- The `LeadScorer` is a **module-level singleton** instantiated in `routers/ml.py`.
- It is **lazy-trained** on first predict request if ≥5 labeled leads exist.
- The `APScheduler` retriggers `train()` every 24h to incorporate new data.
- **Never pass fewer than 5 leads** to `train()` — the method silently returns without error.

### Feature Column Order Contract
This exact order is immutable and must not change without full model retraining:
```python
["email_opens", "website_visits", "demo_requested", "size_enc", "industry_enc", "funding_enc", "days_since_contact"]
```

### Score Clamping
```python
composite_score = round(min(99.0, max(15.0, (probability * 40.0) + engagement_boost)), 1)
```
- Min is `15.0` (not 0) — avoids "dead lead" absolute signals on unscored entries.
- Max is `99.0` (not 100) — 100 is reserved as a sentinel for "manually overridden hot lead".

---

## 3. Whisper STT Patterns

### Model Loading
```python
# Correct pattern — always use the singleton getter
model = get_whisper_model()

# Never do this in a route handler
model = WhisperModel("base", device="cpu", compute_type="int8")  # ❌ Creates new instance every call
```

### Required FFmpeg Preprocessing
Browser `MediaRecorder` outputs `.webm` (Opus codec). Whisper requires 16kHz mono PCM WAV. This conversion is **not optional**:
```python
convert_audio_to_wav(input_path)
# → ffmpeg -i input -vn -ar 16000 -ac 1 -c:a pcm_s16le output.wav -y
```
Without this step, Whisper will produce garbled or empty transcriptions on browser-recorded audio.

### VAD Parameters
```python
model.transcribe(audio, vad_filter=True, vad_parameters=dict(min_silence_duration_ms=500))
```
`min_silence_duration_ms=500` is calibrated for sales conversations with natural pauses. Lower values cause mid-sentence splits; higher values merge separate speakers.

### Fallback Chain
```
WhisperModel("base")  →  fails  →  WhisperModel("tiny")  →  fails  →  _fallback_speech_recognition() (Google SR)
```

---

## 4. NVIDIA NIM Patterns

### Client Call Pattern
```python
# nim_client.py
result = await call_nim(prompt=..., system_prompt=..., max_tokens=800)
```

### Fallback Trigger Conditions
The deterministic fallback activates when:
1. `NVIDIA_API_KEY` environment variable is not set
2. NIM API returns non-2xx status
3. HTTPX timeout (default: 30s)
4. Any exception during async HTTP call

The fallback is template-based but fully interpolated with lead data — it does not produce generic placeholder text.

### Prompt Grounding (Always Include)
```python
system_prompt = """You are an expert B2B SaaS sales copywriter.
Generate professional outreach for the {industry} space.
Lead: {company_name}, {funding_stage} funded, {company_size}.
Do not reference any sensitive or personal data beyond what is required for professional outreach."""
```

---

## 5. Database Patterns

### Connection Pattern
```python
# Always use this pattern — never leave connections open
conn = get_db()
try:
    cur = conn.cursor()
    cur.execute("SELECT * FROM leads WHERE id = ?", (lead_id,))
    row = cur.fetchone()
finally:
    conn.close()
```

### Row Access
All connections use `row_factory = sqlite3.Row`. Access columns by name:
```python
lead_name = row["contact_name"]  # ✅
lead_name = row[2]               # ❌ — fragile, breaks on schema change
```

### Seed Data Trigger
Seed data (60+ enterprise SaaS accounts) is inserted by `database.py:init_db()` only when the `leads` table is empty. Safe to call on every startup.

---

## 6. Frontend Patterns

### API Call Pattern
```javascript
// ✅ Always import the client
import client from '../api/client';
const { data } = await client.get('/api/crm/leads');

// ❌ Never import axios directly in components
import axios from 'axios';
```

### Theme Access Pattern
```jsx
// ✅ Use context
import { useTheme } from '../context/ThemeContext';
const { theme, toggleTheme } = useTheme();

// ❌ Never directly touch DOM or localStorage
document.documentElement.classList.toggle('dark'); // Bypasses context sync
```

### Audio Recording Cleanup
The `MediaRecorder` ref in `MeetingIntelligence.jsx` must be stopped and nulled on unmount:
```javascript
useEffect(() => {
  return () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
  };
}, []);
```

---

## 7. Known Issues & Resolutions

### Issue: Render Docker "double-path" build failure
**Symptom:** `COPY backend/requirements.txt: file not found` during Render build  
**Cause:** `render.yaml` or Render dashboard had `Root Directory: backend` AND `Dockerfile` had `COPY backend/requirements.txt` — double nesting.  
**Resolution:** Set Render Root Directory to **empty/blank**. Use root-level `Dockerfile` with explicit `backend/` prefix in `COPY` commands.

### Issue: Puppeteer screenshot script fails with MODULE_NOT_FOUND
**Symptom:** `Cannot find module '/tmp/puppeteer-test/node_modules/puppeteer'`  
**Cause:** Script was referencing a hardcoded temp path.  
**Resolution:** Use `puppeteer-core` installed in the project root (`npm install --save-dev puppeteer-core`) and reference the system Chrome binary:
```javascript
const puppeteer = require('puppeteer-core');
executablePath: '/usr/bin/google-chrome'
```

### Issue: git push rejected (non-fast-forward)
**Symptom:** `! [rejected] main -> main (non-fast-forward)` after local commit  
**Resolution:**
```bash
git stash
git pull --rebase origin main
git stash pop
git push origin main
```

### Issue: WebM audio from browser produces empty Whisper transcript
**Symptom:** `text: ""` returned from `/api/meetings/upload-audio` for browser-recorded audio  
**Cause:** Browser `MediaRecorder` outputs Opus-encoded WebM, which Whisper cannot decode reliably without preprocessing.  
**Resolution:** `convert_audio_to_wav()` in `whisper_service.py` must always run before `model.transcribe()`.

### Issue: Whisper model loading blocks the first API request for 15–30s
**Cause:** Model is lazily loaded on first transcription request.  
**Resolution:** The root `Dockerfile` pre-downloads the model weights during build:
```dockerfile
RUN python3 -c "from faster_whisper import WhisperModel; WhisperModel('base', device='cpu', compute_type='int8')"
```

---

## 8. Environment Variable Quick Reference

### Backend (`.env` or Render dashboard)
```env
PORT=8000
NVIDIA_API_KEY=nvapi-...             # Optional — enables NIM LLM (falls back to deterministic engine)
WHISPER_MODEL_NAME=base              # Options: tiny, base, small, medium, large-v3
JWT_SECRET=your-jwt-secret-key       # Must be set; default is insecure placeholder
```

### Frontend (`.env` or Vercel dashboard)
```env
VITE_API_URL=http://localhost:8000   # Local dev
# VITE_API_URL=https://salesgenie-backend.onrender.com  # Production
```

---

## 9. Project Structure Cheat Sheet

```
salesgenie/
├── Dockerfile                    # Root-level Docker build (Render: empty Root Dir)
├── render.yaml                   # Render IaC blueprint
├── start.sh                      # ./start.sh — starts backend + frontend locally
├── README.md                     # Project documentation
├── docs/                         # Engineering documentation
│   ├── prd.md                    # Product Requirements Document
│   ├── architecture.md           # System architecture & data flows
│   ├── rules.md                  # Engineering conventions & rules
│   ├── phases.md                 # Development milestones (completed + planned)
│   ├── design.md                 # Design system & visual language
│   └── memory.md                 # This file — AI context & technical memory
├── backend/
│   ├── Dockerfile                # Backend-only Docker (Render: Root Dir = backend)
│   ├── main.py                   # FastAPI app factory + CORS + startup
│   ├── auth.py                   # PBKDF2 + JWT utilities
│   ├── database.py               # SQLite WAL schema + seed data
│   ├── scheduler.py              # APScheduler background jobs
│   ├── ml/engine.py              # RandomForest + TF-IDF ML classes
│   ├── models/schemas.py         # Pydantic v2 models
│   ├── routers/                  # auth, crm, dashboard, ml, outreach, meetings, automation
│   ├── services/nim_client.py    # NVIDIA NIM async client + deterministic fallback
│   ├── services/whisper_service.py # Faster-Whisper singleton + FFmpeg converter
│   └── tests/test_engine.py      # 22 automated unit tests
├── frontend/
│   ├── vercel.json               # SPA rewrite: /* → /index.html
│   ├── vite.config.js            # Vite configuration
│   ├── src/api/client.js         # Axios singleton + JWT interceptor
│   ├── src/context/              # AuthContext + ThemeContext
│   ├── src/components/           # Navbar, Sidebar, SalesGenieLogo, TextToSpeechPlayer
│   └── src/pages/                # AuthPage, Dashboard, LeadIntelligence, DealPipeline,
│                                 # AIOutreach, MeetingIntelligence, Settings
└── screenshots/                  # High-res 2x Retina app screenshots (Puppeteer)
```

---

## 10. Quick Commands

```bash
# Start everything locally (recommended)
./start.sh

# Backend only
cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Frontend only
cd frontend && npm run dev

# Run test suite
pytest backend/tests/test_engine.py -v

# Capture fresh screenshots (both services must be running)
node capture_screenshots.js

# Build Docker container locally
docker build -t salesgenie-backend -f Dockerfile .
docker run -p 8000:8000 -e PORT=8000 salesgenie-backend

# Git push (handles non-fast-forward safely)
git stash && git pull --rebase origin main && git stash pop && git push origin main
```
