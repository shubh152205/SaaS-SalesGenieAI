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
  FileAudio,
  ShieldCheck,
  Zap,
  Activity
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
        
        {/* Brand Header with Larger Logo */}
        <div className="sidebar-header" style={{ padding: collapsed ? '16px 8px' : '20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <NavLink to="/dashboard" className="sidebar-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SalesGenieBrainSparkIcon size={collapsed ? 36 : 48} animated={true} />
            {!collapsed && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.025em',
                  lineHeight: '1.15',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    fontSize: '0.62rem',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    color: '#ffffff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 800,
                    boxShadow: '0 2px 6px rgba(6, 182, 212, 0.35)'
                  }}>
                    SaaS
                  </span>
                  <span>SalesGenie</span>
                  <span style={{
                    fontSize: '0.65rem',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
                    color: '#ffffff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 800,
                    boxShadow: '0 2px 6px rgba(79, 70, 229, 0.4)'
                  }}>
                    AI
                  </span>
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: 'var(--brand-400)',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginTop: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  The AI Brain Spark
                </div>
              </div>
            )}
          </NavLink>

          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '7px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            {collapsed ? <Menu size={17} /> : <X size={17} />}
          </button>
        </div>

        {/* Navigation Section: Main Menu */}
        <div style={{ padding: '8px 0' }}>
          {!collapsed && (
            <div className="sidebar-nav-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Intelligence Platform</span>
              <Activity size={12} style={{ color: 'var(--brand-400)' }} />
            </div>
          )}

          {/* 1. Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `menu-item ${isActive ? 'menu-item-active' : ''}`}
            title="Executive Dashboard"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="menu-item-icon" style={{ color: '#6366f1' }}>
                <LayoutDashboard size={20} />
              </div>
              {!collapsed && <span style={{ fontWeight: 600 }}>Executive Dashboard</span>}
            </div>
            {!collapsed && (
              <span className="badge badge-indigo" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
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
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="menu-item-icon" style={{ color: '#06b6d4' }}>
                  <Users size={20} />
                </div>
                {!collapsed && <span style={{ fontWeight: 600 }}>Lead Intelligence</span>}
              </div>
              {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
                    Radar
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
                  • Directory & 120-Tree ML
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
              <div className="menu-item-icon" style={{ color: '#ec4899' }}>
                <Send size={20} />
              </div>
              {!collapsed && <span style={{ fontWeight: 600 }}>AI Outreach Engine</span>}
            </div>
            {!collapsed && (
              <span className="badge badge-rose" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
                NIM 70B
              </span>
            )}
          </NavLink>
        </div>

        {/* Navigation Section: Sales & Pipeline */}
        <div style={{ padding: '4px 0' }}>
          {!collapsed && (
            <div className="sidebar-nav-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Pipeline & Meetings</span>
              <Zap size={12} style={{ color: '#f59e0b' }} />
            </div>
          )}

          {/* 4. Deal Pipeline */}
          <NavLink
            to="/pipeline"
            className={({ isActive }) => `menu-item ${isActive ? 'menu-item-active' : ''}`}
            title="Deal Pipeline Kanban"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="menu-item-icon" style={{ color: '#f59e0b' }}>
                <Kanban size={20} />
              </div>
              {!collapsed && <span style={{ fontWeight: 600 }}>Deal Pipeline Kanban</span>}
            </div>
            {!collapsed && (
              <span className="badge badge-amber" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
                $3.0M+
              </span>
            )}
          </NavLink>

          {/* 5. Call Intelligence */}
          <NavLink
            to="/meetings"
            className={({ isActive }) => `menu-item ${isActive ? 'menu-item-active' : ''}`}
            title="Call & Audio Intelligence"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="menu-item-icon" style={{ color: '#10b981' }}>
                <Headphones size={20} />
              </div>
              {!collapsed && <span style={{ fontWeight: 600 }}>Call Intelligence</span>}
            </div>
            {!collapsed && (
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
                Audio AI
              </span>
            )}
          </NavLink>
        </div>

        {/* Navigation Section: Settings & Others */}
        <div style={{ padding: '4px 0' }}>
          {!collapsed && (
            <div className="sidebar-nav-section-title">
              System Settings
            </div>
          )}

          {/* 6. Settings */}
          <NavLink
            to="/settings"
            className={({ isActive }) => `menu-item ${isActive ? 'menu-item-active' : ''}`}
            title="Settings & Models"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="menu-item-icon" style={{ color: '#8b5cf6' }}>
                <Settings size={20} />
              </div>
              {!collapsed && <span style={{ fontWeight: 600 }}>Settings & Models</span>}
            </div>
          </NavLink>
        </div>

        {/* Active AI Engine Card */}
        {!collapsed && (
          <div style={{
            margin: '18px 12px 10px',
            padding: '14px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(79, 70, 229, 0.25)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pulse-dot" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-500)' }}>
                  NVIDIA NIM Engine
                </span>
              </div>
              <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>Active</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              meta/llama-3.1-70b-instruct + 120-Tree Random Forest
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
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--brand-500), #06b6d4)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.88rem',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
            flexShrink: 0
          }}>
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SG'}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
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
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--error-500)',
              cursor: 'pointer',
              padding: '7px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s ease'
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
