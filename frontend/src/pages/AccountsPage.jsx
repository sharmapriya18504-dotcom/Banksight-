import React, { useState, useEffect } from 'react';
import { Landmark, Search, ChevronLeft, ChevronRight, Download, Filter, Coins, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState('');

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/api/accounts?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url).then(r => r.json());
      setAccounts(res.data || []);
      setTotalRows(res.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [page, limit]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAccounts();
  };

  const totalPages = Math.ceil(totalRows / limit) || 1;

  // Compute page stats
  const pageTotalBalance = accounts.reduce((sum, a) => sum + parseFloat(a.account_balance || 0), 0);
  const avgBalance = accounts.length > 0 ? pageTotalBalance / accounts.length : 0;

  return (
    <div>
      {/* Top Banner & Quick Transfer Shortcut */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Customer Bank Accounts & Balances
          </h2>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {formatNumber(totalRows)} Total Active Accounts &bull; Check current balances or test a transfer
          </div>
        </div>

        <Link to="/simulation" style={{ textDecoration: 'none' }}>
          <button 
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem', fontSize: '0.88rem', fontWeight: 700 }}
          >
            <Coins size={16} />
            <span>⚡ Test Money Transfer (Deposit / Withdraw)</span>
          </button>
        </Link>
      </div>

      {/* 💡 3-Step Simple How-To-Use Guide */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '12px',
        padding: '0.9rem 1.4rem',
        marginBottom: '1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.2rem',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#eff6ff', color: '#1d4ed8', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #bfdbfe' }}>
            1
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 1: Search Account</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Search by Customer ID (e.g. C0003) or Account Holder Name.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#eff6ff', color: '#1d4ed8', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #bfdbfe' }}>
            2
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 2: Check Balance</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>View the real-time available money balance in MySQL.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#f0fdf4', color: '#15803d', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #86efac' }}>
            3
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 3: Deposit or Withdraw</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Click "Transfer Money" to deposit or deduct money live.</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Landmark size={18} />
            <span>Active Bank Accounts</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
            {formatNumber(totalRows)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Total active deposit accounts</div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--emerald)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Coins size={18} />
            <span>Page Total Money</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald)', marginTop: '0.4rem' }}>
            {formatCurrency(pageTotalBalance)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Combined balance of {accounts.length} accounts on page</div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--purple)', fontSize: '0.85rem', fontWeight: 600 }}>
            <TrendingUp size={18} />
            <span>Average Account Balance</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
            {formatCurrency(avgBalance)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Average per customer on this page</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card glass-panel" style={{ padding: '1.2rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Customer ID (e.g. C0003) or Account Holder Name..."
              style={{
                width: '100%',
                padding: '0.55rem 0.8rem 0.55rem 2.3rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <button type="submit" className="btn btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
            Search
          </button>
        </form>
      </div>

      {/* Accounts Table */}
      <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Account Holder</th>
                <th>Account Type</th>
                <th>City</th>
                <th>Available Balance</th>
                <th>Last Updated</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading bank account balances from MySQL...
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No account records found.
                  </td>
                </tr>
              ) : (
                accounts.map((a) => (
                  <tr key={a.customer_id}>
                    <td>
                      <span className="badge badge-cyan" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        {a.customer_id}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{a.name || 'Account Holder'}</strong>
                    </td>
                    <td>
                      <span className={`badge ${a.account_type === 'Savings' ? 'badge-emerald' : 'badge-purple'}`}>
                        {a.account_type || 'Savings'}
                      </span>
                    </td>
                    <td>{a.city || '—'}</td>
                    <td>
                      <strong style={{ color: 'var(--emerald)', fontSize: '0.95rem' }}>
                        {formatCurrency(a.account_balance)}
                      </strong>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {a.last_updated || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to="/simulation"
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
                      >
                        <Coins size={13} color="#2563eb" />
                        <span>Transfer</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          <div>
            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({formatNumber(totalRows)} accounts)
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
