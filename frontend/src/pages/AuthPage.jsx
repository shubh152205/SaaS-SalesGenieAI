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
  Layers,
  Activity,
  Award
} from 'lucide-react';
import { SalesGenieFullLogo, SalesGenieBrainSparkIcon } from '../components/SalesGenieLogo';
import { useAuth } from '../context/AuthContext';
import loginHeroImg from '../assets/login_hero.jpg';

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
      backgroundColor: 'var(--bg-app, #0b1329)',
      padding: '32px 24px',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background Ambient Glow Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '15%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '10%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '1240px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
        gap: '48px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Left Column: Hero, Presentation & Visual Showcase */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <SalesGenieFullLogo size={58} showSubtitle={true} />

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(79, 70, 229, 0.15)', border: '1px solid rgba(79, 70, 229, 0.35)', marginBottom: '14px' }}>
              <Sparkles size={14} style={{ color: '#06b6d4' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.04em' }}>
                NEXT-GEN AI SALES INTELLIGENCE & CRM
              </span>
            </div>
            <h1 className="text-title-xxl" style={{ fontSize: '2.4rem', lineHeight: '1.2', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Autonomous B2B Sales & Predictive Lead Velocity
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '560px' }}>
              The end-to-end B2B revenue intelligence operating system powered by 120-tree Random Forest models, NVIDIA NIM Llama 3.1 70B outreach, and real-time meeting transcription.
            </p>
          </div>

          {/* Interactive Hero Image Preview Showcase */}
          <div className="image-hero-frame animate-float" style={{ maxHeight: '280px', position: 'relative' }}>
            <img src={loginHeroImg} alt="SaaS-SalesGenie AI Intelligence Platform" />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(0deg, rgba(11, 19, 41, 0.95) 0%, rgba(11, 19, 41, 0.6) 60%, rgba(11, 19, 41, 0) 100%)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pulse-dot" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff' }}>
                  Live Neural Sales Copilot & Telemetry
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                  89% Avg Win Rate
                </span>
                <span className="badge badge-cyan" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                  120-Tree ML
                </span>
              </div>
            </div>
          </div>

          {/* 4 Feature Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="tail-card glow-card" style={{ padding: '16px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(79, 70, 229, 0.12)', color: '#6366f1' }}>
                  <TrendingUp size={18} />
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>ML Lead Scoring</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                RandomForestClassifier predicting 0-100 conversion probability.
              </p>
            </div>

            <div className="tail-card glow-card" style={{ padding: '16px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' }}>
                  <Cpu size={18} />
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>NVIDIA NIM LLMs</span>
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
            padding: '16px 24px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>$3.0M+</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Active Pipeline</div>
            </div>
            <div style={{ width: '1px', height: '28px', background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--success-500)', fontVariantNumeric: 'tabular-nums' }}>28.4%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Conv. Velocity</div>
            </div>
            <div style={{ width: '1px', height: '28px', background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--info-500)', fontVariantNumeric: 'tabular-nums' }}>50+</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Pre-Seeded Leads</div>
            </div>
          </div>

        </div>

        {/* Right Column: SaaS-SalesGenie AI Login Portal */}
        <div className="tail-card tail-card-glow animate-entrance" style={{ padding: '38px', display: 'flex', flexDirection: 'column', gap: '22px', borderRadius: 'var(--radius-2xl)', background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <SalesGenieBrainSparkIcon size={48} />
            <div>
              <h3 className="text-title-sm" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {isLogin ? 'Executive Portal Sign In' : 'Create Enterprise Account'}
              </h3>
              <p className="text-theme-xs" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                {isLogin ? 'Access your SaaS-SalesGenie AI workspace' : 'Start your full platform intelligence access'}
              </p>
            </div>
          </div>

          {/* ⚡ 1-Click Instant Demo Login Button */}
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
            border: '1px solid rgba(79, 70, 229, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <button
              type="button"
              onClick={handle1ClickDemo}
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.92rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                boxShadow: '0 4px 16px rgba(79, 70, 229, 0.45)'
              }}
            >
              <Zap size={18} />
              <span>⚡ 1-Click Instant Demo Login</span>
            </button>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Instant access as <strong>Sales Director</strong> (<code style={{ color: 'var(--brand-500)', fontWeight: 600 }}>demo@salesgenie.ai</code>)
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              or continue with email
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          {error && (
            <div style={{ padding: '12px', background: 'var(--error-50)', color: 'var(--error-600)', borderRadius: '8px', fontSize: '0.8125rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div className="input-group">
                <label className="input-label" style={{ fontWeight: 600 }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="tail-input"
                    placeholder="Sarah Connor"
                    style={{ paddingLeft: '38px' }}
                  />
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600 }}>Work Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="tail-input"
                  placeholder="director@enterprise.com"
                  style={{ paddingLeft: '38px' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="tail-input"
                  placeholder="••••••••"
                  style={{ paddingLeft: '38px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '12px', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <span>{isLogin ? 'Sign In to Platform' : 'Create Account'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Toggle */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: 'var(--brand-500)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
            >
              {isLogin ? "Don't have an enterprise account? Register here" : "Already have an account? Sign in here"}
            </button>
          </div>

          {/* Security Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.72rem',
            color: 'var(--text-dim)'
          }}>
            <ShieldCheck size={15} style={{ color: 'var(--success-500)' }} />
            <span>PyJWT HS256 Protected • Enterprise SOC2 Ready</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthPage;
