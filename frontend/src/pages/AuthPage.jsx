import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  User,
  Zap,
  TrendingUp,
  Cpu,
  Headphones,
  CheckCircle2,
  Database,
  Layers
} from 'lucide-react';
import { SalesGenieBrainSparkIcon } from '../components/SalesGenieLogo';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@salesgenie.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error);
    }
  };

  const handle1ClickDemo = async () => {
    setEmail('demo@salesgenie.ai');
    setPassword('password123');
    const res = await login('demo@salesgenie.ai', 'password123');
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-app)',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '1140px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '48px',
        alignItems: 'center'
      }}>
        
        {/* Left Column: Hero & TailAdmin Presentation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <SalesGenieBrainSparkIcon size={46} />
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>SalesGenie</span>
                <span style={{ fontSize: '0.72rem', background: 'linear-gradient(135deg, #465fff 0%, #38bdf8 100%)', color: 'white', padding: '1px 7px', borderRadius: '4px', fontWeight: 800 }}>
                  AI
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--brand-400)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                The AI Brain Spark
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-title-xxl" style={{ marginBottom: '14px' }}>
              Autonomous B2B Sales & Predictive Lead Intelligence
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '520px' }}>
              The all-in-one B2B SaaS sales intelligence platform powered by 120-tree Random Forests, NVIDIA NIM Llama 3.1 70B outreach, and real-time meeting transcription.
            </p>
          </div>

          {/* 4 Feature Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="tail-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <TrendingUp size={18} style={{ color: 'var(--brand-500)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>ML Lead Scoring</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                RandomForestClassifier predicting 0-100 conversion probability.
              </p>
            </div>

            <div className="tail-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <Cpu size={18} style={{ color: 'var(--info-500)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>NVIDIA NIM LLMs</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Personalized cold outreach with meta/llama-3.1-70b-instruct.
              </p>
            </div>
          </div>

          {/* Pipeline Stats Summary */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>$3.0M+</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active Pipeline</div>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success-500)' }}>28.4%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Conv. Velocity</div>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--info-500)' }}>50+</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Pre-Seeded Leads</div>
            </div>
          </div>

        </div>

        {/* Right Column: TailAdmin Login Portal */}
        <div className="tail-card tail-card-glow" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <SalesGenieBrainSparkIcon size={44} />
            <div>
              <h3 className="text-title-sm">
                {isLogin ? 'Executive Sign In' : 'Create Enterprise Account'}
              </h3>
              <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>
                {isLogin ? 'Access your AI sales workspace' : 'Start your full platform access'}
              </p>
            </div>
          </div>

          {/* ⚡ 1-Click Instant Demo Login Button */}
          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--brand-50)',
            border: '1px solid rgba(70, 95, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <button
              type="button"
              onClick={handle1ClickDemo}
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.9rem', fontWeight: 700 }}
            >
              <Zap size={18} />
              <span>⚡ 1-Click Instant Demo Login</span>
            </button>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Logs in as <strong>Sales Director</strong> (<code style={{ color: 'var(--brand-500)' }}>demo@salesgenie.ai</code>)
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              or enter password
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          {error && (
            <div style={{ padding: '10px', background: 'var(--error-50)', color: 'var(--error-600)', borderRadius: '8px', fontSize: '0.8125rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!isLogin && (
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="tail-input"
                  placeholder="Sarah Connor"
                />
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="tail-input"
                placeholder="director@enterprise.com"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="tail-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '12px', marginTop: '4px' }}
            >
              <span>{isLogin ? 'Sign In with Password' : 'Create Account'}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Toggle */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8125rem', cursor: 'pointer' }}
            >
              {isLogin ? "Need a new account? Register here" : "Already have an account? Sign in here"}
            </button>
          </div>

          {/* Security Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.72rem',
            color: 'var(--text-dim)'
          }}>
            <ShieldCheck size={14} style={{ color: 'var(--success-500)' }} />
            <span>PyJWT HS256 Protected • PBKDF2 Encrypted</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthPage;
