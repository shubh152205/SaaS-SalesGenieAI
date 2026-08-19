import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  User,
  Zap,
  Activity,
  Cpu,
  Radio,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Rotating word list for the editorial headline
const ROTATING_WORDS = ['qualify', 'automate', 'predict', 'close', 'scale'];

// Staggered blur-in word animator with chromatic gradient
function BlurWord({ word, trigger }) {
  const letters = word.split('');
  const STAGGER = 45;
  const DURATION = 500;
  const GRADIENT_HOLD = STAGGER * letters.length + DURATION + 200;

  const [letterStates, setLetterStates] = useState(
    letters.map(() => ({ opacity: 0, blur: 20 }))
  );
  const [showGradient, setShowGradient] = useState(true);
  const framesRef = useRef([]);
  const timersRef = useRef([]);

  useEffect(() => {
    framesRef.current.forEach(cancelAnimationFrame);
    timersRef.current.forEach(clearTimeout);
    framesRef.current = [];
    timersRef.current = [];

    setLetterStates(letters.map(() => ({ opacity: 0, blur: 20 })));
    setShowGradient(true);

    letters.forEach((_, i) => {
      const t = setTimeout(() => {
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / DURATION, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setLetterStates((prev) => {
            const next = [...prev];
            next[i] = { opacity: eased, blur: 20 * (1 - eased) };
            return next;
          });
          if (progress < 1) {
            const id = requestAnimationFrame(tick);
            framesRef.current.push(id);
          }
        };
        const id = requestAnimationFrame(tick);
        framesRef.current.push(id);
      }, i * STAGGER);
      timersRef.current.push(t);
    });

    const gt = setTimeout(() => setShowGradient(false), GRADIENT_HOLD);
    timersRef.current.push(gt);

    return () => {
      framesRef.current.forEach(cancelAnimationFrame);
      timersRef.current.forEach(clearTimeout);
    };
  }, [trigger, word]);

  const gradientColors = ['#eca8d6', '#a78bfa', '#67e8f9', '#fbbf24', '#eca8d6'];

  return (
    <>
      {letters.map((char, i) => {
        const colorIndex = (i / Math.max(letters.length - 1, 1)) * (gradientColors.length - 1);
        const lower = Math.floor(colorIndex);
        const upper = Math.min(lower + 1, gradientColors.length - 1);
        const t = colorIndex - lower;

        const hex2rgb = (hex) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return [r, g, b];
        };
        const [r1, g1, b1] = hex2rgb(gradientColors[lower]);
        const [r2, g2, b2] = hex2rgb(gradientColors[upper]);
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: letterStates[i]?.opacity ?? 0,
              filter: `blur(${letterStates[i]?.blur ?? 20}px)`,
              color: showGradient ? `rgb(${r},${g},${b})` : '#ffffff',
              transition: 'color 0.4s ease'
            }}
          >
            {char}
          </span>
        );
      })}
    </>
  );
}

// 3D ASCII Torus Knot Scene Canvas (from compute platform)
const ASCII_CHARS = ' .:-=+*#%@';

function AsciiScene() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);

  const handleMouseMove = useCallback((e) => {
    mouseRef.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = rect?.width || window.innerWidth;
      const h = rect?.height || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    // Torus Knot geometry generator
    const generateTorusKnot = (p, q, segments, tubeSegments) => {
      const points = [];
      for (let i = 0; i < segments; i++) {
        for (let j = 0; j < tubeSegments; j++) {
          const u = (i / segments) * Math.PI * 2;
          const v = (j / tubeSegments) * Math.PI * 2;

          const r = 2 + Math.cos(q * u);
          const x = r * Math.cos(p * u);
          const y = r * Math.sin(p * u);
          const z = -Math.sin(q * u);

          const tubeRadius = 0.42;
          const nx = Math.cos(p * u) * Math.cos(v);
          const ny = Math.sin(p * u) * Math.cos(v);
          const nz = Math.sin(v);

          points.push({
            x: x + tubeRadius * nx,
            y: y + tubeRadius * ny,
            z: z + tubeRadius * nz
          });
        }
      }
      return points;
    };

    const torusKnot = generateTorusKnot(2, 3, 110, 14);

    const rotatePoint = (point, angleX, angleY, angleZ) => {
      let { x, y, z } = point;
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const newY = y * cosX - z * sinX;
      const newZ = y * sinX + z * cosX;
      y = newY;
      z = newZ;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const newX = x * cosY + z * sinY;
      z = -x * sinY + z * cosY;
      x = newX;

      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);
      const finalX = x * cosZ - y * sinZ;
      const finalY = x * sinZ + y * cosZ;
      return { x: finalX, y: finalY, z };
    };

    const project = (point, centerX, centerY, scale) => {
      const perspective = 5.2;
      const factor = perspective / (perspective + point.z);
      return {
        x: centerX + point.x * scale * factor,
        y: centerY + point.y * scale * factor,
        z: point.z
      };
    };

    let animationFrameId;
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;

      // Position Torus Knot slightly towards top-right for visual balance with auth card
      const centerX = width * 0.72;
      const centerY = height * 0.45;
      const scale = Math.min(width, height) * 0.28;

      ctx.clearRect(0, 0, width, height);
      const mouseInfluenceX = (mouseRef.current.x - 0.5) * 0.4;
      const mouseInfluenceY = (mouseRef.current.y - 0.5) * 0.4;

      const time = timeRef.current;
      const angleX = time * 0.28 + mouseInfluenceY;
      const angleY = time * 0.44 + mouseInfluenceX;
      const angleZ = time * 0.18;

      const projectedPoints = torusKnot
        .map((point) => {
          const rotated = rotatePoint(point, angleX, angleY, angleZ);
          return project(rotated, centerX, centerY, scale);
        })
        .sort((a, b) => a.z - b.z);

      const charSize = Math.max(13, Math.min(width, height) * 0.025);
      ctx.font = `${charSize}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      projectedPoints.forEach((point) => {
        const normalizedZ = (point.z + 3) / 6;
        const charIndex = Math.floor(normalizedZ * (ASCII_CHARS.length - 1));
        const char = ASCII_CHARS[Math.max(0, Math.min(ASCII_CHARS.length - 1, charIndex))];

        const brightness = 0.15 + normalizedZ * 0.75;
        const green = Math.floor(180 + normalizedZ * 75);
        ctx.fillStyle = `rgba(${Math.floor(green * 0.5)}, ${green}, ${Math.floor(green * 0.75)}, ${brightness * 0.65})`;
        ctx.fillText(char, point.x, point.y);
      });

      // Floating stardust particles
      const particleCount = 45;
      for (let i = 0; i < particleCount; i++) {
        const px = (Math.sin(time * 0.4 + i * 0.6) * 0.45 + 0.5) * width;
        const py = (Math.cos(time * 0.3 + i * 0.8) * 0.45 + 0.5) * height;
        const pz = Math.sin(time + i) * 0.5 + 0.5;

        ctx.fillStyle = `rgba(110, 231, 183, ${pz * 0.22})`;
        ctx.fillText(
          ASCII_CHARS[Math.floor(pz * (ASCII_CHARS.length - 1))],
          px,
          py
        );
      }

      timeRef.current += 0.007;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.85
      }}
    />
  );
}

const AuthPage = () => {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@salesgenie.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [wordIndex, setWordIndex] = useState(0);

  // Cycle animated word every 2.6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

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
    <div
      className="noise-overlay"
      style={{
        minHeight: '100dvh',
        width: '100vw',
        backgroundColor: '#05070c',
        color: '#f8fafc',
        position: 'relative',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Instrument Sans', 'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* 3D ASCII Torus Knot Simulation Canvas */}
      <AsciiScene />

      {/* Subtle Blueprint Grid Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.12
        }}
      >
        {/* Horizontal grid lines */}
        {[...Array(9)].map((_, i) => (
          <div
            key={`h-${i}`}
            style={{
              position: 'absolute',
              height: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              top: `${11.1 * (i + 1)}%`,
              left: 0,
              right: 0
            }}
          />
        ))}
        {/* Vertical grid lines */}
        {[...Array(13)].map((_, i) => (
          <div
            key={`v-${i}`}
            style={{
              position: 'absolute',
              width: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              left: `${7.69 * (i + 1)}%`,
              top: 0,
              bottom: 0
            }}
          />
        ))}
      </div>

      {/* Ambient Top Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.09) 0%, rgba(6, 182, 212, 0.04) 40%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Floating Navigation Header */}
      <header
        style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '24px 32px 0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="font-display"
            style={{
              fontSize: '1.65rem',
              letterSpacing: '-0.03em',
              fontWeight: 400,
              color: '#ffffff'
            }}
          >
            SALES INTELLIGENCE
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              color: 'rgba(255, 255, 255, 0.5)',
              padding: '2px 6px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              marginTop: '4px',
              letterSpacing: '0.05em'
            }}
          >
            FORECASTING // AI
          </span>
        </div>

        {/* Center System Status Bar (Desktop) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.72rem',
            color: 'rgba(255, 255, 255, 0.6)',
            letterSpacing: '0.04em'
          }}
          className="hidden md:flex"
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            NODE // PROD_01 ONLINE
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span>NVIDIA NIM LLAMA 3.1</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span>FASTER-WHISPER STT</span>
        </div>

        {/* Quick Demo Access Button in Nav */}
        <button
          type="button"
          onClick={handle1ClickDemo}
          className="hover-lift"
          style={{
            padding: '8px 18px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '9999px',
            color: '#ffffff',
            fontSize: '0.78rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={14} style={{ color: '#10b981' }} />
          <span>1-Click Demo</span>
        </button>
      </header>

      {/* Main Hero & Auth Split Layout */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 32px 60px 32px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
          gap: '56px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Left Column: Compute Editorial Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Eyebrow badge */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.7)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              <span style={{ width: '28px', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.4)' }} />
              <span>Autonomous AI agents for revenue operations</span>
            </div>
          </div>

          {/* Headline with Staggered BlurWord cycling */}
          <div>
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(2.6rem, 5.5vw, 4.8rem)',
                lineHeight: '0.95',
                letterSpacing: '-0.035em',
                fontWeight: 400,
                color: '#ffffff',
                margin: 0
              }}
            >
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
                Autonomous CRM,
              </span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
                agents that{' '}
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <BlurWord word={ROTATING_WORDS[wordIndex]} trigger={wordIndex} />
                </span>
              </span>
            </h1>
          </div>

          {/* Editorial Subtitle */}
          <p
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255, 255, 255, 0.65)',
              lineHeight: '1.65',
              maxWidth: '560px',
              margin: 0,
              fontWeight: 400
            }}
          >
            The predictive revenue operating system. Deploy 120-tree Random Forest models for sub-45ms lead scoring, NVIDIA NIM Llama 3.1 70B automated outreach synthesis, and real-time Faster-Whisper call intelligence.
          </p>

          {/* Compute-style Architecture Feature Specs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '14px',
              maxWidth: '600px'
            }}
          >
            {[
              { num: '01', title: 'ML Lead Radar', desc: '120-Tree Random Forest', icon: Activity },
              { num: '02', title: 'NIM Outreach', desc: 'Llama 3.1 70B Generative AI', icon: Cpu },
              { num: '03', title: 'Whisper STT', desc: 'Real-Time Audio Analysis', icon: Radio }
            ].map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.num}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.68rem',
                        color: '#10b981',
                        letterSpacing: '0.05em'
                      }}
                    >
                      [{spec.num}]
                    </span>
                    <Icon size={14} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
                    {spec.title}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.68rem',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    {spec.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Compute Platform Live Metrics Row */}
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '36px'
            }}
          >
            {[
              { value: '98.4%', label: 'Lead Scoring Accuracy' },
              { value: '<45ms', label: 'Inference Latency' },
              { value: '3,500+', label: 'Accounts Analyzed' },
              { value: '99.7%', label: 'Distributed Uptime' }
            ].map((stat) => (
              <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span
                  className="font-display"
                  style={{
                    fontSize: '1.75rem',
                    color: '#ffffff',
                    lineHeight: '1',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    letterSpacing: '0.02em'
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Industrial Compute Auth Console */}
        <div style={{ position: 'relative' }}>
          {/* Glass Card Container */}
          <div
            style={{
              backgroundColor: 'rgba(10, 14, 23, 0.72)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '20px',
              padding: '36px 32px',
              position: 'relative',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.6), 0 0 32px rgba(16, 185, 129, 0.08)'
            }}
          >
            {/* Industrial Precision Corner Brackets */}
            <div style={{ position: 'absolute', top: '-1px', left: '-1px', width: '16px', height: '16px', borderTop: '2px solid rgba(255, 255, 255, 0.5)', borderLeft: '2px solid rgba(255, 255, 255, 0.5)', borderTopLeftRadius: '20px' }} />
            <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '16px', height: '16px', borderTop: '2px solid rgba(255, 255, 255, 0.5)', borderRight: '2px solid rgba(255, 255, 255, 0.5)', borderTopRightRadius: '20px' }} />
            <div style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '16px', height: '16px', borderBottom: '2px solid rgba(255, 255, 255, 0.5)', borderLeft: '2px solid rgba(255, 255, 255, 0.5)', borderBottomLeftRadius: '20px' }} />
            <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '16px', height: '16px', borderBottom: '2px solid rgba(255, 255, 255, 0.5)', borderRight: '2px solid rgba(255, 255, 255, 0.5)', borderBottomRightRadius: '20px' }} />

            {/* Terminal Header & Mode Switcher */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.7rem',
                    color: '#10b981',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    letterSpacing: '0.06em'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                  AUTH_TERMINAL // NODE_01
                </span>

                {/* Minimalist Tab Selector */}
                <div
                  style={{
                    display: 'inline-flex',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '9999px',
                    padding: '3px'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setError(''); }}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: isLogin ? '#ffffff' : 'transparent',
                      color: isLogin ? '#05070c' : 'rgba(255, 255, 255, 0.6)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError(''); }}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: !isLogin ? '#ffffff' : 'transparent',
                      color: !isLogin ? '#05070c' : 'rgba(255, 255, 255, 0.6)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Register
                  </button>
                </div>
              </div>

              <h2
                className="font-display"
                style={{
                  fontSize: '2rem',
                  letterSpacing: '-0.02em',
                  fontWeight: 400,
                  color: '#ffffff',
                  margin: '0 0 6px 0'
                }}
              >
                {isLogin ? 'Authenticate Session' : 'Initialize Workspace'}
              </h2>
              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'rgba(255, 255, 255, 0.55)',
                  margin: 0,
                  fontFamily: "'Instrument Sans', sans-serif"
                }}
              >
                {isLogin
                  ? 'Enter credentials to access predictive pipeline models'
                  : 'Provision an enterprise tenant workspace with full ML intelligence'}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '0.78rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>[ERROR]</span> {error}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!isLogin && (
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.68rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      letterSpacing: '0.06em',
                      marginBottom: '6px',
                      textTransform: 'uppercase'
                    }}
                  >
                    00 // Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User
                      size={15}
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 255, 255, 0.4)'
                      }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Alex Mercer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 40px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#10b981';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.68rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    letterSpacing: '0.06em',
                    marginBottom: '6px',
                    textTransform: 'uppercase'
                  }}
                >
                  01 // Corporate Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={15}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(255, 255, 255, 0.4)'
                    }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="name@enterprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 40px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.68rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  >
                    02 // Access Key / Password
                  </label>
                  {isLogin && (
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.65rem',
                        color: 'rgba(255, 255, 255, 0.4)',
                        cursor: 'pointer'
                      }}
                    >
                      Default: password123
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={15}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(255, 255, 255, 0.4)'
                    }}
                  />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 40px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    }}
                  />
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="hover-lift"
                style={{
                  marginTop: '8px',
                  width: '100%',
                  padding: '13px',
                  backgroundColor: '#ffffff',
                  color: '#05070c',
                  border: 'none',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px -4px rgba(255, 255, 255, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In to Workspace' : 'Initialize Workspace'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  margin: '4px 0',
                  color: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem' }}>OR INSTANT</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              </div>

              {/* 1-Click Instant Demo Button */}
              <button
                type="button"
                onClick={handle1ClickDemo}
                className="hover-lift"
                style={{
                  width: '100%',
                  padding: '11px',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '9999px',
                  color: '#34d399',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Sparkles size={14} />
                <span>⚡ 1-Click Instant Demo Access (Pre-filled)</span>
              </button>
            </form>

            {/* Bottom Security Badges */}
            <div
              style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.62rem',
                color: 'rgba(255, 255, 255, 0.45)',
                letterSpacing: '0.04em'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} style={{ color: '#10b981' }} />
                SOC2 TYPE II
              </span>
              <span>•</span>
              <span>256-BIT ENCRYPTED</span>
              <span>•</span>
              <span>ZERO LEAKAGE</span>
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Footer Terminal Status */}
      <footer
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 32px 24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.68rem',
          color: 'rgba(255, 255, 255, 0.4)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '16px'
        }}
      >
        <div>
          © 2026 AI Powered Sales Intelligence Forecasting Inc. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>LATENCY: 42MS</span>
          <span>REGION: GLOBAL_EDGE</span>
          <span>STATUS: ALL SYSTEMS NOMINAL</span>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
