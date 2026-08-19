# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Primary Audience:** B2B SaaS Sales Leaders (CRO, VP of Sales), Account Executives (AEs), and Sales Development Representatives (SDRs) operating in high-velocity SaaS environments.
- **Core Job:** Accelerating product-led growth (PLG) and enterprise sales velocity by converting trial signups into high-ACV ($50k–$300k ARR) annual enterprise contracts, qualifying leads with sub-15ms ML intent inference, deriving actionable intelligence from demo calls, and orchestrating targeted outbound follow-ups.

## Product Purpose
SaaS SalesGenie AI is an autonomous, full-stack B2B SaaS CRM and predictive lead intelligence platform designed to eliminate pipeline stalls, shorten sales cycles from 42 days to under 28 days, and maximize conversion win rates across the entire revenue funnel.

## Positioning
An all-in-one SaaS-native revenue engine combining 100-tree Random Forest lead intent scoring, TF-IDF cosine similarity deal benchmarking against historical Closed-Won enterprise contracts, real-time speech-to-text call demo intelligence with sentiment polarity, and zero-retention agentic NVIDIA NIM (Llama 3.1 70B) outreach synthesis.

## Operating Context
- Fast-paced sales desk and revenue operations workflows evaluating inbound leads, managing active deal pipelines, and conducting technical demo discovery calls.
- High-velocity follow-up cadence requirements (triage of critical 48–72h follow-ups).
- Integration points and technographic stack evaluations (evaluating prospects against tools like Snowflake, Datadog, Stripe, AWS, React, Python).
- Web application interface used across desktop monitors and laptop viewports in both Light and Dark lighting environments.

## Capabilities and Constraints
- **Machine Learning Lead Scoring:** Scikit-Learn `RandomForestClassifier` (100 estimators) evaluating demo requests, company funding rounds, website/product telemetry, email opens, and technographic fit.
- **Deal Benchmarking:** TF-IDF Vectorizer + Cosine Similarity matching incoming accounts against historical high-value Closed-Won contracts ($50k–$300k ARR).
- **Demo Meeting Intelligence:** Audio parser (handling `.wav`, `.mp3`, `.webm`, `.m4a`), TextBlob NLP sentiment analysis, and automated extraction of sales engineering action items.
- **Agentic NVIDIA NIM Outreach:** Asynchronous generation of personalized cold emails, 48h follow-up cadences, and LinkedIn InMails via `meta/llama-3.1-70b-instruct` with deterministic offline fallback.
- **Kanban Deal Pipeline & Executive KPIs:** 5-stage Kanban board (`New Lead` -> `Qualified` -> `Proposal` -> `Negotiation` -> `Closed Won`), 6-card KPI executive overview, and urgency triage.
- **Architecture & Tech Constraints:** React 18 + Vite frontend with Tailwind/TailAdmin theme system, FastAPI async REST backend, SQLite with WAL mode and 7 B-Tree indexes, JWT authentication.

## Brand Commitments
- **Name:** SaaS SalesGenie AI
- **Voice:** Professional, enterprise-grade, data-driven, assertive yet approachable B2B SaaS revenue copilot.
- **Visual Foundation:** TailAdmin design system foundation supporting high-contrast Light and Dark modes.

## Evidence on Hand
- Full-stack codebase with 60+ pre-seeded enterprise SaaS accounts in SQLite database (`salesgenie.db`).
- 22 automated Pytest unit tests verifying ML models, recommendation engines, and fallback behavior.
- High-resolution UI screenshots in `screenshots/` directory covering KPIs, Kanban pipeline, lead scoring, outreach, and meeting intelligence.
- 12-slide executive slide deck (`SalesGenie_AI_Final_Presentation.pdf` / `.pptx`).

## Product Principles
1. **Sub-Second Intent & Actionability:** Deliver instant ML predictions and prescriptive next actions rather than raw, uninterpreted metrics.
2. **Zero-Friction Deal Velocity:** Eliminate manual data entry and sales prep through automated meeting transcription and dynamic outreach generation.
3. **Enterprise Trust & Privacy:** Ensure zero-retention AI inference, deterministic offline fallbacks, and secure role/token management.
4. **Context-Rich Personalization:** Ground every outreach and deal recommendation in actual technographic stack fit and historical contract precedent.

## Accessibility & Inclusion
- Full keyboard navigation for Kanban stages and lead tables.
- High color contrast ratios compliant with WCAG 2.1 AA across both Light and Dark themes.
- Clear visual hierarchy with semantic HTML structure and descriptive ARIA labels for audio capture and data charts.
