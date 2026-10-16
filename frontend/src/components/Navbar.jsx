import React from 'react';
import { Landmark, Activity, ShieldCheck, Database, Clock } from 'lucide-react';

export default function Navbar({ dbStatus, activeTab, setActiveTab }) {
  const isConnected = dbStatus?.connected;

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.9rem 2rem',
      background: 'rgba(10, 17, 34, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand */}
      <div 
        onClick={() => setActiveTab('landing')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
      >
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px var(--cyan-glow)'
        }}>
          <Landmark size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="gradient-text">BankSight</span>
            <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--cyan)' }}>v2.0</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Transaction Intelligence Platform
          </div>
        </div>
      </div>

      {/* Center Nav Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {[
          { id: 'landing', label: 'Overview' },
          { id: 'dashboard', label: 'Executive Dashboard' },
          { id: 'simulation', label: 'ACID Simulator' },
          { id: 'insights', label: '15 SQL Insights' },
          { id: 'tables', label: 'Table Explorer' },
          { id: 'crud', label: 'CRUD Records' },
          { id: 'about', label: 'Architecture & Creator' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              background: activeTab === item.id ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              color: activeTab === item.id ? 'var(--cyan)' : 'var(--text-secondary)',
              border: activeTab === item.id ? '1px solid var(--border-medium)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              padding: '0.45rem 0.85rem',
              fontSize: '0.84rem',
              fontWeight: activeTab === item.id ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right System Diagnostics */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: isConnected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
          border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
          padding: '0.4rem 0.8rem',
          borderRadius: '9999px',
          fontSize: '0.75rem'
        }}>
          <span className={isConnected ? "pulse-indicator" : ""} style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isConnected ? 'var(--emerald)' : 'var(--rose)',
            display: 'inline-block'
          }} />
          <span style={{ color: isConnected ? 'var(--emerald)' : 'var(--rose)', fontWeight: 600 }}>
            {isConnected ? `MySQL Connected (${dbStatus?.tablesCount} Tables)` : 'Disconnected'}
          </span>
        </div>
      </div>
    </header>
  );
}
