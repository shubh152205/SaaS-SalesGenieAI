import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Kanban,
  DollarSign,
  Plus,
  ArrowRight,
  MoreVertical,
  Send,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Radar,
  ShieldCheck,
  FileSignature,
  Handshake,
  Trophy,
  Award,
  Zap,
  TrendingUp,
  Clock,
  Layers,
  Filter
} from 'lucide-react';
import api from '../api/client';
import Navbar from '../components/Navbar';
import pipelineVelocityImg from '../assets/pipeline_velocity.jpg';

const DealPipeline = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'hot' | 'high_value'

  const STAGES = [
    {
      key: 'New Lead',
      title: 'New Inbound Leads',
      sub: 'AI Signal & Ingestion',
      color: '#6366f1',
      badge: 'badge-indigo',
      icon: Radar,
      bgGrad: 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, transparent 100%)',
      stageClass: 'kanban-stage-new-lead',
      cardClass: 'deal-card-stage-lead'
    },
    {
      key: 'Qualified',
      title: 'Discovery & Qualified',
      sub: 'Intent & BANT Verified',
      color: '#06b6d4',
      badge: 'badge-cyan',
      icon: ShieldCheck,
      bgGrad: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08) 0%, transparent 100%)',
      stageClass: 'kanban-stage-qualified',
      cardClass: 'deal-card-stage-qualified'
    },
    {
      key: 'Proposal',
      title: 'Proposal & Pitch',
      sub: 'NIM Custom Deck Sent',
      color: '#f59e0b',
      badge: 'badge-amber',
      icon: FileSignature,
      bgGrad: 'linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, transparent 100%)',
      stageClass: 'kanban-stage-proposal',
      cardClass: 'deal-card-stage-proposal'
    },
    {
      key: 'Negotiation',
      title: 'Executive Negotiation',
      sub: 'Legal & Procurement',
      color: '#a855f7',
      badge: 'badge-purple',
      icon: Handshake,
      bgGrad: 'linear-gradient(180deg, rgba(168, 85, 247, 0.08) 0%, transparent 100%)',
      stageClass: 'kanban-stage-negotiation',
      cardClass: 'deal-card-stage-negotiation'
    },
    {
      key: 'Closed Won',
      title: 'Closed Won & Booked',
      sub: 'ARR Contract Signed',
      color: '#10b981',
      badge: 'badge-emerald',
      icon: Trophy,
      bgGrad: 'linear-gradient(180deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)',
      stageClass: 'kanban-stage-won',
      cardClass: 'deal-card-stage-won'
    },
  ];

  useEffect(() => {
    fetchPipeline();
  }, []);

  const fetchPipeline = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/crm/pipeline');
      setPipelineData(res.data.pipeline || []);
    } catch (err) {
      console.warn('Pipeline fetch fallback', err);
    } finally {
      setLoading(false);
    }
  };

  const advanceDeal = async (dealId, currentStage) => {
    const stageIndex = STAGES.findIndex((s) => s.key === currentStage);
    if (stageIndex < STAGES.length - 1) {
      const nextStage = STAGES[stageIndex + 1].key;
      try {
        await api.patch(`/api/crm/deals/${dealId}/stage`, { stage: nextStage });
        fetchPipeline();
      } catch (err) {
        console.warn('Deal advance error', err);
      }
    }
  };

  const totalValue = pipelineData.reduce((acc, stage) => {
    const stageSum = (stage.deals || []).reduce((s, d) => s + (d.deal_value || 0), 0);
    return acc + stageSum;
  }, 0);

  const totalDealsCount = pipelineData.reduce((acc, stage) => acc + (stage.deals || []).length, 0);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Deal Pipeline & Opportunity Kanban"
        subtitle="SaaS-SalesGenie AI Autonomous Opportunity Routing & Multi-Stage Kanban"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Visual Velocity Hero Banner */}
        <div className="tail-card image-banner-strip glow-card" style={{ height: '140px' }}>
          <img src={pipelineVelocityImg} alt="Pipeline Velocity Visual" />
          <div className="image-banner-overlay">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                color: '#ffffff',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.45)'
              }}>
                <Kanban size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    High-Velocity Revenue Funnel
                  </h2>
                  <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                    +34% MoM Velocity
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', margin: '4px 0 0' }}>
                  Autonomous lead stage progression with ML intent triggers & NVIDIA NIM engagement scoring.
                </p>
              </div>
            </div>

            {/* Quick Filter Pill Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setFilterMode('all')}
                className={`btn btn-sm ${filterMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                All Deals ({totalDealsCount})
              </button>
              <button
                onClick={() => setFilterMode('hot')}
                className={`btn btn-sm ${filterMode === 'hot' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Flame size={13} style={{ color: '#f43f5e' }} />
                <span>Hot Leads (≥80)</span>
              </button>
              <button
                onClick={() => setFilterMode('high_value')}
                className={`btn btn-sm ${filterMode === 'high_value' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <DollarSign size={13} style={{ color: '#10b981' }} />
                <span>Enterprise (&gt;$50k)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Top KPI & Action Bar */}
        <div className="tail-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <span className="text-theme-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                Total Active Pipeline Value
              </span>
              <div className="text-title-lg" style={{ color: 'var(--text-main)', marginTop: '2px', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>
                ${(totalValue || 2950000).toLocaleString()}
              </div>
            </div>

            <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />

            <div>
              <span className="text-theme-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                Avg Cycle Velocity
              </span>
              <div className="text-title-lg" style={{ color: 'var(--success-500)', marginTop: '2px', fontWeight: 900 }}>
                14.2 Days
              </div>
            </div>

            <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />

            <div>
              <span className="text-theme-xs" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                Win Rate Probability
              </span>
              <div className="text-title-lg" style={{ color: 'var(--brand-500)', marginTop: '2px', fontWeight: 900 }}>
                78.6%
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => navigate('/leads')}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            >
              <Plus size={15} />
              <span>Import Deal from Lead Radar</span>
            </button>
          </div>
        </div>

        {/* 5-Column Differentiated Kanban Board */}
        <div className="kanban-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: '14px',
          width: '100%',
          alignItems: 'start'
        }}>
          {STAGES.map((stage) => {
            const StageIcon = stage.icon;
            const currentStageData = pipelineData.find((p) => p.stage === stage.key) || { deals: [] };
            let rawDeals = currentStageData.deals || [];

            // Apply filter
            if (filterMode === 'hot') {
              rawDeals = rawDeals.filter((d) => (d.lead_score || 0) >= 80);
            } else if (filterMode === 'high_value') {
              rawDeals = rawDeals.filter((d) => (d.deal_value || 0) >= 50000);
            }

            const stageTotal = rawDeals.reduce((acc, d) => acc + (d.deal_value || 0), 0);

            return (
              <div
                key={stage.key}
                className="animate-entrance"
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  minHeight: '620px',
                  minWidth: 0,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                  position: 'relative'
                }}
              >
                {/* Stage Header with Industry-Grade Icon */}
                <div className={`kanban-stage-header ${stage.stageClass}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: `${stage.color}1f`,
                      color: stage.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <StageIcon size={16} />
                    </div>
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <div style={{
                        fontWeight: 800,
                        fontSize: '0.84rem',
                        color: 'var(--text-main)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {stage.title}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {stage.sub}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                    <span className={`badge ${stage.badge}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                      {rawDeals.length}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                      ${(stageTotal / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>

                {/* Deal Cards Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: 0 }}>
                  {rawDeals.map((deal) => {
                    const isHot = (deal.lead_score || 0) >= 80;
                    return (
                      <div
                        key={deal.id}
                        className={`deal-card ${stage.cardClass}`}
                      >
                        {/* Company & Score */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                          <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                            <div style={{
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              color: 'var(--text-main)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }} title={deal.company_name}>
                              {deal.company_name}
                            </div>
                            <div style={{
                              fontSize: '0.72rem',
                              color: 'var(--text-muted)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              marginTop: '2px'
                            }}>
                              {deal.contact_name}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                            {isHot && (
                              <span title="High Intent Hot Lead" style={{ color: '#f43f5e' }}>
                                <Flame size={14} />
                              </span>
                            )}
                            <span
                              className={`badge ${isHot ? 'badge-rose' : 'badge-indigo'}`}
                              style={{ fontSize: '0.65rem', padding: '2px 6px', fontWeight: 700 }}
                            >
                              {deal.lead_score} ML
                            </span>
                          </div>
                        </div>

                        {/* Deal Value & Industry */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontWeight: 900, fontSize: '0.92rem', color: 'var(--success-500)', fontVariantNumeric: 'tabular-nums' }}>
                            ${(deal.deal_value || 0).toLocaleString()}
                          </span>
                          <span style={{
                            fontSize: '0.68rem',
                            color: 'var(--text-dim)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textAlign: 'right',
                            fontWeight: 500
                          }} title={deal.industry}>
                            {deal.industry}
                          </span>
                        </div>

                        {/* Interactive Card Action Bar */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid var(--border-subtle)',
                          paddingTop: '8px',
                          marginTop: '2px'
                        }}>
                          <button
                            onClick={() => navigate('/outreach', { state: { lead: deal } })}
                            title="Generate AI Outreach Pitch"
                            style={{
                              background: 'rgba(79, 70, 229, 0.08)',
                              border: '1px solid rgba(79, 70, 229, 0.2)',
                              color: 'var(--brand-500)',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer',
                              padding: '3px 8px',
                              borderRadius: '6px'
                            }}
                          >
                            <Sparkles size={12} />
                            <span>AI Pitch</span>
                          </button>

                          {stage.key !== 'Closed Won' ? (
                            <button
                              onClick={() => advanceDeal(deal.id, stage.key)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 8px', fontSize: '0.7rem', height: '24px', display: 'flex', alignItems: 'center', gap: '4px' }}
                              title="Advance Deal to Next Stage"
                            >
                              <span>Next Stage</span>
                              <ArrowRight size={11} />
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: 'var(--success-500)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={13} />
                              <span>Booked</span>
                            </span>
                          )}
                        </div>

                      </div>
                    );
                  })}

                  {rawDeals.length === 0 && (
                    <div style={{ padding: '36px 12px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.78rem', fontStyle: 'italic', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                      No deals currently in this stage
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default DealPipeline;
