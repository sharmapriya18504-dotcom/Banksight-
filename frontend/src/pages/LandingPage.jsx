import React from 'react';
import { 
  BarChart3, 
  Coins, 
  Database, 
  FileSearch, 
  ShieldAlert, 
  SlidersHorizontal, 
  Users, 
  Landmark, 
  CreditCard, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  Layers
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function LandingPage({ setActiveTab, kpis, dbStatus }) {
  const m = kpis?.metrics || {};

  return (
    <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      
      {/* Hero Section */}
      <div className="glass-panel" style={{
        padding: '3.5rem 3rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(19, 32, 64, 0.95) 0%, rgba(13, 22, 45, 0.85) 60%, rgba(10, 16, 32, 0.98) 100%)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '3rem'
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          right: '-100px',
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
          <span className="badge badge-cyan">ENTERPRISE EDITION v2.0</span>
          <span className="badge badge-emerald">ACID LEDGER COMPLIANT</span>
          <span className="badge badge-purple">MYSQL INNODB ENGINE</span>
        </div>

        <h1 style={{
          fontSize: '3.2rem',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: '1rem',
          maxWidth: '850px'
        }}>
          BankSight: <span className="gradient-text">Transaction Intelligence</span> & Ledger Analytics
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '780px',
          lineHeight: 1.6,
          marginBottom: '2.2rem'
        }}>
          A full-stack, industry-standard banking intelligence platform built using <strong>React</strong>, <strong>Node.js</strong>, and <strong>MySQL</strong>. Delivering executive KPI monitoring, financial ledger simulation, and 15 verified relational analytical insights.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setActiveTab('dashboard')}
            style={{ padding: '0.8rem 1.6rem', fontSize: '0.98rem' }}
          >
            <BarChart3 size={18} />
            Launch Executive Dashboard
            <ArrowRight size={16} />
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => setActiveTab('simulation')}
            style={{ padding: '0.8rem 1.5rem', fontSize: '0.98rem' }}
          >
            <Coins size={18} color="var(--emerald)" />
            Run ACID Ledger Simulator
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => setActiveTab('insights')}
            style={{ padding: '0.8rem 1.5rem', fontSize: '0.98rem' }}
          >
            <FileSearch size={18} color="var(--cyan)" />
            Explore 15 SQL Insights
          </button>
        </div>
      </div>

      {/* Live System Metrics Strip */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { label: 'Active Customers', value: formatNumber(m.total_customers), sub: 'Verified KYC', icon: <Users size={20} color="var(--cyan)" /> },
            { label: 'Deposit Accounts', value: formatNumber(m.total_accounts), sub: 'Savings & Current', icon: <Landmark size={20} color="var(--emerald)" /> },
            { label: 'Total Transactions', value: formatNumber(m.total_transactions), sub: 'Audit Trail', icon: <BarChart3 size={20} color="var(--purple)" /> },
            { label: 'Gross Flow Volume', value: formatCurrency(m.total_txn_amount), sub: 'Processed Volume', icon: <Coins size={20} color="var(--cyan)" /> },
            { label: 'Credit Facilities', value: formatNumber(m.total_loans), sub: 'Underwritten Loans', icon: <Layers size={20} color="var(--amber)" /> },
            { label: 'Credit Cards', value: formatNumber(m.total_credit_cards), sub: 'Active Portfolios', icon: <CreditCard size={20} color="var(--rose)" /> }
          ].map((item, idx) => (
            <div key={idx} className="kpi-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {item.label}
                </span>
                {item.icon}
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {item.value || '...'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Platform Capabilities */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>ENTERPRISE PLATFORM MODULES</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Core Banking Intelligence Capabilities</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '650px', margin: '0.4rem auto 0 auto' }}>
            Built to provide full end-to-end transparency across financial ledgers, analytical queries, and relational data management.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            {
              id: 'dashboard',
              title: 'Executive Analytics Dashboard',
              badge: 'Real-Time Telemetry',
              icon: <BarChart3 size={28} color="var(--cyan)" />,
              desc: '8 dynamic KPI cards, dual-axis monthly volume trends, credit vs debit cash flow distribution, balance histograms, and real-time failure alerts.'
            },
            {
              id: 'simulation',
              title: 'ACID Ledger Simulator',
              badge: 'Financial Ledger Safety',
              icon: <Lock size={28} color="var(--emerald)" />,
              desc: 'Execute real-world banking deposits & withdrawals with atomic row-level locks (`SELECT FOR UPDATE`), balance checks, and instant rollback on failure.'
            },
            {
              id: 'insights',
              title: '15 Verified SQL Insights',
              badge: 'Schema-Tested Queries',
              icon: <FileSearch size={28} color="var(--purple)" />,
              desc: 'Industry-standard relational queries: top customers, credit vs debit flows, loan portfolio risk, branch revenue scorecards, and fraud velocity tags.'
            },
            {
              id: 'tables',
              title: 'Interactive Table Explorer',
              badge: 'Raw Schema Inspection',
              icon: <Database size={28} color="var(--cyan)" />,
              desc: 'Search, sort, filter, and paginate across all 7 database tables with real-time column definitions and instant CSV export.'
            },
            {
              id: 'crud',
              title: 'Enterprise CRUD Management',
              badge: 'FK-Protected Writes',
              icon: <CheckCircle2 size={28} color="var(--amber)" />,
              desc: 'Parameterized Create, Read, Update, and Delete forms for Customer profiles, Accounts, Branches, and Support Tickets with relational integrity guards.'
            },
            {
              id: 'about',
              title: 'Architecture & Schema Explorer',
              badge: '12-Min Evaluation Guide',
              icon: <Cpu size={28} color="var(--rose)" />,
              desc: 'Interactive ER diagrams, schema bug resolution walkthrough (account_id, branch_id), college presentation outline, and creator portfolio.'
            }
          ].map(feat => (
            <div 
              key={feat.id} 
              className="card glass-panel" 
              onClick={() => setActiveTab(feat.id)}
              style={{ padding: '1.8rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {feat.icon}
                  </div>
                  <span className="badge badge-cyan">{feat.badge}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>{feat.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {feat.desc}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600, marginTop: '1.2rem' }}>
                <span>Open Module</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creator & Portfolio Callout */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            fontSize: '3.2rem',
            background: 'var(--bg-elevated)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            👩‍💻
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <h3 style={{ fontSize: '1.4rem' }}>Priya Sharma</h3>
              <span className="badge badge-emerald">Creator & Full-Stack Engineer</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px' }}>
              Engineered BankSight as an academic live project and technical portfolio showcase demonstrating modern React UI, Node.js REST APIs, and production-grade MySQL financial ledgers.
            </p>
          </div>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setActiveTab('about')}
        >
          View 12-Min Presentation Guide
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
