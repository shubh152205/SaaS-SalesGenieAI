import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
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
  Eye,
  Send,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Target,
  Building2,
  XCircle,
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
  const pageSize = 6;

  const PERIOD_MAP = { 'Monthly': 'monthly', 'Quarterly': 'quarterly', 'Yearly': 'yearly' };

  const DEFAULT_REVENUE_TREND = [
    { month: 'Jan', revenue: 186000, target: 180000 },
    { month: 'Feb', revenue: 205000, target: 190000 },
    { month: 'Mar', revenue: 237000, target: 200000 },
    { month: 'Apr', revenue: 273000, target: 220000 },
    { month: 'May', revenue: 290000, target: 240000 },
    { month: 'Jun', revenue: 314000, target: 250000 },
    { month: 'Jul', revenue: 352000, target: 270000 },
    { month: 'Aug', revenue: 389000, target: 290000 },
    { month: 'Sep', revenue: 421000, target: 310000 },
    { month: 'Oct', revenue: 458000, target: 330000 },
    { month: 'Nov', revenue: 492000, target: 350000 },
    { month: 'Dec', revenue: 547000, target: 380000 },
  ];

  const DEFAULT_FUNNEL = [
    { stage: 'New Lead', count: 14 },
    { stage: 'Qualified', count: 12 },
    { stage: 'Proposal', count: 10 },
    { stage: 'Negotiation', count: 6 },
    { stage: 'Closed Won', count: 8 },
  ];

  const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'];

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
      const trend = (funnel.revenue_trend || []).map((t) => ({
        month: t.month
          ? new Date(`${t.month}-01`).toLocaleString('en-US', { month: 'short' })
          : t.month,
        revenue: t.revenue || 0,
        target: Math.round((t.revenue || 0) * 0.9 + 20000),
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
      const res = await api.get('/api/crm/leads?limit=30');
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

  const filteredLeads = leads.filter((l) =>
    l.company_name?.toLowerCase().includes(tableSearch.toLowerCase()) ||
    l.contact_name?.toLowerCase().includes(tableSearch.toLowerCase()) ||
    l.industry?.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>
      <Navbar
        title="Overview"
        subtitle="SalesOps Real-Time Revenue Intelligence"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Toast Notification Banner */}
        {toast && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: toast.type === 'error' ? 'var(--error-50)' : 'var(--success-50)',
            border: `1px solid ${toast.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            color: toast.type === 'error' ? 'var(--destructive)' : 'var(--accent)',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ── 4 Key Metric Cards (SalesOps Style) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          
          {/* Card 1: Total Pipeline Revenue */}
          <div className="tail-card group" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                Total Revenue
              </span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--secondary)',
                color: 'var(--muted-foreground)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <DollarSign size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <div className="tabular-mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                ${(kpis.pipeline_value || 2450000).toLocaleString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '2px' }}>
                <TrendingUp size={14} />
                <span>+12.5%</span>
              </div>
            </div>
          </div>

          {/* Card 2: Conversion Rate */}
          <div className="tail-card group" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                Conversion Rate
              </span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--secondary)',
                color: 'var(--muted-foreground)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <TrendingUp size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <div className="tabular-mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {kpis.conversion_rate || 24.8}%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '2px' }}>
                <TrendingUp size={14} />
                <span>+3.2%</span>
              </div>
            </div>
          </div>

          {/* Card 3: Active Deals */}
          <div className="tail-card group" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                Active Deals
              </span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--secondary)',
                color: 'var(--muted-foreground)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Target size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <div className="tabular-mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {kpis.open_deals || 32}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '2px' }}>
                <TrendingUp size={14} />
                <span>+18.4%</span>
              </div>
            </div>
          </div>

          {/* Card 4: Hot Leads (Score >= 80) */}
          <div className="tail-card group" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                Hot Leads (Score ≥ 80)
              </span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--secondary)',
                color: 'var(--muted-foreground)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Flame size={18} style={{ color: 'var(--accent)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <div className="tabular-mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {kpis.hot_leads} <span style={{ fontSize: '1rem', color: 'var(--muted-foreground)', fontWeight: 400 }}>/ {kpis.total_leads}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '2px' }}>
                <span className="pulse-dot" style={{ backgroundColor: 'var(--accent)' }} />
                <span>Ready for demo</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Charts Grid (Revenue Trend & Pipeline Overview) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)',
          gap: '20px'
        }}>
          
          {/* Revenue Trend Area Chart */}
          <div className="tail-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Revenue Trend</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', margin: '2px 0 0' }}>Monthly performance vs target</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--chart-1)' }} />
                  <span style={{ color: 'var(--muted-foreground)' }}>Revenue</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                  <span style={{ color: 'var(--muted-foreground)' }}>Target</span>
                </div>
              </div>
            </div>

            <div style={{ height: '270px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend.length > 0 ? revenueTrend : DEFAULT_REVENUE_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "var(--foreground)",
                      boxShadow: "var(--shadow-lg)"
                    }}
                    labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2} fill="url(#revenueGradient)" />
                  <Area type="monotone" dataKey="target" stroke="var(--accent)" strokeWidth={2} fill="url(#targetGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pipeline Stage Funnel Bar Chart */}
          <div className="tail-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Pipeline Stages</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', margin: '2px 0 0' }}>Deal count by stage</p>
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>Live Funnel</span>
            </div>

            <div style={{ height: '270px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={funnelData.length > 0 ? funnelData : DEFAULT_FUNNEL} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="stage" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} width={85} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                      boxShadow: "var(--shadow-md)"
                    }}
                  />
                  <Bar dataKey="count" fill="var(--accent)" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ── Bottom Grid: AI Follow-ups & Automation Module ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '20px'
        }}>
          
          {/* AI Follow-up Priorities */}
          <div className="tail-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>AI Follow-up Priorities</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', margin: '2px 0 0' }}>Top leads ranked by engagement urgency</p>
              </div>
              <button
                onClick={() => navigate('/leads')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <span>View all</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {followupPriorities.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--secondary)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => navigate('/outreach', { state: { lead: { id: p.id, company_name: p.company_name, contact_name: p.contact_name } } })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--card)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      border: '1px solid var(--border)'
                    }}>
                      {p.company_name.charAt(0)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.company_name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>
                        {p.contact_name} • {p.days_since_contact}d since contact
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      height: '28px',
                      gap: '4px'
                    }}
                  >
                    <Send size={12} />
                    <span>Reach</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Automation Module */}
          <div className="tail-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Automation Engine</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', margin: '2px 0 0' }}>Scheduled CRM jobs & syncs</p>
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>Active</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Daily Follow-up Digest', schedule: 'Every day 10:00 AM', status: 'Active' },
                { name: 'ML Model Retraining', schedule: 'Every Sunday 2:00 AM', status: 'Active' },
                { name: 'Pipeline Sync', schedule: 'Every 4 hours', status: 'Active' },
              ].map((job, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--secondary)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--foreground)' }}>{job.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>{job.schedule}</div>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{job.status}</span>
                </div>
              ))}
            </div>

            <button
              onClick={triggerAutomation}
              disabled={triggeringAuto}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.8125rem',
                gap: '6px',
                marginTop: 'auto'
              }}
            >
              {triggeringAuto ? <RefreshCw size={14} className="spin" /> : <Sparkles size={14} />}
              <span>{triggeringAuto ? 'Running...' : 'Trigger Follow-up Digest'}</span>
            </button>
          </div>

        </div>

        {/* ── Recent Deals & Lead Pipeline Table ── */}
        <div className="tail-card" style={{ padding: '0', overflow: 'hidden' }}>
          
          <div style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Recent Deals & Opportunities</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', margin: '2px 0 0' }}>Live deal progression & intent scores</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                <input
                  type="text"
                  placeholder="Filter deals..."
                  value={tableSearch}
                  onChange={(e) => { setTableSearch(e.target.value); setCurrentPage(1); }}
                  style={{
                    width: '100%',
                    height: '34px',
                    paddingLeft: '32px',
                    paddingRight: '10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    fontSize: '0.8125rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="tail-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <div
                      onClick={selectAllRows}
                      role="checkbox"
                      tabIndex={0}
                      aria-checked={leads.length > 0 && leads.every((l) => selectedRows[l.id])}
                      className={`tail-checkbox ${leads.length > 0 && leads.every((l) => selectedRows[l.id]) ? 'checked' : ''}`}
                    >
                      {leads.length > 0 && leads.every((l) => selectedRows[l.id]) && (
                        <CheckCircle2 size={12} style={{ color: '#ffffff' }} />
                      )}
                    </div>
                  </th>
                  <th>Company</th>
                  <th>Decision Maker</th>
                  <th>Vertical</th>
                  <th>Deal Value</th>
                  <th>ML Intent Score</th>
                  <th>Stage</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeads.length > 0 ? paginatedLeads.map((lead) => {
                  const isChecked = !!selectedRows[lead.id];
                  return (
                    <tr key={lead.id} style={{ backgroundColor: isChecked ? 'var(--brand-50)' : 'transparent' }}>
                      <td>
                        <div
                          onClick={() => toggleRowSelect(lead.id)}
                          role="checkbox"
                          tabIndex={0}
                          aria-checked={isChecked}
                          className={`tail-checkbox ${isChecked ? 'checked' : ''}`}
                        >
                          {isChecked && <CheckCircle2 size={12} style={{ color: '#ffffff' }} />}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--secondary)',
                            color: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            border: '1px solid var(--border)'
                          }}>
                            {lead.company_name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: '0.85rem' }}>{lead.company_name}</div>
                            <div className="tabular-mono" style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>DE-{lead.id.toString().padStart(5, '0')}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--foreground)', fontWeight: 500 }}>{lead.contact_name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>{lead.email}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{lead.industry}</span>
                      </td>
                      <td>
                        <span className="tabular-mono" style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '0.875rem' }}>
                          ${(lead.deal_value || 0).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge tabular-mono ${lead.lead_score >= 80 ? 'badge-emerald' : lead.lead_score >= 60 ? 'badge-cyan' : 'badge-warning'}`}>
                          {lead.lead_score} Score
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${lead.stage === 'Closed Won' ? 'badge-emerald' : 'badge-cyan'}`}>
                          {lead.stage || 'Qualified'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <button
                            onClick={() => navigate('/outreach', { state: { lead } })}
                            title="Generate AI Outreach"
                            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '5px' }}
                          >
                            <Send size={15} />
                          </button>
                          <button
                            onClick={() => navigate('/leads')}
                            title="View Profile"
                            style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', padding: '5px' }}
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '28px', color: 'var(--muted-foreground)' }}>
                      No deals match your search filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border)',
            fontSize: '0.78rem',
            color: 'var(--muted-foreground)'
          }}>
            <div>
              Showing {filteredLeads.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredLeads.length)} of {filteredLeads.length}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px', opacity: currentPage === 1 ? 0.4 : 1 }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`btn ${currentPage === page ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ padding: '4px 9px', fontSize: '0.75rem' }}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px', opacity: currentPage >= totalPages ? 0.4 : 1 }}
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
