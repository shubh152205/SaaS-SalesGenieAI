# 🧞‍♂️ SalesGenie AI — B2B SaaS Sales Intelligence Platform

> **An intelligent, full-stack B2B SaaS CRM, Machine Learning Lead Scoring Engine, and Agentic Outreach Platform powered by FastAPI, SQLite, Scikit-Learn, React/Vite, and NVIDIA NIM LLMs.**

---

## 🌟 Key Architecture & Capabilities

### 1. 📊 Executive Sales Dashboard & KPIs (Milestone 4 Enhanced)
- **6-Card Executive KPI Suite**:
  - **Pipeline Value**: Real-time aggregation of active deals ($2.4M+).
  - **Hot Leads**: Instant count and filtering of high-intent accounts (Score ≥ 80).
  - **Conversion Rate**: Won vs. Lost win rate percentage.
  - **Average Deal Size**: Dynamic computation across enterprise segments.
  - **Avg Response Time**: Real-time tracking of sales response velocity (2.4h).
  - **Avg Sales Cycle**: Average deal velocity in days (28 days).
- **Timeframe Filtering**: Real-time filtering across Monthly, Quarterly, and Yearly periods with cached analytics.
- **AI Follow-up Priority Panel**: Prescriptive urgency ranking (🔴 Critical, 🟡 Moderate, 🟢 Healthy) based on engagement recency.
- **Automation Module**: Background task monitor and manual triggers for Daily Follow-up Email Digests and ML Retraining.
- **Interactive Recharts Analytics**: Revenue trend area charts, deal size distribution bars, and sales stage funnels.

### 2. 🎯 Machine Learning Lead Scoring Engine (`RandomForestClassifier`)
- **100 Decision Estimators** trained on high-intent conversion signals:
  - **Demo Requests** (Intent Weight: 25)
  - **Company Growth & Funding Rounds** (Series A-D, Public)
  - **Website Visits & Frequency** (Weight: 18)
  - **Email Opens & Engagement** (Weight: 15)
  - **Technographic Alignment** with SalesGenie platform capabilities (Python, FastAPI, AWS, Snowflake, React, etc.)
  - **Recency of Engagement & Days Since Last Contact**
- **Actionable Output**: Instant scoring (0–100), probability percentages, recommendation badges (🔥 Hot Lead, ✅ Qualified, 🌡️ Warm, ❄️ Cold), and prescriptive next-step actions.

### 3. 🔍 Deal Benchmarking & Cosine Similarity Matching
- **TF-IDF Vectorizer + `linear_kernel` Cosine Similarity**: Compares incoming accounts against historical Closed Won enterprise deals to calculate similarity percentages.

### 4. 🤖 Agentic AI Outreach Engine (NVIDIA NIM)
- **Primary LLM**: `meta/llama-3.1-70b-instruct` (NVIDIA NIM integration).
- **Backup LLM**: `meta/llama-3.1-8b-instruct` + deterministic B2B SaaS rule-based generation.
- **Tailored Cadences**:
  - **AI Cold Emails**: Personalized funding round congratulatory hooks, explicit tech stack alignment, and 65% efficiency reduction metrics.
  - **Follow-up Cadences**: High-velocity 48-72h value-driven follow-ups.
  - **LinkedIn InMail**: High-converting peer-to-peer executive connection notes.
  - **Industry Strategy Generator**: Channel mix, timing, and tailored case study recommendations.

### 5. 🎙️ Meeting & Call Intelligence
- **Audio File Upload & Live Microphone Recording**: Handles `.wav`, `.mp3`, `.webm`, and `.m4a` files.
- **AI Call Summarization & Action Item Extraction**: Automatically extracts 3-5 concrete next steps for sales engineering teams.
- **TextBlob Sentiment Analysis**: Calculates polarity scores and classifies sentiment into Positive, Neutral, or Negative.

### 6. 📋 5-Stage Kanban Deal Pipeline
- Visual pipeline stages: `New Lead` ➔ `Qualified` ➔ `Proposal` ➔ `Negotiation` ➔ `Closed Won`.
- Quick-action stage progression and deal value aggregations.

### 7. 🧪 Comprehensive Test Suite (22 Unit Tests)
- `tests/test_engine.py` covering:
  - Follow-up Recommendation boundary conditions & urgency classification
  - RandomForest scoring range, feature importance, and conversion probability
  - Data validation and JSON tech stack parsing
  - Automation module classification and prioritization

### 8. 🔐 Enterprise Authentication & Security
- **Stateless JWT (HS256)** authentication.
- **PBKDF2-HMAC-SHA256** password hashing with cryptographically secure random salts.
- **1-Click Instant Demo Login** for evaluation (`demo@salesgenie.ai` / `password123`).
- **Optimized SQLite Schema**: WAL mode with 7 performance indexes.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, React Router, Recharts, Lucide Icons | TailAdmin dark/light responsive UI with micro-animations |
| **Backend** | FastAPI (Python 3.11+) | Asynchronous, typed RESTful API |
| **Authentication** | PyJWT (HS256) + PBKDF2-HMAC | Secure stateless auth & token headers |
| **Database** | SQLite Relational (WAL Mode) | 60+ B2B SaaS accounts with 7 performance indexes |
| **ML Lead Scoring** | Scikit-Learn `RandomForestClassifier` | 100-tree conversion prediction & factor scoring |
| **Deal Matcher** | Scikit-Learn `TfidfVectorizer` + Cosine Similarity | Closed won benchmark matching |
| **AI LLMs** | NVIDIA NIM API (`meta/llama-3.1-70b-instruct`) | Asynchronous B2B cold email & meeting intelligence |
| **Sentiment Analysis**| TextBlob | Polarity calculation for discovery calls |
| **Automated Testing** | Pytest (22 Unit Tests) | 100% pass rate on ML & recommendation engines |

---

## 🚀 Quick Start Guide

### Step 1: Run with One-Click Script
```bash
./start.sh
```
*Frontend opens on `http://localhost:5173`*  
*FastAPI Interactive Docs on `http://localhost:8000/docs`*

---

### Step 2: Manual Start (Optional)

#### Backend:
```bash
cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend:
```bash
cd frontend
npm run dev
```

---

## 🔑 Demo Access Credentials
- **Email:** `demo@salesgenie.ai`
- **Password:** `password123`
- *(Or click "⚡ 1-Click Instant Demo Login" on the Auth screen)*

---

## 📁 Repository Structure
```
salesgenie/
├── backend/
│   ├── auth.py              # PBKDF2 hashing & PyJWT token utilities
│   ├── database.py          # SQLite database schema & 50+ B2B SaaS seed records
│   ├── main.py              # FastAPI application with CORS & router registry
│   ├── requirements.txt     # Backend Python dependencies
│   ├── ml/
│   │   └── engine.py        # RandomForestClassifier & TF-IDF Cosine Similarity
│   ├── models/
│   │   └── schemas.py       # Pydantic v2 validation models
│   ├── routers/
│   │   ├── auth.py          # /api/auth/register, /login, /me
│   │   ├── crm.py           # /api/crm/leads, decision maker ID & tech alignment
│   │   ├── dashboard.py     # /api/dashboard/kpis, funnel, activity
│   │   ├── meetings.py      # /api/meetings/upload-audio, transcript analysis
│   │   ├── ml.py            # /api/ml/score, similar-deals
│   │   └── outreach.py      # /api/outreach/generate-email, followup, linkedin
│   └── services/
│       └── nim_client.py    # Async NVIDIA NIM Llama 3.1 70B & fallback client
├── frontend/
│   ├── src/
│   │   ├── api/client.js    # Axios instance with Bearer token interceptor
│   │   ├── components/      # Navbar & Glass Sidebar navigation
│   │   ├── context/         # AuthContext state provider
│   │   ├── pages/
│   │   │   ├── AIOutreach.jsx         # NIM-powered email, follow-up & LinkedIn generator
│   │   │   ├── AuthPage.jsx           # Dark glassmorphic login/register
│   │   │   ├── Dashboard.jsx          # Executive KPI cards & Recharts funnel
│   │   │   ├── DealPipeline.jsx       # 5-Stage Kanban board
│   │   │   ├── LeadIntelligence.jsx   # Directory, profile, ML score & similar deals
│   │   │   ├── MeetingIntelligence.jsx# Audio upload, live recording & sentiment
│   │   │   └── Settings.jsx           # Model hyperparameters & platform specs
│   │   └── styles/
│   │       └── index.css              # Custom Glassmorphism design tokens
└── start.sh                 # Unified launch script
```
