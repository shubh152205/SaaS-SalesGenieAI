# Rules — SaaS AI Powered Sales Intelligence Forecasting

**Scope:** Engineering, AI, Design, and API conventions for all contributors.  
**Version:** 1.0.0

---

## 1. General Engineering Rules

### R-GEN-01: No Magic Numbers
All thresholds, timeouts, and limits must be defined as named constants or environment variables — never inline literals.

```python
# ❌ Bad
if score >= 80:

# ✅ Good
HOT_LEAD_THRESHOLD = 80
if score >= HOT_LEAD_THRESHOLD:
```

### R-GEN-02: Fail Gracefully with Deterministic Fallback
Every AI/ML call must have a documented fallback path. The platform must remain fully functional without NVIDIA NIM, Whisper, or an active ML model.

- NIM unavailable → `_deterministic_fallback()` in `nim_client.py`
- Whisper model failure → `_fallback_speech_recognition()` in `whisper_service.py`
- ML model untrained → return a neutral score (50) with a warning, not a 500 error

### R-GEN-03: Environment-Only Configuration
Never hardcode credentials, API keys, model names, or ports. All runtime configuration lives in `.env` (local) or platform environment variables (Render / Vercel).

```
# ✅ Backend .env
NVIDIA_API_KEY=nvapi-...
WHISPER_MODEL_NAME=base
PORT=8000
JWT_SECRET=your-secret-key

# ✅ Frontend .env
VITE_API_URL=http://localhost:8000
```

### R-GEN-04: Delete Temporary Files
Any file created during request processing (converted audio WAVs, temp uploads) must be deleted in a `finally` block after the operation completes.

### R-GEN-05: One Router Per Domain
Each functional domain has exactly one FastAPI router file. Do not put CRM logic in the ML router, or outreach logic in the meetings router.

| Domain | Router File |
|:---|:---|
| Authentication | `routers/auth.py` |
| CRM / Leads / Pipeline | `routers/crm.py` |
| ML Scoring | `routers/ml.py` |
| AI Outreach | `routers/outreach.py` |
| Meeting Intelligence | `routers/meetings.py` |
| Executive Dashboard | `routers/dashboard.py` |
| Background Automation | `routers/automation.py` |

---

## 2. API Design Rules

### R-API-01: Consistent URL Prefix
All backend endpoints use the `/api/<domain>/` prefix. No unversioned root endpoints except the health check at `GET /`.

```
GET  /                          → health check (no auth required)
GET  /docs                      → Swagger UI (development only)
POST /api/auth/login            ✅
POST /login                     ❌ — violates prefix rule
```

### R-API-02: HTTP Method Semantics
| Action | Method |
|:---|:---|
| Read (list or detail) | `GET` |
| Create | `POST` |
| Partial update | `PATCH` |
| Delete | `DELETE` |
| Trigger side-effect action | `POST` |

### R-API-03: Pydantic Validation on All Inputs
Every request body must be validated through a Pydantic v2 model defined in `models/schemas.py`. No raw `dict` bodies accepted directly.

### R-API-04: Structured Error Responses
All errors return a consistent JSON body:
```json
{
  "detail": "Human-readable error message"
}
```
Use `raise HTTPException(status_code=..., detail=...)` — never return raw error strings.

### R-API-05: CORS Origins Must Be Explicit in Production
The wildcard `"*"` in `allow_origins` is only acceptable during local development. In production, replace with exact Vercel domain URL. Update `FRONTEND_URL` env variable in Render to enforce this.

---

## 3. ML / AI Rules

### R-ML-01: Feature Column Contract
The `LeadScorer` must always use exactly these 7 feature columns in this order:
```python
FEATURE_COLS = [
    "email_opens",
    "website_visits",
    "demo_requested",
    "size_enc",
    "industry_enc",
    "funding_enc",
    "days_since_contact"
]
```
Adding or removing features without retraining the model will produce incorrect predictions.

### R-ML-02: Minimum Training Threshold
The ML model must not be trained on fewer than **5 labeled lead records**. Below this threshold, return an unscored state rather than a misleading prediction.

### R-ML-03: Score Clamping
All composite scores must be clamped to the range `[15.0, 99.0]`. Scores must never be exactly `0` or `100` — these are reserved for "untrained" and "perfect certainty" signals respectively.

### R-ML-04: NIM Prompt Safety
- Prompts sent to NVIDIA NIM must never include PII beyond the minimum required (name, company, industry).
- Never include full email addresses, phone numbers, or internal financial data in NIM prompts.
- System prompt must always include: `"Do not reference any sensitive or personal data beyond what is required for professional outreach."`

### R-ML-05: Whisper Model Singleton
The WhisperModel must be loaded exactly once via `get_whisper_model()` which uses a threading lock (`_model_lock`). Never instantiate `WhisperModel` directly in a route handler.

---

## 4. Database Rules

### R-DB-01: WAL Mode Required
SQLite must always be initialized with WAL mode:
```python
conn.execute("PRAGMA journal_mode=WAL")
conn.execute("PRAGMA synchronous=NORMAL")
```

### R-DB-02: Parameterized Queries Only
Never use string formatting or f-strings to build SQL queries. Use parameterized placeholders:
```python
# ❌ Bad
cur.execute(f"SELECT * FROM leads WHERE id = {lead_id}")

# ✅ Good
cur.execute("SELECT * FROM leads WHERE id = ?", (lead_id,))
```

### R-DB-03: Always Close Connections
Every `get_db()` call must have a corresponding `conn.close()` in the same scope or a `try/finally` block.

### R-DB-04: Row Factory
All database connections must use `conn.row_factory = sqlite3.Row` to enable named column access.

---

## 5. Frontend Rules

### R-FE-01: All API Calls via `client.js`
Never import `axios` directly in a component. All HTTP calls must go through `src/api/client.js` to ensure consistent base URL resolution, JWT injection, and timeout enforcement.

### R-FE-02: No Hardcoded URLs
API base URL comes exclusively from `import.meta.env.VITE_API_URL`. Never hardcode `localhost:8000` in a component.

### R-FE-03: Theme via Context
Theme state (dark/light) must be read and written exclusively through `ThemeContext`. Never directly manipulate `document.documentElement.classList` or `localStorage['tailadmin-theme']` outside the context.

### R-FE-04: Loading and Error States
Every component that fetches data must implement:
1. A `loading` state with a spinner or skeleton
2. An `error` state with a dismissible alert
3. Never show an empty page silently

### R-FE-05: Audio Cleanup
All `MediaRecorder` and `AudioContext` instances in `MeetingIntelligence.jsx` must be stopped and nulled in a `useEffect` cleanup function to prevent memory leaks across route navigations.

---

## 6. Design System Rules

### R-DS-01: Color Token Usage
Never use hex color literals directly in component CSS. Use the defined CSS custom property tokens:
```css
/* ✅ Use tokens */
color: var(--text-primary);
background: var(--brand-primary);

/* ❌ Never inline */
color: #101828;
background: #465fff;
```

### R-DS-02: Typography Scale
| Usage | Font | Weight | Size |
|:---|:---|:---|:---|
| Page heading | Outfit | 700 | 1.75rem |
| Section heading | Outfit | 600 | 1.25rem |
| Body text | Outfit | 400 | 0.875rem |
| Data / Metrics | JetBrains Mono | 600 | 1rem+ |
| Badges / Labels | Outfit | 600 | 0.75rem |

### R-DS-03: Score Color Semantics
| Score Range | Color Token | Badge Label |
|:---|:---|:---|
| ≥ 80 | `--hot-lead-red` (`#f04438`) | 🔥 Hot Lead |
| ≥ 60 | `--qualified-cyan` (`#0ba5ec`) | ✅ Qualified |
| ≥ 40 | `--warm-amber` (`#f79009`) | 🌡️ Warm Lead |
| < 40 | `--cold-gray` (`#98a2b3`) | ❄️ Cold Lead |

### R-DS-04: Consistent Corner Radius
| Element | Radius |
|:---|:---|
| Buttons & Inputs | `8px` |
| Cards & Modals | `16px` |
| Outer containers | `20px` |
| Pills & Badges | `9999px` |

---

## 7. Security Rules

### R-SEC-01: Passwords Never Stored in Plain Text
Passwords are always stored as PBKDF2-HMAC-SHA256 hashes with a random 32-byte salt. The `auth.py` `hash_password()` function is the only valid password storage mechanism.

### R-SEC-02: JWT Secret via Environment
`JWT_SECRET` must never be committed to version control. Always loaded from `.env` / Render environment variable.

### R-SEC-03: File Upload Validation
Audio uploads must be validated for:
- File extension (`.webm`, `.mp3`, `.m4a`, `.ogg`, `.wav`, `.flac` only)
- File size (reject files > 50MB before processing)
- MIME type header

### R-SEC-04: No `.env` in Version Control
The `.gitignore` must always exclude:
```
.env
.env.local
.env.*.local
salesgenie.db
*.db
```

---

## 8. Testing Rules

### R-TEST-01: 22 Tests Minimum
The automated test suite must always maintain at least 22 passing tests. New features require corresponding tests before merge.

### R-TEST-02: Test Categories Required
Every PR touching an ML feature must include tests for:
- Score boundary conditions (min/max clamp)
- Recommendation badge assignment
- Fallback behavior when model is untrained

### R-TEST-03: Run Tests Before Push
```bash
pytest backend/tests/test_engine.py -v
# Must show: 22 passed
```
