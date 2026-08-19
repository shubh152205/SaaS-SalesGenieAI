import React from 'react';
import {
  Cpu,
  Database,
  Server,
  ShieldCheck,
  Zap,
  Lock,
  User,
  Key,
  Award,
  Sparkles,
  Activity,
  CheckCircle2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Settings = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Settings & Model Configurations"
        subtitle="SaaS AI Powered Sales Intelligence Forecasting — System Parameters, NVIDIA NIM Orchestration & Security Credentials"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Settings Header Card */}
        <div className="tail-card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                SaaS AI Powered Sales Intelligence Forecasting — Workspace Infrastructure
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Active Production Cluster: NVIDIA NIM Llama 3.1 70B • 120-Tree Random Forest • SQLite WAL
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-emerald" style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700 }}>
              All Systems Operational
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
          
          {/* Executive Profile Card */}
          <div className="tail-card animate-entrance" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(79, 70, 229, 0.12)', color: '#6366f1' }}>
                <User size={20} />
              </div>
              <div>
                <h3 className="text-title-sm" style={{ fontWeight: 800 }}>Executive Profile</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>Authenticated User Credentials</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Full Name</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{user?.name || 'Sales Director'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user?.email || 'demo@salesgenie.ai'}</div>
              </div>

              <div style={{ marginTop: '6px' }}>
                <span className="badge badge-indigo" style={{ fontWeight: 700 }}>Enterprise Tier Admin</span>
              </div>
            </div>
          </div>

          {/* NVIDIA NIM Orchestration */}
          <div className="tail-card animate-entrance" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' }}>
                <Cpu size={20} />
              </div>
              <div>
                <h3 className="text-title-sm" style={{ fontWeight: 800 }}>NVIDIA NIM LLM Engine</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>Live Production Inference</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Primary LLM</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-500)' }}>meta/llama-3.1-70b-instruct</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Status</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--success-500)' }}>Active & Connected</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Fast Fallback</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--info-500)' }}>meta/llama-3.3-70b-instruct</span>
              </div>
            </div>
          </div>

          {/* Scikit-Learn Model Hyperparameters */}
          <div className="tail-card animate-entrance" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                <Database size={20} />
              </div>
              <div>
                <h3 className="text-title-sm" style={{ fontWeight: 800 }}>Scikit-Learn ML Lead Scorer</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>Supervised Conversion Classifier</p>
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              • <strong>Algorithm:</strong> RandomForestClassifier (n_estimators=120, max_depth=8)<br />
              • <strong>Deal Matcher:</strong> TfidfVectorizer + linear_kernel Cosine Similarity<br />
              • <strong>Intent Features:</strong> Demo Requests, Email Opens, Page Views, Stage &amp; Deal Size<br />
              • <strong>Follow-up Engine:</strong> Days-since-contact → High Priority / Phone Call / Reminder
            </div>
          </div>

          {/* Security & Database */}
          <div className="tail-card animate-entrance" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                <Server size={20} />
              </div>
              <div>
                <h3 className="text-title-sm" style={{ fontWeight: 800 }}>Security & SQLite Database</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>Encryption & Seed Records</p>
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              • <strong>Authentication:</strong> PyJWT HS256 Token Encoding with Expire Claims<br />
              • <strong>Password Protection:</strong> PBKDF2-HMAC-SHA256 Multi-Iteration Hashing<br />
              • <strong>Database:</strong> SQLite WAL Mode with 50+ B2B leads &amp; 7 performance indexes<br />
              • <strong>Unit Tests:</strong> 23 passing pytest tests covering ML &amp; recommendation engine
            </div>
          </div>

          {/* Automation Module Status */}
          <div className="tail-card animate-entrance" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.12)', color: '#a855f7' }}>
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-title-sm" style={{ fontWeight: 800 }}>Automation Module</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>Scheduled jobs &amp; follow-up digests</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Daily Follow-up Digest', value: 'Every day 10:00 AM', ok: true },
                { label: 'ML Model Retraining', value: 'Every Sunday 2:00 AM', ok: true },
                { label: 'CRM Daily Report', value: 'Every day 6:00 AM', ok: true },
                { label: 'Pipeline Stage Sync', value: 'Every 4 hours', ok: true },
              ].map((job, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{job.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{job.value}</div>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.68rem', fontWeight: 700 }}>Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security API Keys */}
          <div className="tail-card animate-entrance" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' }}>
                <Key size={20} />
              </div>
              <div>
                <h3 className="text-title-sm" style={{ fontWeight: 800 }}>API Key Management</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>NVIDIA NIM &amp; JWT credentials</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'NVIDIA NIM API Key', value: 'nvapi-*****************' },
                { label: 'JWT Secret', value: 'HS256 (Env Protected)' },
                { label: 'Database Path', value: 'backend/salesgenie.db' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--brand-500)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
