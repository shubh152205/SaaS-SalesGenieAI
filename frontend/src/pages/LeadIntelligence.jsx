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
  Layers
} from 'lucide-react';
import api from '../api/client';
import Navbar from '../components/Navbar';

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

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/crm/leads');
      setLeads(res.data.items || []);
      if (res.data.items && res.data.items.length > 0) {
        handleSelectLead(res.data.items[0]);
      }
    } catch (err) {
      console.warn('Leads fetch error', err);
    } finally {
      setLoading(false);
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
        subtitle="RandomForest (120 Trees) Prediction & Cosine Vector Similarity Matching"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Top Control Bar */}
        <div className="tail-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', flex: 1 }}>
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '280px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search across 50+ pre-seeded leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="tail-input"
                style={{ paddingLeft: '36px', height: '40px' }}
              />
            </div>

            {/* Industry Filter Dropdown */}
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="select-field"
              style={{ width: 'auto', minWidth: '180px', height: '40px' }}
            >
              <option value="">All Industries</option>
              <option value="Software / B2B SaaS">Software / B2B SaaS</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Cloud Infrastructure">Cloud Infrastructure</option>
              <option value="FinTech SaaS">FinTech SaaS</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-brand">
              {filteredLeads.length} Profiles Loaded
            </span>
            <button
              onClick={fetchLeads}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>

        </div>

        {/* Main Grid: Leads Directory vs ML Deep Dive Inspector */}
        <div className="lead-intelligence-grid">
          
          {/* Left Column: Leads Table */}
          <div className="tail-card" style={{ padding: '0px', overflow: 'hidden', minWidth: 0 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="text-title-sm">B2B Account Directory</h3>
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
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => handleSelectLead(lead)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(70, 95, 255, 0.08)' : 'transparent'
                        }}
                      >
                        <td>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.84rem' }}>
                              {lead.company_name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {lead.contact_name} ({lead.email})
                            </div>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {lead.industry}
                          </span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--success-500)', fontSize: '0.82rem' }}>
                            ${(lead.deal_value || 0).toLocaleString()}
                          </span>
                        </td>

                        <td>
                          <span className={`badge ${lead.lead_score >= 80 ? 'badge-hot' : lead.lead_score >= 60 ? 'badge-qualified' : 'badge-brand'}`} style={{ fontSize: '0.72rem', padding: '2px 7px' }}>
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
                            style={{ padding: '3px 8px', fontSize: '0.72rem', gap: '4px', whiteSpace: 'nowrap' }}
                          >
                            <Send size={11} />
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
              <div className="tail-card tail-card-glow">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span className="badge badge-brand" style={{ marginBottom: '6px' }}>
                      {selectedLead.funding_stage || 'Series B'}
                    </span>
                    <h3 className="text-title-md">{selectedLead.company_name}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Contact: {selectedLead.contact_name} • {selectedLead.email}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: selectedLead.lead_score >= 80 ? 'var(--error-500)' : 'var(--brand-500)' }}>
                      {selectedLead.lead_score}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Intent Score
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Website Visits</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedLead.website_visits || 12} views</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Email Opens</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedLead.email_opens || 6} opens</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Deal Value</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--success-500)' }}>${(selectedLead.deal_value || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Conversion Probability</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--brand-400)' }}>
                      {mlScoreBreakdown ? `${(mlScoreBreakdown.conversion_probability * 100).toFixed(0)}%` : `${selectedLead.lead_score}%`}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/outreach', { state: { lead: selectedLead } })}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  <Sparkles size={16} />
                  <span>Draft NVIDIA NIM Outreach for {selectedLead.company_name}</span>
                </button>
              </div>

              {/* Similar Won Deals Vector Matcher */}
              <div className="tail-card">
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
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{deal.company_name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            {deal.industry} • ${(deal.deal_value || 0).toLocaleString()}
                          </div>
                        </div>
                        <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
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
            <div className="tail-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                Select a lead on the left to view ML insights
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default LeadIntelligence;
