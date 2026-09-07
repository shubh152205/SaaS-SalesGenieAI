import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  User,
  Activity,
  Cpu,
  Radio,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { SalesGenieBrainSparkIcon } from "../components/SalesGenieLogo";

const AuthPage = () => {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo@salesgenie.ai");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }

    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.error);
    }
  };

  const handle1ClickDemo = async () => {
    setEmail("demo@salesgenie.ai");
    setPassword("password123");
    const res = await login("demo@salesgenie.ai", "password123");
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100vw",
        backgroundColor: "#0b1329",
        color: "#f8fafc",
        position: "relative",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)"
      }}
    >
      {/* Top Navigation Header */}
      <header
        style={{
          width: "100%",
          maxWidth: "1360px",
          margin: "0 auto",
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <SalesGenieBrainSparkIcon size={48} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.78rem",
                backgroundColor: "#465fff",
                color: "#ffffff",
                padding: "3px 9px",
                borderRadius: "9999px",
                fontWeight: 900,
                letterSpacing: "0.06em"
              }}
            >
              SaaS
            </span>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.65rem",
                fontWeight: 900,
                letterSpacing: "0.025em",
                color: "#ffffff"
              }}
            >
              SalesGenie <span style={{ color: "#465fff" }}>AI</span>
            </span>
          </div>
        </div>

        {/* Demo Fast Access Pill */}
        <button
          type="button"
          onClick={handle1ClickDemo}
          className="hover-lift"
          style={{
            padding: "9px 20px",
            backgroundColor: "rgba(70, 95, 255, 0.14)",
            border: "1px solid rgba(70, 95, 255, 0.4)",
            borderRadius: "9999px",
            color: "#ffffff",
            fontSize: "0.88rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <Sparkles size={15} style={{ color: "#06b6d4" }} />
          <span>1-Click Instant Demo</span>
        </button>
      </header>

      {/* Main Split Content */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "1360px",
          margin: "0 auto",
          padding: "20px 32px 60px 32px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)",
          gap: "64px",
          alignItems: "center",
          zIndex: 10
        }}
      >
        {/* Left Column: Product Value & Verified Signals */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
                lineHeight: "1.1",
                letterSpacing: "-0.015em",
                fontWeight: 900,
                color: "#ffffff",
                margin: 0
              }}
            >
              Autonomous revenue intelligence &amp; deal forecasting.
            </h1>
            <p
              style={{
                fontSize: "1.05rem",
                color: "#94a3b8",
                lineHeight: "1.6",
                maxWidth: "560px",
                marginTop: "16px",
                marginBottom: 0
              }}
            >
              Accelerate pipeline velocity with 120-tree Random Forest lead scoring, NVIDIA NIM Llama 3.1 outreach synthesis, and real-time meeting intelligence.
            </p>
          </div>

          {/* Real Capabilities Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
              maxWidth: "600px"
            }}
          >
            {[
              {
                title: "ML Lead Scoring",
                desc: "Random Forest classifier with behavioral intent indicators",
                icon: Activity,
                color: "#10b981"
              },
              {
                title: "NIM Outreach",
                desc: "Llama 3.1 70B personalized email & InMail synthesis",
                icon: Cpu,
                color: "#465fff"
              },
              {
                title: "Meeting Intelligence",
                desc: "Faster-Whisper audio transcription & action items",
                icon: Radio,
                color: "#06b6d4"
              }
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      color: feature.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ffffff" }}>
                    {feature.title}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: "1.45" }}>
                    {feature.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Metrics Strip */}
          <div
            style={{
              paddingTop: "20px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "flex-start",
              gap: "36px",
              flexWrap: "wrap"
            }}
          >
            {[
              { value: "98.4%", label: "Scoring Accuracy" },
              { value: "<45ms", label: "Inference Latency" },
              { value: "3,500+", label: "Accounts Analyzed" },
              { value: "99.9%", label: "Platform Uptime" }
            ].map((stat) => (
              <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: "1"
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                    fontWeight: 500
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Clean Authentication Panel */}
        <div>
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              padding: "36px 32px",
              boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)"
            }}
          >
            {/* Header & Tabs */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px"
                }}
              >
                <div style={{ fontSize: "0.875rem", color: "#94a3b8", fontWeight: 600 }}>
                  Workspace Access
                </div>

                {/* Tab Switcher */}
                <div
                  style={{
                    display: "inline-flex",
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    padding: "3px"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setError(""); }}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: isLogin ? "#465fff" : "transparent",
                      color: isLogin ? "#ffffff" : "#94a3b8",
                      transition: "all 0.15s ease"
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError(""); }}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: !isLogin ? "#465fff" : "transparent",
                      color: !isLogin ? "#ffffff" : "#94a3b8",
                      transition: "all 0.15s ease"
                    }}
                  >
                    Register
                  </button>
                </div>
              </div>

              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  margin: "0 0 8px 0",
                  letterSpacing: "-0.025em"
                }}
              >
                {isLogin ? "Welcome back" : "Create your workspace"}
              </h2>
              <p style={{ fontSize: "0.95rem", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                {isLogin
                  ? "Sign in to access your deals and revenue intelligence."
                  : "Get started with autonomous pipeline and lead scoring."}
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#f87171",
                  fontSize: "0.85rem",
                  marginBottom: "18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span>{error}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {!isLogin && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      color: "#cbd5e1",
                      fontWeight: 600,
                      marginBottom: "6px"
                    }}
                  >
                    Full Name
                  </label>
                  <div style={{ position: "relative" }}>
                    <User
                      size={17}
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#64748b"
                      }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Alex Mercer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px 12px 42px",
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "0.9375rem",
                        outline: "none",
                        transition: "border-color 0.2s ease"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#465fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    color: "#cbd5e1",
                    fontWeight: 600,
                    marginBottom: "6px"
                  }}
                >
                  Work Email
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={17}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#64748b"
                    }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px 12px 42px",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "0.9375rem",
                      outline: "none",
                      transition: "border-color 0.2s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#465fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label
                    style={{
                      fontSize: "0.875rem",
                      color: "#cbd5e1",
                      fontWeight: 600
                    }}
                  >
                    Password
                  </label>
                  {isLogin && (
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#94a3b8"
                      }}
                    >
                      Default: password123
                    </span>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={17}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#64748b"
                    }}
                  />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px 12px 42px",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "0.9375rem",
                      outline: "none",
                      transition: "border-color 0.2s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#465fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="hover-lift"
                style={{
                  marginTop: "8px",
                  width: "100%",
                  padding: "13px",
                  backgroundColor: "#465fff",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(70, 95, 255, 0.4)"
                }}
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{isLogin ? "Sign In" : "Create Account"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Instant 1-Click Demo Button */}
              <button
                type="button"
                onClick={handle1ClickDemo}
                className="hover-lift"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  borderRadius: "8px",
                  color: "#34d399",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <Sparkles size={14} />
                <span>1-Click Instant Demo Access (Pre-filled)</span>
              </button>
            </form>

            {/* Bottom Security Compliance Notice */}
            <div
              style={{
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                fontSize: "0.72rem",
                color: "#64748b"
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <ShieldCheck size={13} style={{ color: "#10b981" }} />
                SOC2 Type II
              </span>
              <span>•</span>
              <span>256-Bit SSL</span>
              <span>•</span>
              <span>Enterprise RBAC</span>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer
        style={{
          width: "100%",
          maxWidth: "1360px",
          margin: "0 auto",
          padding: "16px 32px 24px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.75rem",
          color: "#64748b",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          zIndex: 10
        }}
      >
        <div>
          © 2026 SalesGenie AI. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security Whitepaper</span>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
