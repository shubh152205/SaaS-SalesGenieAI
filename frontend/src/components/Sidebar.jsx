import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Send,
  Kanban,
  Headphones,
  Settings,
  Sparkles,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  Cpu,
  Layers,
  FileAudio
} from 'lucide-react';
import { SalesGenieBrainSparkIcon } from './SalesGenieLogo';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Accordion state for submenus
  const [openSubmenus, setOpenSubmenus] = useState({
    leads: true,
    outreach: false,
    meetings: false
  });

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <aside
      className={`sidebar-wrapper ${collapsed ? 'collapsed' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* ── Top Section: Brand Header & Nav ── */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
        
        {/* Brand Header */}
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SalesGenieBrainSparkIcon size={38} />
            {!collapsed && (
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>SalesGenie</span>
                  <span style={{ fontSize: '0.65rem', background: 'linear-gradient(135deg, #465fff 0%, #38bdf8 100%)', color: 'white', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                    AI
                  </span>
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--brand-400)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  The AI Brain Spark
                </div>
              </div>
            )}
          </NavLink>

          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* Navigation Section: Main Menu */}
        <div style={{ padding: '8px 0' }}>
          {!collapsed && (
            <div className="sidebar-nav-section-title">
              Main Menu
            </div>
          )}

          {/* 1. Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `menu-item ${isActive ? 'menu-item-active' : ''}`}
            title="Executive Dashboard"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="menu-item-icon">
                <LayoutDashboard size={19} />
              </div>
              {!collapsed && <span>Executive Dashboard</span>}
            </div>
            {!collapsed && (
              <span className="badge badge-brand" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                Live
              </span>
            )}
          </NavLink>

          {/* 2. Lead Intelligence */}
          <div>
            <NavLink
              to="/leads"
              className={({ isActive }) => `menu-item ${isActive ? 'menu-item-active' : ''}`}
              title="Lead Intelligence"
              onClick={(e) => {
                if (!collapsed) {
                  // Keep link working or toggle
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="menu-item-icon">
                  <Users size={19} />
                </div>
                {!collapsed && <span>Lead Intelligence</span>}
              </div>
              {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                    50+ Leads
                  </span>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSubmenu('leads');
                    }}
                    style={{ color: 'var(--text-dim)', cursor: 'pointer' }}
                  >
                    {openSubmenus.leads ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                </div>
              )}
            </NavLink>

            {/* Submenu for Leads */}
            {!collapsed && openSubmenus.leads && (
              <div style={{ paddingLeft: '44px', display: 'flex', flexDirection: 'column', gap: '2px', margin: '4px 0 8px' }}>
                <NavLink
                  to="/leads"
                  style={({ isActive }) => ({
                    fontSize: '0.8125rem',
                    color: isActive && location.pathname === '/leads' ? 'var(--brand-500)' : 'var(--text-muted)',
                    textDecoration: 'none',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    fontWeight: isActive && location.pathname === '/leads' ? 600 : 400
                  })}
                >
                  • Directory & Intent Scoring
                </NavLink>
              </div>
            )}
          </div>

          {/* 3. AI Outreach Engine */}
          <NavLink
            to="/outreach"
            className={({ isActive }) => `menu-item ${isActive ? 'menu-item-active' : ''}`}
            title="AI Outreach Engine"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="menu-item-icon">
                <Send size={19} />
              </div>
              {!collapsed && <span>AI Outreach Engine</span>}
            </div>
            {!collapsed && (
              <span className="badge badge-brand" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                NVIDIA NIM
              </span>
            )}
          </NavLink>
        </div>

        {/* Navigation Section: Sales & Pipeline */}
        <div style={{ padding: '4px 0' }}>
          {!collapsed && (
            <div className="sidebar-nav-section-title">
              Sales & Pipeline
            </div>
          )}

          {/* 4. Deal Pipeline */}
          <NavLink
            to="/pipeline"
            className={({ isActive }) => `menu-item ${isActive ? 'menu-item-active' : ''}`}
            title="Deal Pipeline"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="menu-item-icon">
                <Kanban size={19} />
              </div>
              {!collapsed && <span>Deal Pipeline Kanban</span>}
            </div>
            {!collapsed && (
              <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                $3.0M
              </span>
            )}
          </NavLink>

          {/* 5. Call Intelligence */}
          <NavLink
            to="/meetings"
            className={({ isActive }) => `menu-item ${isActive ? 'menu-item-active' : ''}`}
            title="Call Intelligence"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="menu-item-icon">
                <Headphones size={19} />
              </div>
              {!collapsed && <span>Call Intelligence</span>}
            </div>
            {!collapsed && (
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                Audio AI
              </span>
            )}
          </NavLink>
        </div>

        {/* Navigation Section: Settings & Others */}
        <div style={{ padding: '4px 0' }}>
          {!collapsed && (
            <div className="sidebar-nav-section-title">
              Configuration
            </div>
          )}

          {/* 6. Web Presentation Deck */}
          <NavLink
            to="/presentation"
            className={({ isActive }) => `menu-item ${isActive ? 'menu-item-active' : ''}`}
            title="Interactive Pitch Deck"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="menu-item-icon">
                <Sparkles size={19} style={{ color: '#F59E0B' }} />
              </div>
              {!collapsed && <span>Web Presentation Deck</span>}
            </div>
            {!collapsed && (
              <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                12 SLIDES
              </span>
            )}
          </NavLink>

          {/* 7. Settings */}
          <NavLink
            to="/settings"
            className={({ isActive }) => `menu-item ${isActive ? 'menu-item-active' : ''}`}
            title="Settings & Models"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="menu-item-icon">
                <Settings size={19} />
              </div>
              {!collapsed && <span>Settings & Models</span>}
            </div>
          </NavLink>
        </div>

        {/* Active AI Engine Card */}
        {!collapsed && (
          <div style={{
            margin: '18px 12px 10px',
            padding: '14px',
            borderRadius: '12px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pulse-dot" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--success-500)' }}>
                NVIDIA NIM 70B
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              meta/llama-3.1-70b-instruct
            </div>
          </div>
        )}

      </div>

      {/* ── Bottom Section: User Profile & Sign Out ── */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-card-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--brand-500), #06b6d4)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.85rem',
            flexShrink: 0
          }}>
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SD'}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Sales Director'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.email || 'demo@salesgenie.ai'}
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={handleLogout}
            title="Sign Out"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LogOut size={16} />
          </button>
        )}
      </div>

    </aside>
  );
};

export default Sidebar;
