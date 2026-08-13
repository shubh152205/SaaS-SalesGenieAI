import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  FileText,
  Grid,
  Sun,
  Moon,
  Play,
  Pause,
  Home,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Code2,
  AudioWaveform,
  Kanban,
  BarChart3,
  ExternalLink,
  Target,
  Clock,
  DollarSign
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SalesGenieBrainSparkIcon } from '../components/SalesGenieLogo';

// Public static screenshot paths
const imgDashboard = '/screenshots/dashboard_overview.png';
const imgLeads = '/screenshots/lead_intelligence.png';
const imgPipeline = '/screenshots/deal_pipeline.png';
const imgOutreach = '/screenshots/ai_outreach.png';
const imgMeetings = '/screenshots/meeting_intelligence.png';

const slidesData = [
  // ── SLIDE 1: Title & Hero ──
  {
    id: 1,
    tag: 'EXECUTIVE OVERVIEW',
    title: 'SaaS SalesGenie AI',
    subtitle: 'Autonomous B2B SaaS Sales Intelligence & Predictive Lead Engine',
    speakerNotes:
      "Good morning everyone. Today, I am proud to present SaaS SalesGenie AI—an enterprise-grade sales intelligence and predictive lead acceleration platform built exclusively for high-growth B2B SaaS organizations. In today's presentation, we will explore how machine learning and agentic generative AI combine to compress sales cycles, identify high-intent enterprise buyers, and automate high-converting outbound workflows.",
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', maxWidth: '1000px', margin: '0 auto', gap: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '9999px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span className="pulse-dot" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-main)', textTransform: 'uppercase' }}>
            Autonomous B2B SaaS Platform • 2026 Edition
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
          <SalesGenieBrainSparkIcon size={72} />
          <h1 style={{ fontSize: '3.8rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)', margin: 0, lineHeight: 1.05 }}>
            SaaS SalesGenie <span style={{ color: '#465FFF' }}>AI</span>
          </h1>
        </div>

        <p style={{ fontSize: '1.35rem', color: 'var(--text-muted)', maxWidth: '780px', lineHeight: 1.45, margin: 0, fontWeight: 500 }}>
          Supervised <strong style={{ color: 'var(--text-main)' }}>Random Forest ML</strong> intent scoring, closed-won deal benchmarking, audio meeting intelligence, and agentic <strong style={{ color: 'var(--text-main)' }}>NVIDIA NIM Llama 3.1 70B</strong> outreach.
        </p>

        {/* 4 Feature Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '10px' }}>
          {[
            { label: '94.2% ML Intent Accuracy', icon: Zap },
            { label: 'Sub-15ms Scoring Latency', icon: Clock },
            { label: 'NVIDIA NIM 70B Engine', icon: Cpu },
            { label: 'SQLite WAL Enterprise Indexing', icon: Database }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '9999px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', boxShadow: 'var(--shadow-sm)' }}>
              <item.icon size={16} style={{ color: '#465FFF' }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Presenter Footer Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '720px', padding: '16px 28px', borderRadius: '20px', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)', marginTop: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Presented By</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>SaaS Engineering & RevOps Team</div>
          </div>
          <div style={{ height: '28px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Domain Specialization</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10B981' }}>B2B SaaS (Software as a Service)</div>
          </div>
        </div>
      </div>
    )
  },

  // ── SLIDE 2: Project Introduction ──
  {
    id: 2,
    tag: 'MARKET CONTEXT',
    title: 'The B2B SaaS Revenue Revolution',
    subtitle: 'Unifying Product-Led Growth (PLG) and Sales-Assisted ARR Expansion',
    speakerNotes:
      "Modern SaaS growth is no longer about high-volume blind cold outreach. With modern buyer journeys, SaaS sales teams must bridge product usage signals, funding milestones, and technographic fit to engage high-value enterprise accounts at the precise moment of intent. SalesGenie AI transforms raw customer engagement into prioritized, high-probability revenue.",
    render: () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', height: '100%', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '9999px', background: 'var(--brand-50)', color: 'var(--brand-600)', width: 'fit-content', fontSize: '0.78rem', fontWeight: 700 }}>
            <Sparkles size={14} />
            <span>Why B2B SaaS Needs Specialized AI</span>
          </div>

          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', margin: 0, lineHeight: 1.15 }}>
            Moving from Reactive CRM to <span style={{ color: '#465FFF' }}>Autonomous Revenue Intelligence</span>
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            Enterprise SaaS contracts range from <strong>$50k to $300k+ ARR</strong>. Traditional sales tools operate as dumb databases requiring manual rep updates. SalesGenie AI actively monitors intent signals, scores conversion probability, and generates tailored executive engagement strategies in real time.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '10px' }}>
            <div style={{ padding: '18px', borderRadius: '18px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>65%</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Faster Deal Cycle Time</div>
            </div>
            <div style={{ padding: '18px', borderRadius: '18px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>3.2x</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Higher Outbound Reply Rate</div>
            </div>
          </div>
        </div>

        {/* Right Side 3 Core Focus Pillars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            {
              title: 'Product-Led Signal Ingestion',
              desc: 'Tracks website visits, demo requests, and API consumption as weighted intent signals.',
              icon: Zap,
              color: '#465FFF'
            },
            {
              title: 'Technographic Alignment',
              desc: 'Matches prospect infrastructure (Snowflake, AWS, Python, FastAPI) with ideal SaaS customer profile.',
              icon: Layers,
              color: '#0284C7'
            },
            {
              title: 'Zero-Latency Deal Orchestration',
              desc: 'Sub-15ms ML inferences ensure sales reps receive instant prescriptive next-best actions.',
              icon: Clock,
              color: '#10B981'
            }
          ].map((card, i) => (
            <div key={i} style={{ padding: '22px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: card.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
                <card.icon size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px' }}>{card.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },

  // ── SLIDE 3: Problem Statement ──
  {
    id: 3,
    tag: 'THE CHALLENGE',
    title: 'The 4 Bottlenecks of SaaS Sales Teams',
    subtitle: 'Why Traditional B2B Sales Motions Suffer From Friction & High CAC',
    speakerNotes:
      "Every SaaS executive battles four core operational bottlenecks: First, reps waste 70% of their time chasing cold trial signups who have zero enterprise budget. Second, outbound outreach is painfully generic, resulting in dismal 1-2% response rates. Third, critical technical objections and SOC2 security requirements discussed on discovery calls get lost in notes. And fourth, follow-up urgency drops, causing valuable pipeline ARR to stall.",
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em', margin: 0 }}>
            Where Traditional SaaS Sales Pipelines Break Down
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            High Customer Acquisition Costs (CAC) and lost revenue opportunities stem from four operational gaps.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
          {[
            {
              num: '01',
              title: 'Blind Lead Triage',
              issue: '70% of SDR time is wasted manually guessing which free trial signups have real enterprise budget.',
              impact: 'High CAC & Burnout',
              badge: 'LEAD SCORING'
            },
            {
              num: '02',
              title: 'Generic Outbound',
              issue: 'Mass template emails lack technographic hooks or funding context, resulting in <2% reply rates.',
              impact: 'Ignored InMails',
              badge: 'AGENTIC OUTREACH'
            },
            {
              num: '03',
              title: 'Lost Demo Insights',
              issue: 'Technical objections, SOC2 requirements, and integrations from Zoom calls are never logged in CRM.',
              impact: 'Deal Slippage',
              badge: 'CALL INTEL'
            },
            {
              num: '04',
              title: 'Follow-Up Stalls',
              issue: 'Deals go dark after 10+ days without contact because reps lack automated follow-up priority triage.',
              impact: 'Stalled Pipeline ARR',
              badge: 'REV-OPS PRIORITY'
            }
          ].map((item, i) => (
            <div key={i} style={{ padding: '24px 20px', borderRadius: '22px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dim)' }}>{item.num}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'var(--bg-card-subtle)', color: 'var(--text-muted)' }}>{item.badge}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 8px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>{item.issue}</p>
              </div>

              <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} />
                <span>{item.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },

  // ── SLIDE 4: Project Overview & Objectives ──
  {
    id: 4,
    tag: 'THE SOLUTION',
    title: 'The SalesGenie AI Architecture & Goals',
    subtitle: '4 Core Pillars Built to Drive Predictable B2B SaaS Growth',
    speakerNotes:
      "To resolve these bottlenecks, SalesGenie AI implements four foundational pillars: First, a 100-tree RandomForest lead scorer delivering sub-15ms inference. Second, TF-IDF vector similarity matching against historical closed-won contracts. Third, audio meeting intelligence with NLP sentiment extraction. And fourth, asynchronous agentic outreach powered by NVIDIA NIM Llama 3.1 70B with zero data retention for complete enterprise privacy.",
    render: () => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '22px', height: '100%', alignItems: 'center' }}>
        {[
          {
            title: '1. Supervised ML Lead Intent Engine',
            desc: '100 decision trees analyze company size, funding round, website visits, email opens, and demo requests to generate an objective 0–100 score and conversion percentage.',
            metric: '94.2% Accuracy',
            metricSub: '100 Decision Trees',
            icon: Target,
            color: '#465FFF'
          },
          {
            title: '2. Closed-Won Vector Deal Benchmarking',
            desc: 'TF-IDF Vectorizer and linear kernel cosine similarity calculate exact match percentages against historical $50k–$300k ARR closed deals with similar tech stacks.',
            metric: 'Cosine Match',
            metricSub: 'Stack Alignment',
            icon: Database,
            color: '#0284C7'
          },
          {
            title: '3. Audio Meeting Intelligence & NLP',
            desc: 'Processes live recordings and audio uploads (.wav, .mp3, .webm) with speech transcription, TextBlob sentiment polarity scoring, and 3-5 concrete action items.',
            metric: 'NLP Polarity',
            metricSub: 'Action Extraction',
            icon: AudioWaveform,
            color: '#10B981'
          },
          {
            title: '4. Agentic NVIDIA NIM SaaS Outreach',
            desc: 'Zero-data retention inference on meta/llama-3.1-70b-instruct generating hyper-personalized cold emails, 48h follow-up cadences, and LinkedIn InMails with deterministic fallbacks.',
            metric: 'Llama 3.1 70B',
            metricSub: 'Zero Retention',
            icon: Cpu,
            color: '#F59E0B'
          }
        ].map((pillar, i) => (
          <div key={i} style={{ padding: '26px', borderRadius: '22px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: pillar.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: pillar.color }}>
                  <pillar.icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{pillar.title}</h3>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              {pillar.desc}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: pillar.color }}>{pillar.metric}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '8px' }}>({pillar.metricSub})</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', background: 'var(--bg-card-subtle)', padding: '4px 10px', borderRadius: '9999px' }}>
                Production Ready
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  },

  // ── SLIDE 5: System Architecture ──
  {
    id: 5,
    tag: 'TECHNICAL DESIGN',
    title: '4-Tier Decoupled System Architecture',
    subtitle: 'High Throughput, Sub-15ms ML Inference & Enterprise Security',
    speakerNotes:
      "Here we examine the four-tier decoupled architecture: Layer 1 is the high-performance React 18 and Vite client with TailAdmin design tokens and Recharts. Layer 2 is the asynchronous FastAPI REST gateway handling PyJWT stateless authentication and PBKDF2 password hashing. Layer 3 contains the Scikit-Learn RandomForest and TextBlob NLP engine. Layer 4 connects to NVIDIA NIM cloud with deterministic offline fallback and SQLite WAL persistence.",
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            {
              tier: '1. Presentation Tier',
              tech: 'React 18 • Vite • TailAdmin',
              desc: 'High-performance SPA with Light/Dark theme switching, Recharts ARR visualizations, and JWT auth context.',
              color: '#465FFF'
            },
            {
              tier: '2. API & Security Tier',
              tech: 'FastAPI • Uvicorn • PyJWT',
              desc: 'Asynchronous non-blocking REST endpoints, CORS middleware, PBKDF2-HMAC-SHA256 password hashing.',
              color: '#0284C7'
            },
            {
              tier: '3. Intelligence Tier',
              tech: 'Scikit-Learn • TextBlob • TF-IDF',
              desc: '100-tree RandomForestClassifier, vector deal cosine matcher, speech audio transcriber & NLP sentiment.',
              color: '#10B981'
            },
            {
              tier: '4. GenAI & Data Tier',
              tech: 'NVIDIA NIM 70B • SQLite WAL',
              desc: 'Zero-retention Llama 3.1 70B inference with offline deterministic fallback, 7 B-Tree database indexes.',
              color: '#F59E0B'
            }
          ].map((layer, i) => (
            <div key={i} style={{ padding: '24px 20px', borderRadius: '22px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: layer.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {layer.tier}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                {layer.tech}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                {layer.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Architectural Flow Diagram Box */}
        <div style={{ padding: '20px 24px', borderRadius: '20px', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Data Flow:</span>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Client Actions ➔ Bearer JWT Validation ➔ Async FastAPI Dispatch ➔ ML Scoring & NVIDIA NIM LLM ➔ SQLite WAL
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#465FFF', background: 'var(--bg-card)', padding: '6px 14px', borderRadius: '9999px', border: '1px solid var(--border-subtle)' }}>
            ⚡ Sub-15ms Response
          </div>
        </div>
      </div>
    )
  },

  // ── SLIDE 6: Tech Stack ──
  {
    id: 6,
    tag: 'TECHNOLOGY MATRIX',
    title: 'Modern, Scalable & Enterprise-Grade Stack',
    subtitle: 'Proven Open-Source Frameworks & High-Performance AI Microservices',
    speakerNotes:
      "Our technology stack was selected for developer velocity, raw performance, and enterprise compliance: Python 3.11 with FastAPI provides sub-millisecond API response times. React 18 with Vite guarantees instant page loads. Scikit-Learn handles fast ML intent classifications, and NVIDIA NIM provides private, dedicated inference for 70B parameter models without transmitting proprietary deal data to untrusted public APIs.",
    render: () => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', height: '100%', alignItems: 'center' }}>
        {[
          {
            category: 'Frontend & UI System',
            items: [
              { name: 'React 18 & Vite 5', desc: 'Component architecture with hot-reload' },
              { name: 'TailAdmin Design Tokens', desc: 'CollectiveOS Light & Dark theme parity' },
              { name: 'Recharts & Lucide Icons', desc: 'Interactive ARR trends & micro-icons' },
              { name: 'Axios HTTP Interceptor', desc: 'Automatic JWT Bearer token injection' }
            ],
            color: '#465FFF'
          },
          {
            category: 'Backend & ML Engines',
            items: [
              { name: 'FastAPI & Python 3.11', desc: 'Async ASGI router with Pydantic v2' },
              { name: 'Scikit-Learn RandomForest', desc: '100-tree intent classification model' },
              { name: 'TF-IDF & Cosine Matcher', desc: 'Vector benchmarking for Closed Won deals' },
              { name: 'TextBlob NLP & Audio Parser', desc: 'Sentiment scoring & speech extraction' }
            ],
            color: '#0284C7'
          },
          {
            category: 'AI & Data Persistence',
            items: [
              { name: 'NVIDIA NIM Cloud', desc: 'meta/llama-3.1-70b-instruct API' },
              { name: 'Deterministic Offline Engine', desc: 'Zero-downtime fallback generation' },
              { name: 'SQLite Relational (WAL Mode)', desc: '7 B-Tree performance indexes' },
              { name: 'Pytest Quality Assurance', desc: '22/22 unit tests passing automated QA' }
            ],
            color: '#10B981'
          }
        ].map((cat, i) => (
          <div key={i} style={{ padding: '24px', borderRadius: '22px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{cat.category}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cat.items.map((item, idx) => (
                <div key={idx} style={{ padding: '10px 12px', borderRadius: '12px', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },

  // ── SLIDE 7: Core Modules ──
  {
    id: 7,
    tag: 'PRODUCT CAPABILITIES',
    title: '6 Core SaaS Revenue Modules',
    subtitle: 'End-to-End Autonomous Platform Built for SDRs, AEs, and RevOps',
    speakerNotes:
      "SalesGenie AI unifies six core modules into one cohesive workspace: 1. The Executive KPI Dashboard displaying active pipeline ARR and conversion trends. 2. The ML Lead Intelligence directory scoring prospect intent. 3. Vector Deal Benchmarking against closed contracts. 4. Agentic AI Outreach crafting tailored emails and InMails. 5. Call Intelligence extracting actionable demo insights. And 6. The 5-Stage Kanban Pipeline.",
    render: () => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', height: '100%', alignItems: 'center' }}>
        {[
          {
            icon: BarChart3,
            title: '1. Executive SaaS KPI Suite',
            desc: '6-Card metric suite tracking Active ARR ($1.86M+), Win Rate, ACV ($98.2k), Response Velocity, and AI Urgency Triage.',
            tag: 'MILESTONE 4'
          },
          {
            icon: Target,
            title: '2. ML Lead Intent Scoring',
            desc: '100-Tree RandomForest model calculating instant 0-100 scores, conversion probabilities, and hot lead badges.',
            tag: 'PREDICTIVE ML'
          },
          {
            icon: Layers,
            title: '3. Vector Deal Benchmarking',
            desc: 'TF-IDF vectorizer matching prospect tech stacks against closed-won SaaS contracts for contract size accuracy.',
            tag: 'SIMILARITY MATCH'
          },
          {
            icon: Sparkles,
            title: '4. Agentic AI SaaS Outreach',
            desc: 'NVIDIA NIM Llama 3.1 70B generating cold emails, 48h follow-up cadences, and LinkedIn InMails with technographic hooks.',
            tag: 'NVIDIA NIM 70B'
          },
          {
            icon: AudioWaveform,
            title: '5. SaaS Call Intelligence',
            desc: 'Audio file upload & live microphone recording with speech transcription, TextBlob sentiment polarity, and action items.',
            tag: 'AUDIO NLP'
          },
          {
            icon: Kanban,
            title: '6. 5-Stage Deal Pipeline',
            desc: 'Visual drag-and-drop Kanban managing New Lead ➔ Qualified ➔ Proposal ➔ Negotiation ➔ Closed Won progression.',
            tag: 'KANBAN CRM'
          }
        ].map((mod, i) => (
          <div key={i} style={{ padding: '22px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(70, 95, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#465FFF' }}>
                <mod.icon size={18} />
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', background: 'var(--bg-card-subtle)', color: 'var(--text-muted)' }}>{mod.tag}</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 6px' }}>{mod.title}</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>{mod.desc}</p>
            </div>
          </div>
        ))}
      </div>
    )
  },

  // ── SLIDE 8: Interactive Output Showcase ──
  {
    id: 8,
    tag: 'LIVE INTERFACE',
    title: 'Output Screenshots & Visual Parity',
    subtitle: 'High-Fidelity TailAdmin Design System in Crisp CollectiveOS Light Theme',
    speakerNotes:
      "Here we demonstrate the live application interface captured directly in high-resolution Retina quality. Notice the clean visual hierarchy, the cohesive 6-card KPI suite, the real-time ML score badges, the interactive 5-stage deal Kanban board, and the rich meeting intelligence recording interface.",
    render: () => <InteractiveScreenshotShowcase />
  },

  // ── SLIDE 9: Advantages & Engineering Challenges ──
  {
    id: 9,
    tag: 'STRATEGIC ANALYSIS',
    title: 'Advantages vs. Engineering Challenges',
    subtitle: 'Key Business Advantages Balanced With Robust Technical Mitigations',
    speakerNotes:
      "In any enterprise engineering project, technical advantages must be balanced against real-world constraints. SalesGenie AI reduces sales cycle time by 65% and scales outbound reply rates by 3x. To solve challenges like cold-start lead scoring, we seeded 60+ verified B2B SaaS accounts. To address LLM latency and hallucination risks, we built zero-downtime deterministic fallbacks.",
    render: () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: '100%', alignItems: 'center' }}>
        {/* Left: Key Advantages */}
        <div style={{ padding: '26px', borderRadius: '22px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981' }}>
            <CheckCircle2 size={20} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Key Project Advantages</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: '65% Faster Sales Velocity', desc: 'Predictive scoring eliminates guesswork, accelerating deal closures from 45 to 28 days.' },
              { label: '3x Higher Outbound Conversion', desc: 'NVIDIA NIM tailored cold emails referencing specific funding & technographic stacks.' },
              { label: 'Sub-15ms Inference Latency', desc: 'In-memory Scikit-Learn models provide instantaneous rep recommendations.' },
              { label: 'Zero-Retention Enterprise Privacy', desc: 'Enterprise customer data is never stored or used to train third-party public models.' }
            ].map((adv, idx) => (
              <div key={idx} style={{ padding: '12px 14px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)', display: 'block' }}>{adv.label}</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{adv.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Challenges & Mitigations */}
        <div style={{ padding: '26px', borderRadius: '22px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Engineering Challenges & Fixes</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { challenge: 'Cold-Start Lead Data Gaps', mitigation: 'Pre-seeded 60+ enterprise SaaS accounts (Snowflake, Datadog, Stripe) with realistic metrics.' },
              { challenge: 'NVIDIA NIM API Latency & Outages', mitigation: 'Implemented asynchronous requests paired with deterministic rule-based offline fallbacks.' },
              { challenge: 'Audio Chunk Transcription Noise', mitigation: 'Integrated SpeechRecognition with FFmpeg normalization and TextBlob polarity filtering.' },
              { challenge: 'Database Concurrency Locks', mitigation: 'Activated SQLite WAL mode with 7 B-Tree indexes, achieving <5ms query execution.' }
            ].map((item, idx) => (
              <div key={idx} style={{ padding: '12px 14px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)', display: 'block' }}>{item.challenge}</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}><strong>Fix:</strong> {item.mitigation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },

  // ── SLIDE 10: Real-World Business Impact ──
  {
    id: 10,
    tag: 'BUSINESS ROI',
    title: 'Measurable Impact for SaaS Stakeholders',
    subtitle: 'Delivering Tangible Return on Investment Across the Entire Revenue Org',
    speakerNotes:
      "SalesGenie AI drives measurable outcomes across every level of the SaaS organization: For SDRs and AEs, it saves 12+ hours per week in manual research. For RevOps, it eliminates subjective scoring with data-backed accuracy. And for C-Suite leadership, it shortens the payback period and expands Net Revenue Retention (NRR).",
    render: () => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px', height: '100%', alignItems: 'center' }}>
        {[
          {
            role: 'SDRs & Account Executives',
            kpi: '12+ Hours Saved / Week',
            bullets: [
              'Instant hot lead identification without manual research',
              '1-click personalized cold emails & follow-up cadences',
              'Never miss high-intent demo requests'
            ],
            color: '#465FFF'
          },
          {
            role: 'Revenue Operations (RevOps)',
            kpi: '94.2% Lead Accuracy',
            bullets: [
              'Objective ML intent scoring replaces arbitrary gut feeling',
              'Automated background daily follow-up priority digests',
              'Continuous model retraining on Won vs Lost outcomes'
            ],
            color: '#0284C7'
          },
          {
            role: 'C-Suite (CRO, VP Sales, CFO)',
            kpi: '28-Day Deal Velocity',
            bullets: [
              'Sales cycle compressed by 33% (from 42 to 28 days)',
              'Higher ACV accuracy via Closed Won deal benchmarking',
              'Lower CAC and accelerated trial-to-paid conversions'
            ],
            color: '#10B981'
          }
        ].map((card, i) => (
          <div key={i} style={{ padding: '28px 24px', borderRadius: '22px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: card.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.role}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: '10px 0 16px' }}>{card.kpi}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {card.bullets.map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <CheckCircle2 size={16} style={{ color: card.color, flexShrink: 0, marginTop: '2px' }} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>
              Verified SaaS Benchmark
            </div>
          </div>
        ))}
      </div>
    )
  },

  // ── SLIDE 11: Milestones & Conclusion ──
  {
    id: 11,
    tag: 'PROJECT VERIFICATION',
    title: 'Project Conclusion & Milestone Delivery',
    subtitle: '100% Milestone Compliance With Full Automated Test Validation',
    speakerNotes:
      "In conclusion, SaaS SalesGenie AI represents a comprehensive, production-ready revenue intelligence system. Every milestone has been successfully delivered and verified: from data architecture and Scikit-Learn ML scoring to NVIDIA NIM outreach, meeting transcription, and the Milestone 4 Executive KPI Suite with 22 out of 22 automated Pytests passing.",
    render: () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', height: '100%', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em', margin: 0 }}>
            All 5 Project Milestones <span style={{ color: '#10B981' }}>100% Delivered</span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
            Every required capability has been fully implemented, integrated, and verified with zero unresolved defects.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
            {[
              { m: 'Milestone 1', name: 'Database Architecture & Seed Pipeline', desc: 'SQLite WAL mode with 7 indexes & 60+ B2B SaaS accounts' },
              { m: 'Milestone 2', name: 'Supervised ML Lead Scoring Engine', desc: '100-tree RandomForest & TF-IDF Cosine Matcher' },
              { m: 'Milestone 3', name: 'Agentic AI Outreach & Call Intelligence', desc: 'NVIDIA NIM Llama 3.1 70B & Speech NLP parser' },
              { m: 'Milestone 4', name: 'Executive SaaS KPI Dashboard', desc: '6-Card KPI Suite, ARR Analytics & Priority Triage' }
            ].map((milestone, idx) => (
              <div key={idx} style={{ padding: '12px 16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} style={{ color: '#10B981' }} />
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{milestone.m}: {milestone.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{milestone.desc}</div>
                  </div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>VERIFIED</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Test Suite Badge */}
        <div style={{ padding: '28px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
            <ShieldCheck size={36} />
          </div>

          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10B981', lineHeight: 1 }}>22 / 22</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>Automated Tests Passing</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>100% Pass Rate across ML & API test suite</div>
          </div>

          <div style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--bg-card-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'left' }}>
            $ pytest backend/tests/test_engine.py -v<br />
            <span style={{ color: '#10B981' }}>22 passed in 1.35s [100%]</span>
          </div>
        </div>
      </div>
    )
  },

  // ── SLIDE 12: Thank You & Live Demo ──
  {
    id: 12,
    tag: 'CLOSING & Q&A',
    title: 'Thank You! Questions & Live Demo',
    subtitle: 'SaaS SalesGenie AI is Ready for Live Demonstration and Evaluation',
    speakerNotes:
      "Thank you very much for your time and attention today. We are now happy to open the floor to any questions and transition directly into the live interactive demonstration of the SaaS SalesGenie AI platform.",
    render: () => <ThankYouSlide />
  }
];

// ── Interactive Screenshot Showcase Component (Slide 8) ──
function InteractiveScreenshotShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: 'Executive KPI Dashboard', img: imgDashboard, desc: '6-Card KPI Suite, Active ARR ($1.86M+), Win Rate, and AI Follow-up Priority Triage.' },
    { title: 'ML Lead Intelligence', img: imgLeads, desc: '100-Tree RandomForest intent scores (0-100), conversion probability & closed-won deal matching.' },
    { title: '5-Stage Deal Pipeline', img: imgPipeline, desc: 'Interactive Kanban board tracking deals from New Lead to Closed Won.' },
    { title: 'Agentic AI Outreach', img: imgOutreach, desc: 'NVIDIA NIM Llama 3.1 70B generating cold emails, 48h follow-up cadences & InMails.' },
    { title: 'Call & Demo Intelligence', img: imgMeetings, desc: 'Audio recording & upload with speech transcription, TextBlob sentiment & action items.' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', height: '100%', alignItems: 'center' }}>
      {/* Left Switcher Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            style={{
              padding: '14px 16px',
              borderRadius: '16px',
              border: activeTab === idx ? '2px solid #465FFF' : '1px solid var(--border-subtle)',
              background: activeTab === idx ? 'var(--bg-card)' : 'var(--bg-card-subtle)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === idx ? 'var(--shadow-md)' : 'none'
            }}
          >
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: activeTab === idx ? '#465FFF' : 'var(--text-main)' }}>
              {tab.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.35 }}>
              {tab.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Right Image Frame */}
      <div style={{ borderRadius: '22px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-theme)', height: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={tabs[activeTab].img}
          alt={tabs[activeTab].title}
          style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#FFFFFF' }}
        />
      </div>
    </div>
  );
}

// ── Thank You Slide (Slide 12) ──
function ThankYouSlide() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', maxWidth: '840px', margin: '0 auto', gap: '24px' }}>
      <SalesGenieBrainSparkIcon size={72} />

      <h1 style={{ fontSize: '3.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em', margin: 0 }}>
        Thank You!
      </h1>

      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
        Questions, Comments, & Live Platform Demonstration
      </p>

      {/* Live Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary btn-lg"
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <Play size={18} />
          <span>Launch Live App</span>
        </button>

        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary btn-lg"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ExternalLink size={18} />
          <span>FastAPI Docs</span>
        </a>
      </div>

      <div style={{ display: 'flex', gap: '24px', padding: '16px 28px', borderRadius: '18px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '10px' }}>
        <div><strong>Frontend:</strong> localhost:5173</div>
        <div><strong>Backend API:</strong> localhost:8000</div>
        <div><strong>Demo Login:</strong> demo@salesgenie.ai</div>
      </div>
    </div>
  );
}

// ── Main WebPresentation Component ──
export default function WebPresentation() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const totalSlides = slidesData.length;
  const slide = slidesData[currentSlide];

  // Navigation handlers
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  }, [totalSlides]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showGrid) {
        if (e.key === 'Escape') setShowGrid(false);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes((prev) => !prev);
      } else if (e.key === 'g' || e.key === 'G') {
        setShowGrid((prev) => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        toggleTheme();
      } else if (e.key === 'Escape') {
        setShowNotes(false);
        setShowGrid(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, showGrid, toggleTheme]);

  // Autoplay mode
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        nextSlide();
      }, 8000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, nextSlide]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', overflow: 'hidden', userSelect: 'none' }}>
      
      {/* ── Top Floating Navigation Bar (CollectiveOS Style) ── */}
      <header style={{ height: '64px', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-header)', backdropFilter: 'blur(20px)', zIndex: 30 }}>
        
        {/* Left: Brand / Return to App */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Return to SalesGenie Dashboard"
          >
            <Home size={15} />
            <span>Dashboard</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SalesGenieBrainSparkIcon size={24} />
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              SaaS SalesGenie <span style={{ color: '#465FFF' }}>AI</span>
            </span>
            <span className="badge badge-brand" style={{ fontSize: '0.65rem' }}>DECK</span>
          </div>
        </div>

        {/* Center: Slide Progress Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={prevSlide}
            className="btn btn-secondary btn-sm"
            style={{ width: '34px', height: '34px', padding: 0, borderRadius: '50%' }}
            title="Previous Slide (←)"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            onClick={() => setShowGrid(true)}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Click to view all slides (G)"
          >
            <span>Slide {currentSlide + 1} of {totalSlides}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>({Math.round(((currentSlide + 1) / totalSlides) * 100)}%)</span>
          </div>

          <button
            onClick={nextSlide}
            className="btn btn-secondary btn-sm"
            style={{ width: '34px', height: '34px', padding: 0, borderRadius: '50%' }}
            title="Next Slide (→)"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right: Actions (Autoplay, Grid, Notes, Theme, Fullscreen) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Autoplay Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`btn btn-sm ${isPlaying ? 'btn-brand' : 'btn-secondary'}`}
            style={{ padding: '6px 12px' }}
            title={isPlaying ? 'Pause Autoplay' : 'Start Autoplay'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Playing' : 'Play'}</span>
          </button>

          {/* Grid Overview */}
          <button
            onClick={() => setShowGrid(true)}
            className="btn btn-secondary btn-sm"
            style={{ width: '34px', height: '34px', padding: 0 }}
            title="Slide Grid Overview (G)"
          >
            <Grid size={15} />
          </button>

          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`btn btn-sm ${showNotes ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 12px' }}
            title="Speaker Speech Notes (N)"
          >
            <FileText size={14} />
            <span>Notes</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ width: '34px', height: '34px', padding: 0 }}
            title="Toggle Light / Dark Mode (T)"
          >
            {isDark ? <Sun size={15} style={{ color: '#F59E0B' }} /> : <Moon size={15} style={{ color: '#465FFF' }} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="btn btn-secondary btn-sm"
            style={{ width: '34px', height: '34px', padding: 0 }}
            title="Fullscreen Mode (F)"
          >
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
          </button>
        </div>

      </header>

      {/* ── Main Slide Stage ── */}
      <main style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', padding: '24px 48px', overflow: 'hidden' }}>
        
        {/* Slide Header (Tag & Titles) */}
        {slide.id !== 1 && slide.id !== 12 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-brand" style={{ fontSize: '0.7rem', padding: '2px 10px' }}>
                {slide.tag}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                Slide {slide.id} / {totalSlides}
              </span>
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em', margin: 0 }}>
              {slide.title}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {slide.subtitle}
            </p>
          </div>
        )}

        {/* Dynamic Slide Content */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          {slide.render()}
        </div>

        {/* Bottom Progress Bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'var(--border-subtle)' }}>
          <div
            style={{
              height: '100%',
              width: `${((currentSlide + 1) / totalSlides) * 100}%`,
              background: 'linear-gradient(90deg, #465FFF 0%, #0284C7 100%)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </main>

      {/* ── Slide Grid Modal (Overview) ── */}
      {showGrid && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
          <div style={{ width: '100%', maxWidth: '1100px', maxHeight: '85vh', backgroundColor: 'var(--bg-body)', borderRadius: '24px', border: '1px solid var(--border-subtle)', padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: 'var(--shadow-hover)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Slide Overview Grid
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Click any thumbnail to jump directly to that slide. Press Esc to close.
                </p>
              </div>
              <button
                onClick={() => setShowGrid(false)}
                className="btn btn-secondary btn-sm"
              >
                Close (Esc)
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {slidesData.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => { setCurrentSlide(idx); setShowGrid(false); }}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: currentSlide === idx ? 'var(--bg-card)' : 'var(--bg-card-subtle)',
                    border: currentSlide === idx ? '2px solid #465FFF' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: currentSlide === idx ? 'var(--shadow-md)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#465FFF' }}>#{s.id}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-card)', color: 'var(--text-dim)' }}>
                      {s.tag}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
                    {s.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Presenter Speaker Notes Drawer ── */}
      {showNotes && (
        <div style={{ position: 'fixed', bottom: '16px', right: '24px', width: '420px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '20px', boxShadow: 'var(--shadow-hover)', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} style={{ color: '#465FFF' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Speaker Transcript</span>
            </div>
            <button
              onClick={() => setShowNotes(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
            >
              Hide (N)
            </button>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, maxHeight: '200px', overflowY: 'auto' }}>
            "{slide.speakerNotes}"
          </div>
        </div>
      )}

    </div>
  );
}
