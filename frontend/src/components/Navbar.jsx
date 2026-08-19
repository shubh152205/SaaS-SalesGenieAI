import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Calendar,
  ChevronDown,
  Settings,
  LogOut,
  Send,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({
  title = 'Overview',
  subtitle = 'Revenue & Predictive Lead Velocity',
  collapsed,
  setCollapsed
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'var(--bg-header)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      transition: 'background-color 0.2s ease, border-color 0.2s ease'
    }}>
      
      {/* ── Left: Section Title & Context Badge ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {setCollapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'var(--secondary)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              padding: '7px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Toggle Sidebar"
          >
            <Menu size={16} />
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--foreground)',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            {title}
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--secondary)',
            color: 'var(--muted-foreground)',
            fontSize: '0.75rem',
            fontWeight: 500,
            border: '1px solid var(--border)'
          }}>
            <Calendar size={12} style={{ color: 'var(--accent)' }} />
            <span>Last 30 days</span>
          </div>
        </div>
      </div>

      {/* ── Right: Search, Quick Action, Theme Switch, Notifications, User ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* Search Bar matching SalesOps */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: searchFocused ? '240px' : '180px',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--muted-foreground)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search leads, deals..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: '100%',
              height: '36px',
              paddingLeft: '32px',
              paddingRight: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--secondary)',
              border: `1px solid ${searchFocused ? 'var(--accent)' : 'var(--border)'}`,
              color: 'var(--foreground)',
              fontSize: '0.8125rem',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          />
        </div>

        {/* Quick Action: New Outreach */}
        <button
          onClick={() => navigate('/outreach')}
          className="btn btn-primary"
          style={{
            height: '36px',
            padding: '0 14px',
            fontSize: '0.8125rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={14} />
          <span>AI Outreach</span>
        </button>

        {/* Theme Toggle Button (Light / Dark) */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--secondary)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {isDark ? (
            <Sun size={16} style={{ color: '#fbbf24' }} />
          ) : (
            <Moon size={16} style={{ color: '#10b981' }} />
          )}
        </button>

        {/* Notifications Icon with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="Notifications"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--secondary)',
              border: '1px solid var(--border)',
              color: 'var(--muted-foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bell size={16} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)'
            }} className="pulse-dot" />
          </button>

          {notificationsOpen && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '300px',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: '14px',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--foreground)' }}>Live Alerts</span>
                <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>3 New</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--secondary)', fontSize: '0.75rem' }}>
                  <strong style={{ color: 'var(--accent)' }}>High Lead Intent: 94</strong>
                  <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>Apex Systems demo requested with CTO.</p>
                </div>
                <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--secondary)', fontSize: '0.75rem' }}>
                  <strong style={{ color: 'var(--chart-1)' }}>Deal Advanced</strong>
                  <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>CloudScale AI moved to Negotiation ($120k).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Pill */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: 'var(--secondary)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, var(--accent) 0%, #0ea5e9 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.75rem'
            }}>
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'JD'}
            </div>
          </button>

          {profileOpen && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '220px',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: '8px',
              zIndex: 100
            }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--foreground)' }}>{user?.name || 'Sales Director'}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>{user?.email || 'demo@salesgenie.ai'}</div>
              </div>
              <button
                onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  background: 'none',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--foreground)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Settings size={14} style={{ color: 'var(--muted-foreground)' }} />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  background: 'none',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--destructive)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <LogOut size={14} />
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
