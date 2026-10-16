import React from 'react';
import { 
  Menu, 
  Database, 
  ShieldCheck, 
  User, 
  LogOut, 
  LogIn, 
  CheckCircle2, 
  AlertCircle,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ pageTitle, pageSubtitle, onToggleSidebar, dbStatus }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const isConnected = dbStatus?.connected;

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Left: Mobile Toggle & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <button 
          onClick={onToggleSidebar}
          className="mobile-toggle-btn"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '0.4rem',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            {pageTitle || 'BankSight Dashboard'}
          </h1>
          {pageSubtitle && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              {pageSubtitle}
            </div>
          )}
        </div>
      </div>

      {/* Right: DB Health, User Profile & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        {/* Database Health Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.8rem',
          borderRadius: '9999px',
          background: isConnected ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${isConnected ? '#86efac' : '#fca5a5'}`,
          fontSize: '0.78rem',
          fontWeight: 700,
          color: isConnected ? '#15803d' : '#b91c1c'
        }}>
          <span className={isConnected ? "live-dot-success" : "live-dot-stop"} style={{ margin: 0 }} />
          <Database size={13} />
          <span>{isConnected ? 'MySQL 8.0 Live' : 'MySQL Offline (Stopped)'}</span>
        </div>

        {/* User Status / Login Button */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.35rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: isAdmin ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #0284c7, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>

              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.fullName || user.username}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: isAdmin ? 'var(--purple)' : 'var(--cyan)'
                }}>
                  {user.role}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: 'var(--rose)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                transition: 'var(--transition)'
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
