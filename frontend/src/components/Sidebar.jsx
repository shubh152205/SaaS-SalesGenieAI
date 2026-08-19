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
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CircleDollarSign,
  Building2,
  GitBranch,
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

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeClass: 'badge-emerald'
    },
    {
      to: '/leads',
      label: 'Lead Intelligence',
      icon: Users,
      badge: '120-Tree',
      badgeClass: 'badge-cyan'
    },
    {
      to: '/outreach',
      label: 'AI Outreach',
      icon: Send,
      badge: 'NIM 70B',
      badgeClass: 'badge-emerald'
    },
    {
      to: '/pipeline',
      label: 'Deal Pipeline',
      icon: Kanban,
      badge: '$3.0M',
      badgeClass: 'badge-warning'
    },
    {
      to: '/meetings',
      label: 'Call Intelligence',
      icon: Headphones,
      badge: 'Audio AI',
      badgeClass: 'badge-cyan'
    },
    {
      to: '/settings',
      label: 'Settings & Models',
      icon: Settings
    }
  ];

  return (
    <aside
      className={`sidebar-wrapper ${collapsed ? 'collapsed' : ''}`}
      style={{
        width: collapsed ? '72px' : '260px',
        minWidth: collapsed ? '72px' : '260px',
        backgroundColor: 'var(--sidebar)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* ── Top Header with Brand Logo ── */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
        
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 16px' : '0 20px',
          borderBottom: '1px solid var(--sidebar-border)',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}>
          <NavLink
            to="/dashboard"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid rgba(16, 185, 129, 0.25)'
            }}>
              <SalesGenieBrainSparkIcon size={26} />
            </div>

            {!collapsed && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  color: 'var(--sidebar-foreground)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}>
                  SaaS Sales Intelligence <span style={{ color: 'var(--accent)', fontSize: '0.78rem' }}>Forecasting</span>
                </span>
                <span style={{
                  fontSize: '0.62rem',
                  color: 'var(--muted-foreground)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}>
                  SaaS AI Powered Revenue Ops
                </span>
              </div>
            )}
          </NavLink>
        </div>

        {/* ── Navigation Items ── */}
        <nav style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {!collapsed && (
            <div style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: 'var(--muted-foreground)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0 10px',
              marginBottom: '8px'
            }}>
              Navigation
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-active' : ''}`}
                title={collapsed ? item.label : undefined}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  padding: collapsed ? '10px' : '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--sidebar-foreground)' : 'var(--muted-foreground)',
                  backgroundColor: isActive ? 'var(--sidebar-accent)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  position: 'relative',
                  transition: 'all 0.15s ease'
                })}
              >
                {({ isActive }) => (
                  <>
                    {/* Left vertical active bar pill */}
                    {isActive && (
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3px',
                        height: '20px',
                        borderRadius: '0 4px 4px 0',
                        backgroundColor: 'var(--accent)'
                      }} />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon
                        size={19}
                        style={{
                          color: isActive ? 'var(--accent)' : 'inherit',
                          flexShrink: 0,
                          transition: 'color 0.15s ease'
                        }}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span
                        className={`badge ${item.badgeClass}`}
                        style={{
                          fontSize: '0.68rem',
                          padding: '2px 7px',
                          fontWeight: 600
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ── Active Copilot Status Card ── */}
        {!collapsed && (
          <div style={{
            margin: 'auto 12px 14px',
            padding: '14px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--sidebar-accent)',
            border: '1px solid var(--sidebar-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-dot" style={{ backgroundColor: 'var(--accent)' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--sidebar-foreground)' }}>
                  ML Copilot Active
                </span>
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '0.625rem' }}>94.2%</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', lineHeight: 1.4 }}>
              Random Forest 120-Tree + NIM Llama 3.1
            </div>
          </div>
        )}

      </div>

      {/* ── Bottom Section: User Profile & Collapse Toggle ── */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backgroundColor: 'var(--sidebar)'
      }}>
        
        {/* User Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 8px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: collapsed ? 'transparent' : 'var(--sidebar-accent)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--accent) 0%, #0ea5e9 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.78rem',
              flexShrink: 0
            }}>
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'JD'}
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--sidebar-foreground)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.name || 'Sales Director'}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
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
                background: 'none',
                border: 'none',
                color: 'var(--destructive)',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LogOut size={15} />
            </button>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '7px',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            border: '1px solid var(--sidebar-border)',
            color: 'var(--muted-foreground)',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            fontWeight: 500,
            transition: 'all 0.15s ease'
          }}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span>Collapse</span>
            </>
          )}
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;
