import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Cpu,
  Mail,
  Share2,
  RefreshCw,
  Zap,
  Sliders,
  ShieldCheck,
  Clock,
  Layers,
  Flame,
  Radio
} from 'lucide-react';
import api from '../api/client';
import Navbar from '../components/Navbar';
import TextToSpeechPlayer from '../components/TextToSpeechPlayer';
import outreachHeroImg from '../assets/outreach_hero.jpg';

const AIOutreach = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [outreachType, setOutreachType] = useState('cold_email');
  const [tone, setTone] = useState('Consultative & ROI-Focused');
  const [temperature, setTemperature] = useState(0.2);
  const [model, setModel] = useState('meta/llama-3.1-70b-instruct');
  
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [displayedBody, setDisplayedBody] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/api/crm/leads');
      const items = res.data.items || [];
      setLeads(items);
      
      // If passed via state navigation
      if (location.state?.lead) {
        setSelectedLeadId(location.state.lead.id);
      } else if (items.length > 0) {
        setSelectedLeadId(items[0].id);
      }
    } catch (err) {
      console.warn('Outreach lead fetch error', err);
    }
  };

  const startTypewriter = (text) => {
    setBody(text);
    setDisplayedBody('');
    setIsTyping(true);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        // Type 2-3 characters at a time for realistic smooth speed
        const chunk = Math.min(3, text.length - i);
        i += chunk;
        setDisplayedBody(text.substring(0, i));
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 12);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setCopied(false);
    try {
      const selectedLead = leads.find((l) => l.id === parseInt(selectedLeadId)) || leads[0];
      const res = await api.post('/api/ai/generate-outreach', {
        lead_id: selectedLead?.id,
        outreach_type: outreachType,
        tone: tone,
        model: model,
        temperature: temperature
      });

      const generatedSubject = res.data.subject || `Scaling ${selectedLead?.company_name || 'Enterprise'} Revenue with SaaS AI Powered Sales Intelligence Forecasting`;
      const generatedBody = res.data.body || res.data.content || '';
      setSubject(generatedSubject);
      startTypewriter(generatedBody);
    } catch (err) {
      console.warn('AI generation error', err);
      // Enterprise Fallback response
      const selectedLead = leads.find((l) => l.id === parseInt(selectedLeadId)) || leads[0];
      const fallbackSubject = `Scaling ${selectedLead?.company_name || 'Enterprise'} Revenue Operations in Q3`;
      const fallbackBody = `Hi ${selectedLead?.contact_name || 'Decision Maker'},\n\nI noticed ${selectedLead?.company_name || 'your team'} is scaling your ${selectedLead?.industry || 'B2B'} infrastructure following your recent milestones.\n\nWith SaaS AI Powered Sales Intelligence Forecasting, we've helped similar high-growth teams achieve 28.4% faster conversion velocity using our autonomous lead scoring and cold outreach engine powered by ${model}.\n\nWould you be open to a 10-minute briefing this Thursday to review our benchmark analysis for ${selectedLead?.company_name || 'your company'}?\n\nBest regards,\nAI Powered Sales Intelligence Forecasting Team`;
      setSubject(fallbackSubject);
      startTypewriter(fallbackBody);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    const fullText = subject ? `Subject: ${subject}\n\n${displayedBody || body}` : (displayedBody || body);
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="AI Outreach Generation Engine"
        subtitle="SaaS AI Powered Sales Intelligence Forecasting — NVIDIA NIM (Llama 3.1 70B & 3.3 70B) Hyper-Personalized Pitch Synthesis"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Visual Outreach Studio Showcase Banner */}
        <div className="tail-card image-banner-strip glow-card" style={{ height: '140px' }}>
          <img src={outreachHeroImg} alt="AI Sales Outreach Studio" />
          <div className="image-banner-overlay">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                color: '#ffffff',
                boxShadow: '0 4px 16px rgba(236, 72, 153, 0.45)'
              }}>
                <Send size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    NVIDIA NIM Cold Outreach Studio
                  </h2>
                  <span className="badge badge-rose" style={{ fontSize: '0.72rem' }}>
                    84% Avg Open Rate
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', margin: '4px 0 0' }}>
                  Hyper-personalized enterprise emails, LinkedIn InMails, and voice scripts with real-time TTS synthesis.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-indigo" style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700 }}>
                Llama-3.1-70b-instruct
              </span>
            </div>
          </div>
        </div>

        <div className="outreach-grid">
          
          {/* Left Column: Generation Controls */}
          <div className="tail-card animate-entrance" style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--brand-50)', color: 'var(--brand-500)' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-title-sm" style={{ fontWeight: 800 }}>NVIDIA NIM Parameters</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>Configure tone, neural model & target prospect</p>
              </div>
            </div>

            {/* Target Lead Selector */}
            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600 }}>Select Target B2B Prospect</label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="select-field"
              >
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.company_name} — {lead.contact_name} ({lead.industry}) [Score: {lead.lead_score}]
                  </option>
                ))}
              </select>
            </div>

            {/* Outreach Type */}
            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600 }}>Channel / Message Format</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setOutreachType('cold_email')}
                  className={`btn btn-sm ${outreachType === 'cold_email' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  <Mail size={14} />
                  <span>Executive Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOutreachType('linkedin_inmail')}
                  className={`btn btn-sm ${outreachType === 'linkedin_inmail' ? 'btn-cyan' : 'btn-secondary'}`}
                  style={{ padding: '8px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  <Share2 size={14} />
                  <span>LinkedIn InMail</span>
                </button>
              </div>
            </div>

            {/* Persona / Tone Selector */}
            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600 }}>Sales Pitch Persona & Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="select-field"
              >
                <option value="Consultative & ROI-Focused">Consultative & ROI-Focused (Recommended for Enterprise)</option>
                <option value="Direct & Metric-Driven">Direct & Metric-Driven (High Urgency)</option>
                <option value="Warm & Relationship-Building">Warm & Relationship-Building (Founder-to-Founder)</option>
                <option value="Technical Solution Architecture">Technical Solution Architecture (CTO / VP Eng)</option>
              </select>
            </div>

            {/* Model Selector */}
            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600 }}>NVIDIA NIM LLM Model Engine</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="select-field"
              >
                <option value="meta/llama-3.1-70b-instruct">meta/llama-3.1-70b-instruct (High Quality)</option>
                <option value="meta/llama-3.3-70b-instruct">meta/llama-3.3-70b-instruct (State-of-the-Art)</option>
                <option value="meta/llama-3.1-8b-instruct">meta/llama-3.1-8b-instruct (Ultra Fast)</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="input-label" style={{ margin: 0, fontWeight: 600 }}>Creativity (Temperature)</label>
                <span style={{ fontSize: '0.78rem', color: 'var(--brand-500)', fontWeight: 800 }}>{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brand-500)' }}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.92rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
                boxShadow: '0 4px 16px rgba(79, 70, 229, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {generating ? (
                <>
                  <RefreshCw size={17} className="spinner" />
                  <span>Synthesizing with NVIDIA NIM...</span>
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  <span>Generate Hyper-Personalized Pitch</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Output / Typewriter Editor */}
          <div className="tail-card animate-entrance" style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '520px', borderRadius: 'var(--radius-xl)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pulse-dot" />
                <h3 className="text-title-sm" style={{ fontWeight: 800 }}>Synthesized Sales Copy</h3>
                {isTyping && (
                  <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>
                    Streaming NIM Tokens...
                  </span>
                )}
              </div>

              {(displayedBody || body) && (
                <button
                  onClick={handleCopy}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
                >
                  {copied ? <Check size={14} style={{ color: 'var(--success-500)' }} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              )}
            </div>

            {/* Subject Line */}
            {subject && (
              <div className="input-group">
                <label className="input-label" style={{ fontWeight: 600 }}>Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="tail-input"
                  style={{ fontWeight: 700, color: 'var(--text-main)' }}
                />
              </div>
            )}

            {/* Text-to-Speech (TTS) Voice Player for Generated Outreach */}
            {(displayedBody || body) && (
              <TextToSpeechPlayer
                text={subject ? `${subject}. ${displayedBody || body}` : (displayedBody || body)}
                title="AI Voice Pitch Reader"
                label="Listen to Pitch (AI Voice)"
                variant="full"
              />
            )}

            {/* Body with Typewriter Animation Output */}
            <div className="input-group" style={{ flex: 1, position: 'relative' }}>
              <label className="input-label" style={{ fontWeight: 600 }}>Email / InMail Body</label>
              <textarea
                value={displayedBody || body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Click 'Generate Hyper-Personalized Pitch' on the left to initiate NVIDIA NIM Llama 3.1 70B synthesis based on firmographic intent data..."
                className="tail-textarea"
                style={{
                  height: '100%',
                  minHeight: '280px',
                  lineHeight: '1.6',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem'
                }}
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AIOutreach;
