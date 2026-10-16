import React from 'react';
import {
  ShieldCheck,
  Layers,
  Database,
  Cpu,
  BarChart3,
  CreditCard,
  Users,
  ArrowLeftRight,
  Sparkles,
  GitBranch,
  Mail,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
  HeadphonesIcon
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>

      {/* Hero Header Card */}
      <div className="card" style={{
        padding: '2rem 2.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
        color: '#ffffff',
        marginBottom: '2rem',
        boxShadow: '0 8px 24px rgba(30, 58, 138, 0.15)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.15)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          <Sparkles size={14} /> Production-Grade Banking Platform
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', margin: '0 0 0.75rem 0' }}>
          About BankSight
        </h1>
        <p style={{ color: '#e0e7ff', fontSize: '1.05rem', maxWidth: '840px', lineHeight: 1.6, margin: 0 }}>
          BankSight is a modern, full-stack commercial banking dashboard and relational analytics system.
          Engineered for financial institutions, it unifies real-time ledger auditing, ACID-compliant deposit and withdrawal processing, multi-entity portfolio management, and automated SQL operational insights into one intuitive platform.
        </p>
      </div>

      {/* Verified Technology Stack */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
          <Layers size={20} color="var(--cyan)" />
          Verified Technology Stack
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          
          {/* Frontend */}
          <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}>
                <Cpu size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Frontend UI Layer</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Client Application</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald)" /> React 19 Single Page Application
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald)" /> Vite Lightning-Fast Build Tooling
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald)" /> Clean Vanilla CSS Design System
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald)" /> Lucide Modern Iconography
              </li>
            </ul>
          </div>

          {/* Backend */}
          <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald)' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Backend REST API</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Business Logic & Routing</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald)" /> Node.js & Express.js REST Framework
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald)" /> MySQL Connection Pool Manager
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald)" /> Row-Locking (<code style={{ fontSize: '0.75rem' }}>SELECT FOR UPDATE</code>)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald)" /> Parameterized SQL Injection Safeguards
              </li>
            </ul>
          </div>

          {/* Database */}
          <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple)' }}>
                <Database size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Relational Database</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Data Persistence & Schema</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald)" /> MySQL 8.0 with InnoDB Storage Engine
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald)" /> 7 Relational Entities & Relationships
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald)" /> Strict Foreign Key Integrity & Constraints
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="var(--emerald)" /> ACID Compliant Transactional Execution
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Key Features Overview */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
          <Sparkles size={20} color="var(--cyan)" />
          Key Application Features
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
          
          <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--cyan)' }}>
              <BarChart3 size={18} />
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Executive Analytics Dashboard</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Visualizes 8 core banking KPIs, monthly transaction volumes, success-rate distributions, and cash-flow ratios across the complete customer base.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--cyan)' }}>
              <Users size={18} />
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Customer & Account Management</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Centralized views for customer demographics, active balances, account status filters, and relational customer profile details with search and sorting.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--cyan)' }}>
              <ArrowLeftRight size={18} />
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Safe Money Transfer & Ledger</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Streamlined deposit and withdrawal simulation engine featuring real-time balance calculations, minimum balance verification, and immediate audit log entry.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--cyan)' }}>
              <Database size={18} />
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>15 Operational SQL Insights</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Curated analytical queries with query-latency metrics, copyable SQL syntax, data tables, and CSV exports covering underwriting, fraud detection, and transaction trends.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--cyan)' }}>
              <CreditCard size={18} />
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Lending & Credit Card Portfolios</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Dedicated monitoring screens for loan disbursements, underwriting branches, credit card utilization ratios, credit limits, and expiry dates.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--cyan)' }}>
              <Building2 size={18} />
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Branches & Support Ticketing</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              City-wise branch coverage and customer issue ticketing system to track resolution speeds, priority escalations, and customer satisfaction.
            </p>
          </div>

        </div>
      </div>

      {/* About the Creator */}
      <div className="card" style={{
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-card)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '2px solid var(--cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem'
          }}>
            👩‍💻
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.2rem 0', color: 'var(--text-primary)' }}>
              Priya Sharma
            </h3>
            <div style={{ color: 'var(--cyan)', fontSize: '0.875rem', fontWeight: 600 }}>
              Full-Stack Developer & Data Analyst
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.4rem 0 0 0' }}>
              Specialized in scalable Python, React, SQL, and transactional financial systems architectures.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '260px' }}>
          <a
            href="https://github.com/sharmapriya18504-dotcom/Banksight-"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: '#f8fafc',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              transition: 'background 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
            onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
          >
            <GitBranch size={16} color="var(--cyan)" />
            <span>github.com/sharmapriya18504-dotcom/Banksight-</span>
          </a>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem'
          }}>
            <Mail size={16} color="var(--emerald)" />
            <span>sharmapriya18504-dotcom</span>
          </div>
        </div>
      </div>

    </div>
  );
}
