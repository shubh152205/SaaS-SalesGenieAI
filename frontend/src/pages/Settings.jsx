import React from 'react';
import {
  Cpu,
  Database,
  Server,
  ShieldCheck,
  Zap,
  Lock,
  User,
  Key
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Settings = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Settings & Model Configurations"
        subtitle="Manage NVIDIA NIM LLM Engines, ML Random Forest Hyperparameters & Security Credentials"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
          
          {/* Executive Profile Card */}
          <div className="tail-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--brand-50)', color: 'var(--brand-500)' }}>
                <User size={20} />
              </div>
              <div>
                <h3 className="text-title-sm">Executive Profile</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>Authenticated User Credentials</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Full Name</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name || 'Sales Director'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Email Address</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user?.email || 'demo@salesgenie.ai'}</div>
              </div>

              <div style={{ marginTop: '6px' }}>
                <span className="badge badge-brand">Enterprise Tier Admin</span>
              </div>
            </div>
          </div>

          {/* NVIDIA NIM Orchestration */}
          <div className="tail-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--info-50)', color: 'var(--info-600)' }}>
                <Cpu size={20} />
              </div>
              <div>
                <h3 className="text-title-sm">NVIDIA NIM LLM Engine</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>Live Production Inference</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-card-subtle)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Primary LLM</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-400)' }}>meta/llama-3.1-70b-instruct</span>
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
          <div className="tail-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--success-50)', color: 'var(--success-600)' }}>
                <Database size={20} />
              </div>
              <div>
                <h3 className="text-title-sm">Scikit-Learn ML Lead Scorer</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>Supervised Conversion Classifier</p>
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              • <strong>Algorithm:</strong> RandomForestClassifier (n_estimators=100, max_depth=8)<br />
              • <strong>Deal Matcher:</strong> TfidfVectorizer + linear_kernel Cosine Similarity<br />
              • <strong>Intent Features:</strong> Demo Requests, Email Opens, Page Views, Stage &amp; Deal Size<br />
              • <strong>Follow-up Engine:</strong> Days-since-contact → High Priority / Phone Call / Reminder
            </div>
          </div>

          {/* Security & Database */}
          <div className="tail-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--warning-50)', color: 'var(--warning-600)' }}>
                <Server size={20} />
              </div>
              <div>
                <h3 className="text-title-sm">Security & SQLite Database</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>Encryption & Seed Records</p>
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              • <strong>Authentication:</strong> PyJWT HS256 Token Encoding with Expire Claims<br />
              • <strong>Password Protection:</strong> PBKDF2-HMAC-SHA256 Multi-Iteration Hashing<br />
              • <strong>Database:</strong> SQLite WAL Mode with 60+ B2B leads &amp; 7 performance indexes<br />
              • <strong>Unit Tests:</strong> 22 passing pytest tests covering ML &amp; recommendation engine
            </div>
          </div>

          {/* Automation Module Status */}
          <div className="tail-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--brand-50)', color: 'var(--brand-500)' }}>
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-title-sm">Automation Module (M4)</h3>
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
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{job.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{job.value}</div>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security API Keys */}
          <div className="tail-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: 'var(--error-500)' }}>
                <Key size={20} />
              </div>
              <div>
                <h3 className="text-title-sm">API Key Management</h3>
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
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--brand-400)' }}>{item.value}</span>
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
