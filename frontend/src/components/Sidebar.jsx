import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Landmark, 
  Activity, 
  CreditCard, 
  Building2, 
  LifeBuoy, 
  Coins, 
  FileSearch, 
  FileText, 
  Info,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose, dbStatus }) {
  const { user, isAdmin } = useAuth();
  const isConnected = dbStatus?.connected;

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <BarChart3 size={17} /> },
    { to: '/customers', label: 'Customers', icon: <Users size={17} /> },
    { to: '/accounts', label: 'Accounts', icon: <Landmark size={17} /> },
    { to: '/transactions', label: 'Transactions', icon: <Activity size={17} /> },
    { to: '/loans', label: 'Loans', icon: <Coins size={17} /> },
    { to: '/credit-cards', label: 'Credit Cards', icon: <CreditCard size={17} /> },
    { to: '/branches', label: 'Branches', icon: <Building2 size={17} /> },
    { to: '/support-tickets', label: 'Support', icon: <LifeBuoy size={17} /> },
    { to: '/insights', label: 'SQL Insights', icon: <FileSearch size={17} /> },
    { to: '/simulation', label: 'Money Transfer', icon: <Coins size={17} /> },
    { to: '/reports', label: 'Reports & Exports', icon: <FileText size={17} /> },
    { to: '/about', label: 'About BankSight', icon: <Info size={17} /> }
  ];

  return (
    <aside 
      className={`sidebar-nav ${isOpen ? 'open' : ''}`}
      style={{
        width: '260px',
        background: 'linear-gradient(180deg, #ffffff 0%, #f0f4f9 100%)',
        borderRight: '1px solid var(--border-subtle)',
        boxShadow: '2px 0 12px rgba(37, 99, 235, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 60,
        padding: '1.2rem 1rem',
        overflowY: 'auto'
      }}
    >
      <div>
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1.2rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '1.2rem'
        }}>
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px var(--cyan-glow)'
            }}>
              <Landmark size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
                Bank<span style={{ color: 'var(--cyan)' }}>Sight</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>
                TRANSACTION INTELLIGENCE
              </div>
            </div>
          </NavLink>

          {/* Close for mobile */}
          <button
            onClick={onClose}
            className="mobile-close-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.2rem',
              display: 'none'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 0.5rem 0.5rem 0.5rem' }}>
          Banking Navigation
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
                background: isActive ? '#eff6ff' : 'transparent',
                borderLeft: isActive ? '3px solid var(--cyan)' : '3px solid transparent',
                transition: 'all 0.15s ease'
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`badge ${item.badgeType ? `badge-${item.badgeType}` : 'badge-cyan'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Status Card */}
      <div style={{
        marginTop: '1.5rem',
        padding: '0.85rem',
        borderRadius: 'var(--radius-sm)',
        background: '#ffffff',
        border: '1.5px solid #bfdbfe',
        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.05)',
        fontSize: '0.74rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Engine</span>
          <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>v2.0 Full-Stack</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Database</span>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <span className={isConnected ? "live-dot-success" : "live-dot-stop"}></span>
            <span style={{ color: isConnected ? 'var(--emerald)' : 'var(--rose)', fontWeight: 700 }}>
              {isConnected ? 'MySQL InnoDB' : 'Disconnected'}
            </span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Role</span>
          <span style={{ color: isAdmin ? 'var(--purple)' : 'var(--cyan)', fontWeight: 600, textTransform: 'capitalize' }}>
            {user ? user.role : 'Guest Mode'}
          </span>
        </div>
      </div>
    </aside>
  );
}
