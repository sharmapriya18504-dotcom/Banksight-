import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Landmark, 
  Activity, 
  Coins, 
  Layers, 
  CreditCard, 
  AlertTriangle, 
  HelpCircle, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  RefreshCw, 
  CheckCircle2, 
  Clock,
  BarChart3,
  FileSearch,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';
import { API_BASE } from '../config';

const PIE_COLORS = ['#10b981', '#0ea5e9', '#8b5cf6', '#f59e0b', '#f43f5e', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #bfdbfe',
        borderRadius: 'var(--radius-sm)',
        padding: '0.75rem 1rem',
        boxShadow: '0 8px 20px rgba(37,99,235,0.12)',
        fontSize: '0.8rem'
      }}>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{label}</div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: entry.color, marginTop: '0.2rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color }} />
            <span>{entry.name}:</span>
            <strong>
              {typeof entry.value === 'number' && entry.name.toLowerCase().includes('volume')
                ? formatCurrency(entry.value)
                : typeof entry.value === 'number' && entry.name.toLowerCase().includes('rate')
                ? `${entry.value}%`
                : formatNumber(entry.value)}
            </strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage({ dbStatus }) {
  const [kpis, setKpis] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [monthlyData, setMonthlyData] = useState([]);
  const [flowData, setFlowData] = useState([]);
  const [balanceData, setBalanceData] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [failureData, setFailureData] = useState([]);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKpis = async () => {
    try {
      const url = `${API_BASE}/api/kpis?status=${filterStatus}`;
      const res = await fetch(url).then(r => r.json());
      setKpis(res);
    } catch (err) {
      console.error('Error fetching KPIs:', err);
    }
  };

  const loadCharts = async () => {
    setLoading(true);
    try {
      const [monRes, flowRes, balRes, loanRes, brRes, failRes, txnRes] = await Promise.all([
        fetch(`${API_BASE}/api/charts/monthly`).then(r => r.json()),
        fetch(`${API_BASE}/api/charts/flow`).then(r => r.json()),
        fetch(`${API_BASE}/api/charts/balances`).then(r => r.json()),
        fetch(`${API_BASE}/api/charts/loans`).then(r => r.json()),
        fetch(`${API_BASE}/api/charts/branches`).then(r => r.json()),
        fetch(`${API_BASE}/api/charts/failures`).then(r => r.json()),
        fetch(`${API_BASE}/api/recent-transactions`).then(r => r.json())
      ]);

      setMonthlyData(monRes || []);
      setFlowData(flowRes || []);
      setBalanceData(balRes || []);
      setLoanData(loanRes || []);
      setBranchData(brRes || []);
      setFailureData(failRes || []);
      setRecentTxns(txnRes || []);
    } catch (err) {
      console.error('Error loading charts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
    loadCharts();
  }, [filterStatus]);

  const m = kpis?.metrics || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
      {/* Top Banner and Quick Filter */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #bfdbfe',
        borderLeft: '5px solid #2563eb',
        borderRadius: '14px',
        padding: '1.4rem 1.8rem',
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span className="live-dot-success" style={{ margin: 0 }}></span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Bank Management Dashboard
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: '0.1rem 0' }}>
            Executive Bank Overview
          </h1>
          <p style={{ color: '#475569', fontSize: '0.92rem', margin: '0.2rem 0 0 0' }}>
            Live portfolio metrics tracking customer deposits, total loan disbursals, credit card spending, and daily money flow.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}>
            <Filter size={15} color="#2563eb" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
            >
              <option value="All">All Transactions</option>
              <option value="success">Successful Only</option>
              <option value="failed">Failed Only</option>
            </select>
          </div>

          <button
            onClick={() => { fetchKpis(); loadCharts(); }}
            className="btn"
            style={{
              padding: '0.5rem 0.95rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f1f5f9',
              color: '#1e3a8a',
              border: '1.5px solid #cbd5e1'
            }}
          >
            <RefreshCw size={14} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* 💡 Quick Start Guide Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.2rem'
      }}>
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #bfdbfe',
          borderLeft: '5px solid #2563eb',
          borderRadius: '12px',
          padding: '1.1rem 1.3rem',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ background: '#eff6ff', color: '#1d4ed8', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1.5px solid #bfdbfe' }}>
              <BarChart3 size={20} />
            </div>
            <div>
              <strong style={{ color: '#0f172a', fontSize: '0.92rem', display: 'block' }}>1. Check Bank Metrics</strong>
              <span style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.4, display: 'block', marginTop: '0.2rem' }}>
                Review the 8 executive cards below showing total customers, bank deposits, and loan totals.
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 700 }}>
            ✨ Live metrics update automatically from MySQL
          </span>
        </div>

        <Link to="/insights" style={{ textDecoration: 'none' }}>
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #bbf7d0',
            borderLeft: '5px solid #16a34a',
            borderRadius: '12px',
            padding: '1.1rem 1.3rem',
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.8rem',
            height: '100%',
            transition: 'transform 0.15s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{ background: '#f0fdf4', color: '#15803d', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1.5px solid #bbf7d0' }}>
                <FileSearch size={20} />
              </div>
              <div>
                <strong style={{ color: '#0f172a', fontSize: '0.92rem', display: 'block' }}>2. View 15 SQL Insights</strong>
                <span style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.4, display: 'block', marginTop: '0.2rem' }}>
                  Click to open all 15 operational SQL queries with live analytical results and CSV downloads.
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#15803d', fontWeight: 800, fontSize: '0.8rem' }}>
              <span>Open SQL Insights</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </Link>

        <Link to="/simulation" style={{ textDecoration: 'none' }}>
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #ddd6fe',
            borderLeft: '5px solid #7c3aed',
            borderRadius: '12px',
            padding: '1.1rem 1.3rem',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.8rem',
            height: '100%',
            transition: 'transform 0.15s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{ background: '#f5f3ff', color: '#6d28d9', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1.5px solid #ddd6fe' }}>
                <Coins size={20} />
              </div>
              <div>
                <strong style={{ color: '#0f172a', fontSize: '0.92rem', display: 'block' }}>3. Test Money Transfer Simulator</strong>
                <span style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.4, display: 'block', marginTop: '0.2rem' }}>
                  Deposit or withdraw money live! Test the safety rule (must retain ≥ ₹1,000).
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#6d28d9', fontWeight: 800, fontSize: '0.8rem' }}>
              <span>Try Live Simulator Now</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </Link>
      </div>

      {/* 8 Executive KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.2rem'
      }}>
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>TOTAL CUSTOMERS</span>
            <Users size={18} color="var(--cyan)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.3rem 0' }}>{formatNumber(m.totalCustomers)}</div>
          <span className="badge badge-cyan">Registered Customers</span>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>BANK ACCOUNTS</span>
            <Landmark size={18} color="var(--emerald)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.3rem 0' }}>{formatNumber(m.totalAccounts)}</div>
          <span className="badge badge-emerald">Savings & Current</span>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>TOTAL CUSTOMER MONEY</span>
            <Coins size={18} color="var(--emerald)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.3rem 0', color: 'var(--emerald)' }}>
            {formatCurrency(m.totalBalance)}
          </div>
          <span className="badge badge-emerald">Deposited in Bank</span>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>TOTAL TRANSACTIONS</span>
            <Activity size={18} color="var(--purple)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.3rem 0' }}>{formatNumber(m.totalTransactions)}</div>
          <span className="badge badge-purple">Money Transfers</span>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>TOTAL MONEY MOVED</span>
            <Coins size={18} color="var(--cyan)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.3rem 0', color: 'var(--cyan)' }}>
            {formatCurrency(m.totalVolume)}
          </div>
          <span className="badge badge-cyan">Inflow + Outflow</span>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>TRANSFER SUCCESS RATE</span>
            <CheckCircle2 size={18} color="var(--emerald)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.3rem 0', color: 'var(--emerald)' }}>
            {m.successRate || 100}%
          </div>
          <span className="badge badge-emerald">{m.failedTransactions || 0} Failed Transfers</span>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>ACTIVE LOANS</span>
            <Layers size={18} color="var(--amber)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.3rem 0' }}>{formatNumber(m.activeLoans)}</div>
          <span className="badge badge-amber">{formatCurrency(m.totalLoanAmount)} Total Lent</span>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
            <span>CUSTOMER COMPLAINTS</span>
            <HelpCircle size={18} color="var(--rose)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.3rem 0' }}>{formatNumber(m.openTickets)}</div>
          <span className="badge badge-rose">Open Support Tickets</span>
        </div>
      </div>

      {/* Row 1: Recharts Monthly Trends & Flow Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
        {/* Monthly Volume & Success Rate (Composed Recharts) */}
        <div className="card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>Monthly Transaction Volume & Success Rate</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Interactive Recharts Area + Line visualization</div>
            </div>
            <span className="badge badge-cyan">Real MySQL Timeline</span>
          </div>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickFormatter={m => m?.slice(2)} />
                <YAxis yAxisId="left" stroke="var(--text-muted)" fontSize={11} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--emerald)" fontSize={11} domain={[80, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area yAxisId="left" type="monotone" dataKey="total_volume" name="Total Volume" stroke="#0ea5e9" fillOpacity={1} fill="url(#volGrad)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="success_rate" name="Success Rate %" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credit vs Debit Distribution (Pie Recharts) */}
        <div className="card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>Credit Inflow vs Debit Outflow</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Liquidity composition across categories</div>
            </div>
            <span className="badge badge-emerald">Cash Flow</span>
          </div>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={flowData}
                  dataKey="total_volume"
                  nameKey="flow_category"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={4}
                >
                  {flowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Account Reserves & Top Branches Bar Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
        {/* Account Reserves by Bracket */}
        <div className="card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>Customer Balance Tier Distribution</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Liquid reserve accounts segmented by tier</div>
            </div>
            <span className="badge badge-purple">Accounts</span>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={balanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="balance_bracket" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Accounts Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Branches Revenue */}
        <div className="card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>Top Regional Branches by Operating Revenue</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Revenue performance rank across cities</div>
            </div>
            <span className="badge badge-amber">Revenue</span>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData} margin={{ top: 10, right: 10, left: -5, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="branch_name" stroke="var(--text-muted)" fontSize={10} angle={-25} textAnchor="end" />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={v => `₹${(v/10000000).toFixed(1)}Cr`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="branch_revenue" name="Annual Revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Transactions Real-time Feed */}
      <div className="card glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>Live Transactions Audit Ledger</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Latest real-time settlement operations from MySQL</div>
          </div>
          <span className="badge badge-cyan">Recent 10 Entries</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>TXN ID</th>
                <th>Customer</th>
                <th>Channel / Type</th>
                <th>Amount</th>
                <th>Timestamp</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTxns.map((t) => {
                const isCredit = ['Deposit', 'Salary', 'Refund', 'deposit'].includes(t.txn_type);
                return (
                  <tr key={t.txn_id}>
                    <td>
                      <span className="badge badge-cyan" style={{ fontFamily: 'monospace' }}>
                        {t.txn_id}
                      </span>
                    </td>
                    <td>
                      <strong>{t.customer_name || t.customer_id}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{t.customer_id}</div>
                    </td>
                    <td>
                      <span className={`badge ${isCredit ? 'badge-emerald' : 'badge-purple'}`}>
                        {t.txn_type}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: isCredit ? 'var(--emerald)' : 'var(--text-primary)' }}>
                        {isCredit ? '+' : '-'}{formatCurrency(t.amount)}
                      </strong>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatDate(t.txn_time)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`badge ${t.status === 'success' ? 'badge-emerald' : 'badge-rose'}`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
