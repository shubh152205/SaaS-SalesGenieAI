# PRD — SaaS AI Powered Sales Intelligence Forecasting

**Document Status:** Final  
**Version:** 1.0.0  
**Domain:** B2B SaaS Revenue Operations  
**Owner:** Engineering / Product

---

## 1. Overview

SaaS AI Powered Sales Intelligence Forecasting is an **autonomous, full-stack B2B SaaS CRM and predictive revenue platform**. It is purpose-built to eliminate pipeline stalls, compress sales cycles from 42 days to under 28 days, and maximize conversion win rates across the entire revenue funnel — from initial lead qualification through discovery call intelligence to outreach orchestration and Kanban deal progression.

The platform unifies four previously siloed revenue operations functions:

| Function | Mechanism |
|:---|:---|
| **Lead Intent Scoring** | 120-estimator `RandomForestClassifier` evaluating engagement, funding stage, and technographic fit |
| **Deal Benchmarking** | TF-IDF + Cosine Similarity against historical Closed-Won $50k–$300k ARR enterprise contracts |
| **Call & Demo Intelligence** | Faster-Whisper INT8 STT with VAD, TextBlob sentiment, and autonomous action item extraction |
| **Agentic Outreach** | NVIDIA NIM `meta/llama-3.1-70b-instruct` generating cold emails, 48h cadences, and LinkedIn InMails |

---

## 2. Problem Statement

B2B SaaS sales teams waste an average of **40% of their time** on manually qualifying leads, re-reading call notes, and writing personalized outreach. The critical cost drivers are:

- **Lead Misclassification:** Reps subjectively evaluate leads without data, causing hot accounts to stall while cold accounts consume time.
- **Post-Call Latency:** Discovery calls go unprocessed; action items are forgotten within hours.
- **Generic Outreach:** One-size-fits-all email templates produce <2% reply rates vs. hyper-personalized outreach at 12–18%.
- **Pipeline Opacity:** Deals sit invisibly in stages with no urgency scoring or risk signals.

---

## 3. Target Users

| Persona | Role | Primary Need |
|:---|:---|:---|
| **CRO / VP Sales** | Executive | Real-time pipeline ARR view, win rate benchmarking, forecast accuracy |
| **Account Executive (AE)** | Revenue generator | ML intent scores, deal match recommendations, outreach drafts |
| **Sales Development Rep (SDR)** | Pipeline builder | Lead qualification, auto follow-up digests, call transcripts |
| **Sales Engineer** | Technical closer | Demo transcript action items, product adoption telemetry, technical fit analysis |

---

## 4. Core User Stories

### 4.1 Lead Scoring
- As an AE, I want to see an ML-generated intent score (0–100) for every lead so I can prioritize my day without gut-feel decisions.
- As an SDR, I want the system to surface "Hot Lead" (score ≥ 80) alerts so I can call within 5 minutes of trigger events.

### 4.2 Deal Pipeline
- As a CRO, I want a visual 5-stage Kanban board showing $ARR per stage so I can instantly identify where deals are stalling.
- As an AE, I want to drag deals between stages and see the pipeline ARR update in real-time.

### 4.3 Meeting Intelligence
- As an AE, I want to upload a demo call recording and receive a transcript, sentiment score, and 3–5 action items within 60 seconds.
- As a Sales Engineer, I want to record a discovery call live in the browser and have it auto-transcribed without manual export.

### 4.4 AI Outreach
- As an SDR, I want to click one button and receive a hyper-personalized cold email grounded in the prospect's funding stage, tech stack, and company size.
- As an AE, I want to generate a 48h follow-up email that references specific talking points from the previous discovery call.

### 4.5 Dashboard
- As a CRO, I want a 6-card executive KPI panel showing Active Pipeline ARR, Hot Lead Count, Win Rate, Average Deal Size (ACV), Response Time, and Sales Cycle Duration.
- As a VP Sales, I want AI-generated follow-up urgency rankings so I know which reps need to act today.

---

## 5. Functional Requirements

### FR-01: Authentication
- JWT HS256 stateless authentication with PBKDF2-HMAC-SHA256 password hashing.
- 1-click instant demo login (`demo@salesgenie.ai` / `password123`).
- Bearer token auto-injected by Axios interceptor across all API calls.

### FR-02: Lead Intelligence
- ML scoring using `RandomForestClassifier` (120 estimators) with feature inputs: email opens, website visits, demo requests, funding stage, company size, industry, days since last contact.
- Score range: 0–100. Recommendations: 🔥 Hot Lead (≥80), ✅ Qualified (≥60), 🌡️ Warm (≥40), ❄️ Cold (<40).
- TF-IDF Cosine Similarity match against historical Closed-Won SaaS contracts returning a similarity % and reference deal profiles.

### FR-03: Deal Pipeline
- 5-stage Kanban: New Lead → Qualified → Proposal → Negotiation → Closed Won.
- Drag-and-drop stage transitions using `@dnd-kit`.
- Per-stage ARR aggregation visible at all times.

### FR-04: Meeting Intelligence
- Audio upload accepting `.webm`, `.mp3`, `.m4a`, `.ogg`, `.wav`, `.flac`.
- FFmpeg auto-converts all formats to 16kHz mono PCM WAV before Faster-Whisper inference.
- Whisper parameters: `beam_size=3`, VAD filter enabled (`min_silence_duration_ms=500`), INT8 quantization on CPU.
- TextBlob polarity scoring outputting: Positive / Neutral / Negative + polarity value.
- NIM-generated action items with deterministic fallback.
- Live browser microphone recording via `MediaRecorder` API.

### FR-05: AI Outreach Engine
- Cold email generation grounded in: company name, funding round, industry, tech stack, company size, lead name.
- Follow-up cadence generation (48h and 72h variants) with call transcript context injection.
- LinkedIn InMail generation (exec-peer voice, <300 words).
- Outreach strategy recommendations by industry and lead profile.
- Zero-retention inference: no prompt data stored by NVIDIA NIM.
- Deterministic offline fallback engine when NIM API is unavailable.

### FR-06: Executive Dashboard & KPIs
- 6-card KPI suite with period filtering (Monthly / Quarterly / Yearly / All-Time).
- Funnel stage aggregation chart (New → Closed Won drop-off).
- Follow-up urgency triage panel with 🔴 Critical / 🟡 Moderate / 🟢 Healthy labels.
- ML metrics panel: model accuracy, feature importance rankings.
- APScheduler background automation: daily follow-up digest dispatch and automated model retraining.

### FR-07: Settings & Configuration
- ML hyperparameter display (feature weights, estimator count, training status).
- Whisper model selection (tiny, base, small, medium, large-v3).
- NVIDIA NIM API key status indicator.
- Theme toggle (Light / Dark mode persistent in localStorage).

---

## 6. Non-Functional Requirements

| Requirement | Target |
|:---|:---|
| **ML Inference Latency** | < 200ms for lead scoring per request |
| **Audio Transcription** | < 60s for a 5-minute call on CPU INT8 |
| **API Response Time** | < 500ms for all non-ML endpoints (p95) |
| **Frontend Bundle Size** | < 500KB gzipped |
| **Authentication** | Stateless JWT, no server-side session storage |
| **Security** | PBKDF2-HMAC-SHA256, no plaintext credentials in DB |
| **Accessibility** | WCAG 2.1 AA color contrast across Light and Dark themes |
| **Availability (Render Free)** | Cold start ≤ 30s; warm requests ≤ 500ms |
| **Database** | SQLite WAL mode with 7 B-Tree indexes for concurrent reads |

---

## 7. Out of Scope (v1.0)

- Real-time CRM sync (Salesforce, HubSpot) — planned for v2.
- Multi-user team collaboration and role-based access control.
- Email delivery infrastructure (SMTP sending) — outreach generation only.
- Native mobile app.
- Persistent vector store for embedding-based semantic search.
- LLM fine-tuning on proprietary deal data.

---

## 8. Success Metrics

| KPI | Target |
|:---|:---|
| ML Lead Score Accuracy | ≥ 85% on Closed-Won labeled training data |
| Demo → STT Transcription Accuracy | ≥ 90% WER on clean audio |
| Cold Email Generation Time | < 4s including NIM API round-trip |
| Automated Test Coverage | ≥ 22 passing pytest unit tests |
| Deal Conversion Rate Improvement | Benchmark: >15% uplift vs. manual-only workflows |

---

## 9. Constraints & Risks

| Risk | Mitigation |
|:---|:---|
| NIM API unavailability | Deterministic offline fallback engine provides full outreach generation |
| Render Free Tier cold starts (~30s) | Whisper model pre-cached in Docker layer; health check endpoint at `/` |
| SQLite concurrency under load | WAL mode + 7 indexes; horizontal scaling requires PostgreSQL migration |
| Large audio file processing timeout | 45s subprocess timeout on FFmpeg; client-side size validation |
| Whisper CPU inference memory on free tier | Default `base` model (~140MB RAM); `tiny` available via `WHISPER_MODEL_NAME=tiny` |
