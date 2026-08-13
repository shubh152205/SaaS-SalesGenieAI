import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  AudioWaveform,
  ShieldCheck,
  ChevronDown,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({
  title = 'Executive Dashboard',
  subtitle = 'AI Sales Intelligence & Pipeline Overview',
  collapsed,
  setCollapsed
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="app-header">
      
      {/* Left: Hamburger & Title or Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {setCollapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '8px' }}
            title="Toggle Sidebar"
          >
            <Menu size={18} />
          </button>
        )}

        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            {title}
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Center / Right: Search Bar, Actions, Theme Toggle, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* Quick Action: Web Presentation Pitch Deck */}
        <button
          onClick={() => navigate('/presentation')}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          title="Open Web Presentation Deck"
        >
          <Sparkles size={14} style={{ color: '#F59E0B' }} />
          <span>Pitch Deck</span>
        </button>

        {/* Quick Action Button: New AI Outreach */}
        <button
          onClick={() => navigate('/outreach')}
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles size={14} />
          <span>New AI Outreach</span>
        </button>

        {/* Quick Action Button: Process Call */}
        <button
          onClick={() => navigate('/meetings')}
          className="btn btn-cyan btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <AudioWaveform size={14} />
          <span>Process Call</span>
        </button>

        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-main)',
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {isDark ? <Sun size={17} style={{ color: '#f59e0b' }} /> : <Moon size={17} style={{ color: '#465fff' }} />}
        </button>

        {/* Notifications Icon with Popup */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="Notifications"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-main)',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bell size={17} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              boxShadow: '0 0 6px rgba(239, 68, 68, 0.8)'
            }} />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '320px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
              padding: '16px',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Notifications</span>
                <span className="badge badge-brand" style={{ fontSize: '0.68rem' }}>3 New</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--brand-50)', fontSize: '0.78rem' }}>
                  <strong style={{ color: 'var(--brand-500)' }}>Lead Scored: 94</strong>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>Apex Systems demo requested with CTO.</p>
                </div>
                <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--success-50)', fontSize: '0.78rem' }}>
                  <strong style={{ color: 'var(--success-600)' }}>Deal Advanced</strong>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>CloudScale AI moved to Negotiation ($120k).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Shield Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--success-50)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          color: 'var(--success-600)',
          fontSize: '0.75rem',
          fontWeight: 600
        }}>
          <ShieldCheck size={14} />
          <span style={{ display: 'inline-block' }}>JWT Protected</span>
        </div>

        {/* User Profile Pill & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 10px 4px 6px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand-500), #06b6d4)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}>
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SD'}
            </div>
            <div style={{ textAlign: 'left', display: 'none', md: 'block' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {user?.name || 'Sales Director'}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Enterprise
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-dim)' }} />
          </button>

          {/* User Menu Dropdown */}
          {profileOpen && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '240px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
              padding: '8px',
              zIndex: 100
            }}>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{user?.name || 'Sales Director'}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user?.email || 'demo@salesgenie.ai'}</div>
              </div>
              <button
                onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'var(--text-main)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Settings size={15} style={{ color: 'var(--brand-400)' }} />
                <span>Account Settings</span>
              </button>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'var(--error-500)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginTop: '4px'
                }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

export default Navbar;
