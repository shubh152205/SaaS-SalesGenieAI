import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Users,
  Flame,
  ArrowUpRight,
  Sparkles,
  AudioWaveform,
  Kanban,
  Activity,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Trash2,
  Eye,
  Send,
  RefreshCw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  X
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import api from '../api/client';
import Navbar from '../components/Navbar';
import dashboardHeroImg from '../assets/login_hero.jpg';

const Dashboard = ({ collapsed, setCollapsed }) => {

  const navigate = useNavigate();
  const [kpis, setKpis] = useState({
    total_leads: 50,
    hot_leads: 18,
    conversion_rate: 28.4,
    pipeline_value: 2450000,
    avg_deal_value: 115000,
    open_deals: 32,
    avg_response_time: 2.4,
    avg_sales_cycle: 28,
    won_leads: 0,
    lost_leads: 0,
  });
  const [funnelData, setFunnelData] = useState([]);
  const [industryData, setIndustryData] = useState([]);
  const [leads, setLeads] = useState([]);
  const [followupPriorities, setFollowupPriorities] = useState([]);
  const [automationStatus, setAutomationStatus] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('Monthly');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState({});
  const [triggeringAuto, setTriggeringAuto] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const PERIOD_MAP = { 'Monthly': 'monthly', 'Quarterly': 'quarterly', 'Yearly': 'yearly' };

  useEffect(() => {
    fetchDashboardData();
    fetchLeads();
    fetchFollowupPriorities();
    fetchActivityFeed();
  }, [timeframe]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const period = PERIOD_MAP[timeframe] || 'monthly';
      const [kpiRes, funnelRes] = await Promise.all([
        api.get(`/api/dashboard/kpis?period=${period}`),
        api.get(`/api/dashboard/funnel?period=${period}`),
      ]);
      setKpis(kpiRes.data);
      const funnel = funnelRes.data;
      setFunnelData(funnel.funnel || []);
      setIndustryData(funnel.industry_distribution || []);
      // M4: Real revenue trend from the backend funnel endpoint (fallback to demo data)
      const trend = (funnel.revenue_trend || []).map((t) => ({
        name: t.month
          ? new Date(`${t.month}-01`).toLocaleString('en-US', { month: 'short' })
          : t.month,
        revenue: t.revenue || 0,
        deals: t.deals || 0,
      }));
      setRevenueTrend(trend.length > 0 ? trend : DEFAULT_REVENUE_TREND);
    } catch (err) {
      console.warn('Dashboard fetch fallback', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await api.get('/api/crm/leads?limit=25');
      setLeads(res.data.items || []);
    } catch (err) {
      console.warn('Leads fetch error', err);
    }
  };

  const fetchFollowupPriorities = async () => {
    try {
      const res = await api.get('/api/dashboard/followup-priorities?limit=6');
      setFollowupPriorities(res.data.priorities || []);
    } catch (err) {
      console.warn('Followup priorities fetch error', err);
    }
  };

  const fetchActivityFeed = async () => {
    try {
      const res = await api.get('/api/dashboard/activity-feed?limit=10');
      setActivityFeed(res.data || []);
    } catch (err) {
      console.warn('Activity feed fetch error', err);
    }
  };

  const formatActivityTime = (ts) => {
    if (!ts) return '';
    const parsed = new Date(String(ts).replace(' ', 'T'));
    if (Number.isNaN(parsed.getTime())) return ts;
    return parsed.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const ACTIVITY_META = {
    lead: { icon: <UserPlus size={15} />, bg: 'rgba(70, 95, 255, 0.1)', color: 'var(--brand-500)' },
    outreach: { icon: <Send size={15} />, bg: 'var(--success-50)', color: 'var(--success-600)' },
    meeting: { icon: <AudioWaveform size={15} />, bg: 'var(--info-50)', color: 'var(--info-600)' },
    pipeline: { icon: <Kanban size={15} />, bg: 'var(--warning-50)', color: 'var(--warning-600)' },
    ml: { icon: <Sparkles size={15} />, bg: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' },
    automation: { icon: <RefreshCw size={15} />, bg: 'var(--success-50)', color: 'var(--success-600)' },
  };

  const activityMeta = (type) => ACTIVITY_META[type] || {
    icon: <Activity size={15} />,
    bg: 'var(--bg-card-subtle)',
    color: 'var(--text-muted)',
  };

  const triggerAutomation = async () => {
    setTriggeringAuto(true);
    try {
      const res = await api.post('/api/dashboard/automation/trigger-followup');
      setAutomationStatus(res.data);
      setToast({ message: res.data.message || 'Follow-up digest triggered successfully!', type: 'success' });
    } catch (err) {
      console.warn('Automation trigger error', err);
      setToast({ message: 'Automation service unavailable. Please check backend connection.', type: 'error' });
    } finally {
      setTriggeringAuto(false);
    }
  };

  const toggleRowSelect = (id) => {
    setSelectedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAllRows = () => {
    const allSelected = leads.every((l) => selectedRows[l.id]);
    if (allSelected) {
      setSelectedRows({});
    } else {
      const newSel = {};
      leads.forEach((l) => { newSel[l.id] = true; });
      setSelectedRows(newSel);
    }
  };

  const DEFAULT_REVENUE_TREND = [
    { name: 'Jan', revenue: 140000, deals: 8 },
    { name: 'Feb', revenue: 210000, deals: 12 },
    { name: 'Mar', revenue: 180000, deals: 10 },
    { name: 'Apr', revenue: 290000, deals: 16 },
    { name: 'May', revenue: 340000, deals: 19 },
    { name: 'Jun', revenue: 420000, deals: 24 },
    { name: 'Jul', revenue: 390000, deals: 22 },
    { name: 'Aug', revenue: 480000, deals: 27 },
  ];

  const DEFAULT_FUNNEL = [
    { stage: 'New Lead', count: 14 },
    { stage: 'Qualified', count: 12 },
    { stage: 'Proposal', count: 10 },
    { stage: 'Negotiation', count: 6 },
    { stage: 'Closed Won', count: 8 },
  ];

  const COLORS = ['#465fff', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const filteredLeads = leads.filter((l) =>
    l.company_name?.toLowerCase().includes(tableSearch.toLowerCase()) ||
    l.contact_name?.toLowerCase().includes(tableSearch.toLowerCase()) ||
    l.industry?.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Executive Sales Dashboard"
        subtitle="SaaS-SalesGenie AI Real-Time Revenue Intelligence & Predictive Lead Velocity"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Executive Hero Banner Showcase */}
        <div className="tail-card image-banner-strip glow-card" style={{ height: '140px' }}>
          <img src={dashboardHeroImg} alt="SaaS-SalesGenie AI Intelligence" />
          <div className="image-banner-overlay">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                color: '#ffffff',
                boxShadow: '0 4px 16px rgba(79, 70, 229, 0.45)'
              }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    SaaS-SalesGenie AI Command Hub
                  </h2>
                  <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                    120-Tree ML Active
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', margin: '4px 0 0' }}>
                  Real-time pipeline analytics, NVIDIA NIM cold outreach generation, and audio intelligence.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => navigate('/outreach')}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.75rem', padding: '7px 14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={14} />
                <span>Launch AI Outreach</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Toast Notification Banner ── */}

        {toast && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: toast.type === 'error' ? 'var(--error-50)' : 'var(--success-50)',
            border: `1px solid ${toast.type === 'error' ? 'var(--error-100)' : 'var(--success-100)'}`,
            color: toast.type === 'error' ? 'var(--error-600)' : 'var(--success-600)',
            fontSize: '0.875rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ── Dashboard Period Filters (M4: This Month / Quarter / Year) ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="text-title-sm" style={{ marginBottom: '2px', letterSpacing: '-0.01em' }}>Executive Sales Dashboard</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>B2B SaaS Pipeline Intelligence • RandomForest ML Scoring • NVIDIA NIM</p>
          </div>
          <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            {['Monthly', 'Quarterly', 'Yearly'].map((tf) => (
              <button
                key={tf}
                onClick={() => { setTimeframe(tf); setCurrentPage(1); }}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  background: timeframe === tf ? 'var(--brand-500)' : 'transparent',
                  color: timeframe === tf ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: timeframe === tf ? '0 1px 3px rgba(70, 95, 255, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* ── 6-Card KPI Row (M4 Milestone: Pipeline, Hot Leads, Conversion, Avg Deal, Avg Response Time, Avg Sales Cycle) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {/* KPI 1: Pipeline Value */}
          <div className="tail-card" style={{ transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="text-theme-sm" style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Pipeline Value
                </span>
                <div className="text-title-xl" style={{ marginTop: '8px', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                  ${(kpis.pipeline_value || 2450000).toLocaleString()}
                </div>
              </div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(70, 95, 255, 0.12)',
                color: 'var(--brand-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <DollarSign size={24} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
              <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpRight size={13} />
                <span>+24.5%</span>
              </span>
              <span className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>From last month</span>
            </div>
          </div>

          {/* KPI 2: Hot Leads */}
          <div className="tail-card" style={{ transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="text-theme-sm" style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Hot Leads (Score ≥ 80)
                </span>
                <div className="text-title-xl" style={{ marginTop: '8px', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                  {kpis.hot_leads} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {kpis.total_leads}</span>
                </div>
              </div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--error-50)',
                color: 'var(--error-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Flame size={24} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
              <span className="pulse-dot" />
              <span className="text-theme-xs" style={{ color: 'var(--error-500)', fontWeight: 600 }}>{kpis.hot_leads} Ready for Immediate Demo</span>
            </div>
          </div>

          {/* KPI 3: ML Conversion Rate */}
          <div className="tail-card" style={{ transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="text-theme-sm" style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ML Conversion Rate
                </span>
                <div className="text-title-xl" style={{ marginTop: '8px', color: 'var(--success-500)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                  {kpis.conversion_rate}%
                </div>
              </div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--success-50)',
                color: 'var(--success-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <TrendingUp size={24} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
              <span className="badge badge-brand" style={{ fontSize: '0.7rem' }}>RandomForest 100 Trees</span>
            </div>
          </div>

          {/* KPI 4: Active Open Deals */}
          <div className="tail-card" style={{ transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="text-theme-sm" style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Avg Deal Size (ACV)
                </span>
                <div className="text-title-xl" style={{ marginTop: '8px', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                  ${(kpis.avg_deal_value || 115000).toLocaleString()}
                </div>
              </div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--info-50)',
                color: 'var(--info-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Kanban size={24} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{kpis.open_deals} Active Deals</span>
            </div>
          </div>

          {/* KPI 5: Avg Response Time (M4) */}
          <div className="tail-card" style={{ transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="text-theme-sm" style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Avg Response Time</span>
                <div className="text-title-xl" style={{ marginTop: '8px', color: 'var(--brand-500)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                  {kpis.avg_response_time || 2.4}h
                </div>
              </div>
              <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-lg)', backgroundColor: 'rgba(70,95,255,0.1)', color: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={22} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>-18% vs last month</span>
            </div>
          </div>

          {/* KPI 6: Avg Sales Cycle (M4) */}
          <div className="tail-card" style={{ transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="text-theme-sm" style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Avg Sales Cycle</span>
                <div className="text-title-xl" style={{ marginTop: '8px', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                  {kpis.avg_sales_cycle || 28} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>days</span>
                </div>
              </div>
              <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--warning-50)', color: 'var(--warning-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Activity size={22} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Industry Avg: 42 days</span>
            </div>
          </div>
        </div>

        {/* ── M4: AI Powered Insight Strip (top 3 follow-up priorities) ── */}
        <div className="tail-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--brand-500) 0%, #06b6d4 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(70, 95, 255, 0.3)'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>AI Powered Follow-up Priorities</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Top 3 leads ranked by days-since-contact urgency</div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px', minWidth: 0 }}>
            {followupPriorities.slice(0, 3).map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-subtle)',
                  minWidth: 0,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onClick={() => navigate('/outreach', { state: { lead: { id: p.id, company_name: p.company_name, contact_name: p.contact_name } } })}
              >
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: p.urgency_color, flexShrink: 0 }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.company_name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.days_since_contact}d since contact • {p.action_label || p.recommended_action}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <span className="badge badge-brand" style={{ flexShrink: 0, fontSize: '0.7rem' }}>🤖 ML Engine</span>
        </div>

        {/* ── Middle Section: Charts & Analytics Grid ── */}
        <div className="analytics-grid">
          
          {/* Chart 1: Revenue Velocity Area Chart with Timeframe Controls */}
          <div className="tail-card" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="text-title-md" style={{ letterSpacing: '-0.01em' }}>Monthly Revenue & Velocity</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                  Target Account Pipeline Growth & Deal Closures
                </p>
              </div>
              <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>{timeframe}</span>
            </div>

            <div style={{ height: '280px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend.length > 0 ? revenueTrend : DEFAULT_REVENUE_TREND}>
                  <defs>
                    <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#465fff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#465fff" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-medium)',
                      borderRadius: '12px',
                      color: 'var(--text-main)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '10px 14px'
                    }}
                    itemStyle={{ color: 'var(--brand-500)', fontWeight: 600 }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Pipeline Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#465fff" strokeWidth={3} fillOpacity={1} fill="url(#brandGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: SaaS Verticals Donut Distribution */}
          <div className="tail-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="text-title-md" style={{ letterSpacing: '-0.01em' }}>SaaS Verticals</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>Lead Pipeline Industry Mix</p>
              </div>
              <span className="badge badge-brand">Active</span>
            </div>

            <div style={{ height: '220px', width: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryData.length > 0 ? industryData : [
                      { industry: 'Software / B2B SaaS', count: 18 },
                      { industry: 'Artificial Intelligence', count: 12 },
                      { industry: 'Cloud Infrastructure', count: 9 },
                      { industry: 'FinTech SaaS', count: 7 },
                      { industry: 'Cybersecurity', count: 4 }
                    ]}
                    dataKey="count"
                    nameKey="industry"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {(industryData.length > 0 ? industryData : [1, 2, 3, 4, 5]).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-medium)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
              {(industryData.length > 0 ? industryData.slice(0, 4) : [
                { industry: 'Software / B2B SaaS' },
                { industry: 'Artificial Intelligence' },
                { industry: 'Cloud Infrastructure' },
                { industry: 'FinTech SaaS' }
              ]).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length], flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.industry}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 3: Pipeline Stage Distribution Bar Chart (M4) */}
          <div className="tail-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="text-title-md" style={{ letterSpacing: '-0.01em' }}>Pipeline Stage Distribution</h3>
                <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>Deal counts across funnel stages</p>
              </div>
              <span className="badge badge-brand">Live</span>
            </div>

            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={funnelData.length > 0 ? funnelData : DEFAULT_FUNNEL}
                  margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
                  <XAxis type="number" stroke="var(--text-dim)" fontSize={12} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="stage" stroke="var(--text-dim)" fontSize={12} tickLine={false} width={92} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-medium)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      boxShadow: 'var(--shadow-md)'
                    }}
                    cursor={{ fill: 'rgba(70, 95, 255, 0.06)' }}
                  />
                  <Bar dataKey="count" fill="#465fff" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ── M4: AI Follow-up Recommendation Engine + Automation Module ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: '20px' }}>

          {/* Left: AI Prescriptive Follow-up Priority Panel */}
          <div className="tail-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(70,95,255,0.1)', color: 'var(--brand-500)' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-title-sm" style={{ letterSpacing: '-0.01em' }}>AI Follow-up Priority Engine</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Days-since-contact classification: High Priority / Phone Call / Reminder</p>
                </div>
              </div>
              <span className="badge badge-brand" style={{ fontSize: '0.7rem' }}>🤖 AI Powered</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {followupPriorities.length > 0 ? followupPriorities.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: p.urgency_color, flexShrink: 0, boxShadow: `0 0 6px ${p.urgency_color}88` }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.8375rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.company_name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.contact_name} • {p.days_since_contact}d since contact</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: p.urgency_color, whiteSpace: 'nowrap' }}>{p.recommended_action}</span>
                    <button
                      onClick={() => navigate('/outreach', { state: { lead: { id: p.id, company_name: p.company_name, contact_name: p.contact_name } } })}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '5px' }}
                      aria-label={`Send outreach to ${p.company_name}`}
                    >
                      <Send size={12} /> Outreach
                    </button>
                  </div>
                </div>
              )) : (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  {loading ? 'Analyzing lead urgency & engagement telemetry...' : 'All priority follow-ups are up to date.'}
                </div>
              )}
            </div>
          </div>

          {/* Right: Automation Module Card */}
          <div className="tail-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--success-50)', color: 'var(--success-600)' }}>
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-title-sm" style={{ letterSpacing: '-0.01em' }}>Automation Module</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scheduled follow-ups & CRM syncs</p>
              </div>
            </div>
            {[
              { name: 'Daily Follow-up Digest', schedule: 'Every day 10:00 AM', status: 'Active' },
              { name: 'ML Model Retraining', schedule: 'Every Sunday 2:00 AM', status: 'Active' },
              { name: 'CRM Daily Report', schedule: 'Every day 6:00 AM', status: 'Active' },
              { name: 'Pipeline Stage Sync', schedule: 'Every 4 hours', status: 'Active' },
            ].map((job, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>{job.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{job.schedule}</div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                  {job.status}
                </span>
              </div>
            ))}
            {automationStatus && (
              <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--success-50)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success-600)' }}>✓ {automationStatus.message}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {automationStatus.breakdown?.high_priority_emails ?? 0} high priority •
                  {' '}{automationStatus.breakdown?.phone_call_reminders ?? 0} phone calls •
                  {' '}{automationStatus.breakdown?.reminder_emails ?? 0} reminders
                </div>
              </div>
            )}
            <button
              onClick={triggerAutomation}
              disabled={triggeringAuto}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', marginTop: '4px', opacity: triggeringAuto ? 0.75 : 1 }}
            >
              {triggeringAuto ? <RefreshCw size={14} className="spin" /> : <Sparkles size={14} />}
              <span>{triggeringAuto ? 'Running Automation...' : 'Trigger Follow-up Digest Now'}</span>
            </button>
          </div>
        </div>

        {/* ── M4: Real-time Activity Feed ── */}
        <div className="tail-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--info-50)', color: 'var(--info-600)' }}>
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-title-sm" style={{ letterSpacing: '-0.01em' }}>Real-time Activity Feed</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live CRM events, ML scoring & automation runs</p>
              </div>
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot" /> Live
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activityFeed.length > 0 ? activityFeed.map((item, idx) => {
              const meta = activityMeta(item.entity_type);
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px 0',
                    borderBottom: idx < activityFeed.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: meta.bg,
                    color: meta.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8375rem', color: 'var(--text-main)' }}>{item.action}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.details}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {formatActivityTime(item.created_at)}
                  </span>
                </div>
              );
            }) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                {loading ? 'Syncing activity stream...' : 'No recent activity recorded.'}
              </div>
            )}
          </div>
        </div>

        {/* ── Table Four: TailAdmin CRM Leads & Opportunities Table ── */}

        <div className="tail-card" style={{ padding: '0px', overflow: 'hidden' }}>
          
          {/* Table Header Controls */}
          <div style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div>
              <h3 className="text-title-md" style={{ letterSpacing: '-0.01em' }}>Recent B2B Leads & Deals</h3>
              <p className="text-theme-xs" style={{ color: 'var(--text-muted)' }}>
                Viewing top scored enterprise prospects & conversion stages
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Search input */}
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  placeholder="Search leads, companies..."
                  value={tableSearch}
                  onChange={(e) => { setTableSearch(e.target.value); setCurrentPage(1); }}
                  className="tail-input"
                  style={{ paddingLeft: '36px', height: '38px', fontSize: '0.8125rem' }}
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => navigate('/leads')}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Filter size={14} />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Table Element */}
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="tail-table">
              <thead>
                <tr>
                  <th style={{ width: '48px' }}>
                    <div
                      onClick={selectAllRows}
                      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); selectAllRows(); } }}
                      role="checkbox"
                      tabIndex={0}
                      aria-checked={leads.length > 0 && leads.every((l) => selectedRows[l.id])}
                      aria-label="Select all rows"
                      className={`tail-checkbox ${leads.length > 0 && leads.every((l) => selectedRows[l.id]) ? 'checked' : ''}`}
                    >
                      {leads.length > 0 && leads.every((l) => selectedRows[l.id]) && (
                        <CheckCircle2 size={13} style={{ color: '#ffffff' }} />
                      )}
                    </div>
                  </th>
                  <th>Deal ID & Account</th>
                  <th>Decision Maker</th>
                  <th>Industry / Vertical</th>
                  <th>Pipeline Value</th>
                  <th>ML Intent Score</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeads.length > 0 ? paginatedLeads.map((lead) => {
                  const isChecked = !!selectedRows[lead.id];
                  const initials = lead.contact_name
                    ? lead.contact_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    : 'AC';

                  return (
                    <tr key={lead.id} style={{ backgroundColor: isChecked ? 'rgba(70, 95, 255, 0.06)' : 'transparent' }}>
                      <td>
                        <div
                          onClick={() => toggleRowSelect(lead.id)}
                          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleRowSelect(lead.id); } }}
                          role="checkbox"
                          tabIndex={0}
                          aria-checked={isChecked}
                          aria-label={`Select lead ${lead.company_name}`}
                          className={`tail-checkbox ${isChecked ? 'checked' : ''}`}
                        >
                          {isChecked && <CheckCircle2 size={13} style={{ color: '#ffffff' }} />}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--brand-50)',
                            color: 'var(--brand-500)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.78rem'
                          }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                              {lead.company_name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              DE-{lead.id.toString().padStart(5, '0')}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                            {lead.contact_name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {lead.email}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          {lead.industry}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--success-500)', fontVariantNumeric: 'tabular-nums' }}>
                          ${(lead.deal_value || 0).toLocaleString()}
                        </span>
                      </td>

                      <td>
                        <span className={`badge ${lead.lead_score >= 80 ? 'badge-hot' : lead.lead_score >= 60 ? 'badge-qualified' : 'badge-brand'}`}>
                          {lead.lead_score} Score
                        </span>
                      </td>

                      <td>
                        <span className={`badge ${lead.stage === 'Closed Won' ? 'badge-complete' : lead.lead_score >= 80 ? 'badge-hot' : 'badge-pending'}`}>
                          {lead.stage || 'Qualified'}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => navigate('/outreach', { state: { lead } })}
                            title="Generate AI Outreach"
                            aria-label={`Generate AI Outreach for ${lead.company_name}`}
                            style={{ background: 'none', border: 'none', color: 'var(--brand-500)', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                          >
                            <Send size={15} />
                          </button>
                          <button
                            onClick={() => navigate('/leads')}
                            title="View Full Profile"
                            aria-label={`View full profile for ${lead.company_name}`}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No leads match your search filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div style={{
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)'
          }}>
            <div>
              Showing {filteredLeads.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredLeads.length)} of {filteredLeads.length} leads
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 10px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`btn ${currentPage === page ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ padding: '6px 12px' }}
                  onClick={() => setCurrentPage(page)}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 10px', opacity: currentPage >= totalPages ? 0.5 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
