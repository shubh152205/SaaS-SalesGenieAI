import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Sparkles,
  Send,
  Flame,
  TrendingUp,
  Cpu,
  Plus,
  RefreshCw,
  CheckCircle2,
  Sliders,
  DollarSign,
  ChevronDown,
  Layers,
  Radar,
  Activity,
  Target,
  X,
  Building2
} from 'lucide-react';
import api from '../api/client';
import Navbar from '../components/Navbar';
import TextToSpeechPlayer from '../components/TextToSpeechPlayer';

const LeadIntelligence = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [similarDeals, setSimilarDeals] = useState([]);
  const [mlScoreBreakdown, setMlScoreBreakdown] = useState(null);
  const [scoringLeadId, setScoringLeadId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);
  const [formError, setFormError] = useState('');

  const [newLeadForm, setNewLeadForm] = useState({
    company_name: '',
    contact_name: '',
    designation: 'VP of Engineering',
    email: '',
    phone: '+1-555-0199',
    industry: 'Software / B2B SaaS',
    company_size: 'Medium',
    annual_revenue: '$20M ARR',
    location: 'San Francisco, CA',
    funding_stage: 'Series B',
    tech_stack: 'Python, React, AWS, PostgreSQL',
    deal_value: 85000,
    website_visits: 16,
    email_opens: 10,
    demo_requested: 1,
    stage: 'New Lead',
    status: 'Open',
    notes: 'Evaluating automated sales intelligence and ML deal forecasting.'
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async (selectId = null) => {
    try {
      setLoading(true);
      const res = await api.get('/api/crm/leads?limit=50');
      const items = res.data.items || [];
      setLeads(items);
      if (items.length > 0) {
        if (selectId) {
          const match = items.find((l) => l.id === selectId) || items[0];
          handleSelectLead(match);
        } else if (!selectedLead) {
          handleSelectLead(items[0]);
        }
      }
    } catch (err) {
      console.warn('Leads fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!newLeadForm.company_name.trim() || !newLeadForm.contact_name.trim()) {
      setFormError('Please provide both Company Name and Primary Contact Name.');
      return;
    }

    setSubmittingLead(true);
    setFormError('');
    try {
      const payload = {
        ...newLeadForm,
        deal_value: Number(newLeadForm.deal_value) || 50000,
        website_visits: Number(newLeadForm.website_visits) || 0,
        email_opens: Number(newLeadForm.email_opens) || 0,
        demo_requested: Number(newLeadForm.demo_requested) || 0,
        tech_stack: newLeadForm.tech_stack
          ? newLeadForm.tech_stack.split(',').map((t) => t.trim()).filter(Boolean)
          : ['Python', 'AWS']
      };

      const res = await api.post('/api/crm/leads', payload);
      setShowAddModal(false);
      
      // Reset form
      setNewLeadForm({
        company_name: '',
        contact_name: '',
        designation: 'VP of Engineering',
        email: '',
        phone: '+1-555-0199',
        industry: 'Software / B2B SaaS',
        company_size: 'Medium',
        annual_revenue: '$20M ARR',
        location: 'San Francisco, CA',
        funding_stage: 'Series B',
        tech_stack: 'Python, React, AWS, PostgreSQL',
        deal_value: 85000,
        website_visits: 16,
        email_opens: 10,
        demo_requested: 1,
        stage: 'New Lead',
        status: 'Open',
        notes: 'Evaluating automated sales intelligence and ML deal forecasting.'
      });

      // Refresh and select newly created lead
      await fetchLeads(res.data.id);
    } catch (err) {
      console.error('Create lead error', err);
      setFormError(err.response?.data?.detail || 'Failed to create lead. Please check inputs.');
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleSelectLead = async (lead) => {
    setSelectedLead(lead);
    try {
      // Fetch ML Similar deals and score breakdown
      const [simRes, scoreRes] = await Promise.all([
        api.get(`/api/ml/similar-deals/${lead.id}`).catch(() => ({ data: { similar_deals: [] } })),
        api.post('/api/ml/score-lead', {
          website_visits: lead.website_visits || 8,
          email_opens: lead.email_opens || 4,
          demo_requested: lead.demo_requested || 1,
          funding_stage: lead.funding_stage || 'Series B',
          deal_value: lead.deal_value || 120000
        }).catch(() => ({ data: { score: lead.lead_score, conversion_probability: (lead.lead_score / 100).toFixed(2), intent_tier: 'High' } }))
      ]);
      setSimilarDeals(simRes.data.similar_deals || []);
      setMlScoreBreakdown(scoreRes.data);
    } catch (err) {
      console.warn('Lead intelligence error', err);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchSearch =
      l.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.contact_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchInd = industryFilter ? l.industry === industryFilter : true;
    return matchSearch && matchInd;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar
        title="Lead Intelligence & Intent Scoring"
        subtitle="SaaS AI Powered Sales Intelligence Forecasting — 120-Tree Random Forest Prediction & Cosine Vector Similarity Matching"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        

        {/* Top Control Bar */}
        <div className="tail-card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderRadius: 'var(--radius-xl)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', flex: 1 }}>
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search across 50+ pre-seeded leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="tail-input"
                style={{ paddingLeft: '40px', height: '44px', fontSize: '0.9375rem' }}
              />
            </div>

            {/* Industry Filter Dropdown */}
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="select-field"
              style={{ width: 'auto', minWidth: '200px', height: '44px', fontSize: '0.9375rem' }}
            >
              <option value="">All Industries</option>
              <option value="Software / B2B SaaS">Software / B2B SaaS</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Cloud Infrastructure">Cloud Infrastructure</option>
              <option value="FinTech SaaS">FinTech SaaS</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-indigo" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
              {filteredLeads.length} Profiles Loaded
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 700, height: '44px', padding: '0 18px', fontSize: '0.88rem' }}
            >
              <Plus size={16} />
              <span>Add New Company</span>
            </button>
            <button
              onClick={() => fetchLeads()}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 600, height: '44px', padding: '0 16px', fontSize: '0.88rem' }}
            >
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>
          </div>

        </div>

        {/* Main Grid: Leads Directory vs ML Deep Dive Inspector */}
        <div className="lead-intelligence-grid">
          
          {/* Left Column: Leads Table */}
          <div className="tail-card animate-entrance" style={{ padding: '0px', overflow: 'hidden', minWidth: 0, borderRadius: 'var(--radius-xl)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} style={{ color: 'var(--brand-500)' }} />
                <h3 className="text-title-sm">B2B Account Directory</h3>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>Pre-Seeded 50+</span>
            </div>

            <div className="table-container" style={{ maxHeight: '680px', overflowX: 'auto', overflowY: 'auto', border: 'none', width: '100%' }}>
              <table className="tail-table tail-table-compact" style={{ width: '100%', minWidth: '580px' }}>
                <thead>
                  <tr>
                    <th style={{ minWidth: '180px' }}>Account & Contact</th>
                    <th style={{ minWidth: '120px' }}>Industry</th>
                    <th style={{ minWidth: '85px' }}>Deal Value</th>
                    <th style={{ minWidth: '80px' }}>ML Score</th>
                    <th style={{ minWidth: '85px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => {
                    const isSelected = selectedLead?.id === lead.id;
                    const isHot = lead.lead_score >= 80;
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => handleSelectLead(lead)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <td>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.96rem' }}>
                              {lead.company_name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {lead.contact_name} ({lead.email})
                            </div>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                            {lead.industry}
                          </span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 800, color: 'var(--success-500)', fontSize: '0.96rem', fontVariantNumeric: 'tabular-nums' }}>
                            ${(lead.deal_value || 0).toLocaleString()}
                          </span>
                        </td>

                        <td>
                          <span className={`badge ${isHot ? 'badge-rose' : lead.lead_score >= 60 ? 'badge-cyan' : 'badge-indigo'}`} style={{ fontSize: '0.8rem', padding: '3px 8px', fontWeight: 700 }}>
                            {lead.lead_score} / 100
                          </span>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/outreach', { state: { lead } });
                            }}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '6px 12px', fontSize: '0.82rem', gap: '5px', whiteSpace: 'nowrap', fontWeight: 700 }}
                          >
                            <Send size={13} />
                            <span>Outreach</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: ML Deep Dive Panel */}
          {selectedLead ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Selected Account Card */}
              <div className="tail-card tail-card-glow animate-entrance" style={{ borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span className="badge badge-indigo" style={{ marginBottom: '8px', fontSize: '0.8rem' }}>
                      {selectedLead.funding_stage || 'Series B'}
                    </span>
                    <h3 className="text-title-lg" style={{ fontWeight: 900, letterSpacing: '-0.025em' }}>{selectedLead.company_name}</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Contact: {selectedLead.contact_name} • {selectedLead.email}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1, color: selectedLead.lead_score >= 80 ? '#f43f5e' : 'var(--brand-500)' }}>
                      {selectedLead.lead_score}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginTop: '4px' }}>
                      Intent Score
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px', background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Website Visits</div>
                    <div style={{ fontWeight: 800, fontSize: '1.08rem' }}>{selectedLead.website_visits || 12} views</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Email Opens</div>
                    <div style={{ fontWeight: 800, fontSize: '1.08rem' }}>{selectedLead.email_opens || 6} opens</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Deal Value</div>
                    <div style={{ fontWeight: 900, fontSize: '1.08rem', color: 'var(--success-500)' }}>${(selectedLead.deal_value || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Conversion Probability</div>
                    <div style={{ fontWeight: 900, fontSize: '1.08rem', color: 'var(--brand-500)' }}>
                      {mlScoreBreakdown ? `${(mlScoreBreakdown.conversion_probability * 100).toFixed(0)}%` : `${selectedLead.lead_score}%`}
                    </div>
                  </div>
                </div>

                {/* Text-to-Speech Voice Briefing */}
                <div style={{ marginBottom: '18px' }}>
                  <TextToSpeechPlayer
                    text={`Account briefing for ${selectedLead.company_name}. In the ${selectedLead.industry} sector, contact person is ${selectedLead.contact_name}. Estimated deal value is $${(selectedLead.deal_value || 0).toLocaleString()} with funding tier ${selectedLead.funding_stage || 'Series B'}. Machine learning intent score is ${selectedLead.lead_score} out of 100 with high closing probability. Recommended next step: Deploy tailored NVIDIA NIM cold outreach to key stakeholders.`}
                    title={`AI Audio Brief: ${selectedLead.company_name}`}
                    label="Listen to Account Briefing"
                    variant="full"
                  />
                </div>

                <button
                  onClick={() => navigate('/outreach', { state: { lead: selectedLead } })}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '0.96rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Sparkles size={18} />
                  <span>Draft NVIDIA NIM Outreach for {selectedLead.company_name}</span>
                </button>
              </div>

              {/* Similar Won Deals Vector Matcher */}
              <div className="tail-card animate-entrance" style={{ borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={18} style={{ color: 'var(--info-500)' }} />
                    <h3 className="text-title-sm">Cosine Vector Similar Won Deals</h3>
                  </div>
                  <button
                    onClick={() => handleSelectLead(selectedLead)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RefreshCw size={12} />
                    <span>Recalculate</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {similarDeals.length > 0 ? (
                    similarDeals.map((deal, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          background: 'var(--bg-card-subtle)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{deal.company_name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            {deal.industry} • ${(deal.deal_value || 0).toLocaleString()}
                          </div>
                        </div>
                        <span className="badge badge-cyan" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                          {(deal.similarity_score * 100).toFixed(0)}% Match
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                      No vectorized matches found for current criteria.
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="tail-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                Select a lead on the left to view ML insights
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── Add New Company Lead Modal ── */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div
            className="tail-card"
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-2xl)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--card)',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(79, 70, 229, 0.12)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--foreground)' }}>
                    Add New Company Lead
                  </h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', margin: '2px 0 0' }}>
                    Enter company parameters to trigger real-time Random Forest scoring & deal benchmarking
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted-foreground)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontSize: '0.8125rem',
                marginBottom: '16px'
              }}>
                {formError}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleCreateLead} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Row 1: Company Name & Contact Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Cloud Systems"
                    value={newLeadForm.company_name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, company_name: e.target.value })}
                    className="tail-input"
                    style={{ height: '38px', width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>
                    Primary Decision Maker *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={newLeadForm.contact_name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, contact_name: e.target.value })}
                    className="tail-input"
                    style={{ height: '38px', width: '100%' }}
                  />
                </div>
              </div>

              {/* Row 2: Designation & Work Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>
                    Job Title / Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CTO / VP Engineering"
                    value={newLeadForm.designation}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, designation: e.target.value })}
                    className="tail-input"
                    style={{ height: '38px', width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. sarah@acmecloud.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="tail-input"
                    style={{ height: '38px', width: '100%' }}
                  />
                </div>
              </div>

              {/* Row 3: Industry & Company Size */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>
                    Industry Sector
                  </label>
                  <select
                    value={newLeadForm.industry}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, industry: e.target.value })}
                    className="select-field"
                    style={{ height: '38px', width: '100%' }}
                  >
                    <option value="Software / B2B SaaS">Software / B2B SaaS</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="FinTech SaaS">FinTech SaaS</option>
                    <option value="Cybersecurity SaaS">Cybersecurity SaaS</option>
                    <option value="Data Infrastructure">Data Infrastructure</option>
                    <option value="Developer Tools">Developer Tools</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>
                    Company Scale / Funding
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <select
                      value={newLeadForm.company_size}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, company_size: e.target.value })}
                      className="select-field"
                      style={{ height: '38px' }}
                    >
                      <option value="Small">Small (1-50)</option>
                      <option value="Medium">Medium (50-250)</option>
                      <option value="Enterprise">Enterprise (250+)</option>
                    </select>

                    <select
                      value={newLeadForm.funding_stage}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, funding_stage: e.target.value })}
                      className="select-field"
                      style={{ height: '38px' }}
                    >
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B">Series B</option>
                      <option value="Series C">Series C</option>
                      <option value="Series D">Series D</option>
                      <option value="Public">Public</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 4: Deal Value & Telemetry (Visits & Opens) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>
                    Target Deal Value ($)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    placeholder="95000"
                    value={newLeadForm.deal_value}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, deal_value: e.target.value })}
                    className="tail-input"
                    style={{ height: '38px', width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>
                    Website Views
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newLeadForm.website_visits}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, website_visits: e.target.value })}
                    className="tail-input"
                    style={{ height: '38px', width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>
                    Email Opens
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newLeadForm.email_opens}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email_opens: e.target.value })}
                    className="tail-input"
                    style={{ height: '38px', width: '100%' }}
                  />
                </div>
              </div>

              {/* Row 5: Demo Requested Checkbox & Tech Stack */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>
                  Tech Stack (comma-separated tags)
                </label>
                <input
                  type="text"
                  placeholder="Python, React, AWS, PostgreSQL, Kafka, Snowflake"
                  value={newLeadForm.tech_stack}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, tech_stack: e.target.value })}
                  className="tail-input"
                  style={{ height: '38px', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                <input
                  type="checkbox"
                  id="demoReqCheck"
                  checked={newLeadForm.demo_requested === 1}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, demo_requested: e.target.checked ? 1 : 0 })}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <label htmlFor="demoReqCheck" style={{ fontSize: '0.8125rem', color: 'var(--foreground)', cursor: 'pointer' }}>
                  Prospect has submitted a <strong>Demo Request</strong> (+24 Intent Boost)
                </label>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>
                  Sales & Opportunity Notes
                </label>
                <textarea
                  rows="2"
                  placeholder="Key pain points, current vendor bottlenecks, team expansion..."
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="tail-input"
                  style={{ width: '100%', resize: 'none', padding: '8px 12px' }}
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '9px 18px', fontSize: '0.88rem', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLead}
                  className="btn btn-primary"
                  style={{ padding: '9px 22px', fontSize: '0.92rem', fontWeight: 750, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Sparkles size={16} />
                  <span>{submittingLead ? 'Scoring Lead...' : 'Save & Score with ML'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LeadIntelligence;
