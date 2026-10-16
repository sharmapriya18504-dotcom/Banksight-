import React, { useState, useEffect } from 'react';
import { CreditCard, Filter, ChevronLeft, ChevronRight, Activity, Percent, DollarSign } from 'lucide-react';
import { API_BASE } from '../config';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function CreditCardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchCards = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/api/credit-cards?page=${page}&limit=${limit}&status=${statusFilter}`;
      const res = await fetch(url).then(r => r.json());
      setCards(res.data || []);
      setTotalRows(res.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching cards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [page, limit, statusFilter]);

  const totalPages = Math.ceil(totalRows / limit) || 1;

  // Aggregate stats
  const totalLimit = cards.reduce((sum, c) => sum + parseFloat(c.Credit_Limit || 0), 0);
  const totalBalance = cards.reduce((sum, c) => sum + parseFloat(c.Current_Balance || 0), 0);
  const avgUtil = totalLimit > 0 ? ((totalBalance / totalLimit) * 100).toFixed(1) : 0;

  return (
    <div>
      <div style={{ marginBottom: '1.2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Credit Cards & Limits
        </h2>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {formatNumber(totalRows)} Total Credit Cards &bull; Check approved limits, current card spending, and network providers
        </div>
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
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 1: Filter Cards</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Filter by Active, Blocked, or Expired credit cards.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#eff6ff', color: '#1d4ed8', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #bfdbfe' }}>
            2
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 2: Check Limits & Spending</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Compare approved credit limit against money spent.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#f0fdf4', color: '#15803d', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #86efac' }}>
            3
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 3: Card Network</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>See Visa, Mastercard, and RuPay card networks.</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
            <CreditCard size={18} />
            <span>Total Issued Cards</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
            {formatNumber(totalRows)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Active and blocked credit cards</div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--amber)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Activity size={18} />
            <span>Total Card Spending</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--amber)', marginTop: '0.4rem' }}>
            {formatCurrency(totalBalance)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Total money spent on current page</div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--purple)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Percent size={18} />
            <span>Credit Limit Used</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cyan)', marginTop: '0.4rem' }}>
            {avgUtil}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Percentage of approved limit used</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card glass-panel" style={{ padding: '1.2rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Filter size={16} color="var(--text-muted)" />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status Filter:</span>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{
            padding: '0.55rem 0.8rem',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem'
          }}
        >
          <option value="All">All Card Statuses</option>
          <option value="Active">Active Cards</option>
          <option value="Blocked">Blocked</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Cards Table */}
      <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Card ID</th>
                <th>Customer ID</th>
                <th>Card Network</th>
                <th>Card Tier</th>
                <th>Credit Limit</th>
                <th>Spent Balance</th>
                <th>Used %</th>
                <th>Expiry Date</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading credit cards from database...
                  </td>
                </tr>
              ) : cards.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No credit card records found.
                  </td>
                </tr>
              ) : (
                cards.map((c) => {
                  const utilPct = parseFloat(c.utilization_pct || 0);
                  return (
                    <tr key={c.Card_ID}>
                      <td>
                        <span className="badge badge-amber" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                          #{c.Card_ID}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', color: 'var(--cyan)' }}>
                          C{String(c.Customer_ID).padStart(4, '0')}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{c.Card_Network}</strong>
                      </td>
                      <td>{c.Card_Type}</td>
                      <td>{formatCurrency(c.Credit_Limit)}</td>
                      <td>
                        <strong style={{ color: 'var(--amber)' }}>
                          {formatCurrency(c.Current_Balance)}
                        </strong>
                      </td>
                      <td style={{ minWidth: '120px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            flex: 1,
                            height: '6px',
                            background: 'var(--bg-primary)',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${Math.min(utilPct, 100)}%`,
                              height: '100%',
                              background: utilPct > 80 ? 'var(--rose)' : utilPct > 50 ? 'var(--amber)' : 'var(--emerald)'
                            }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{utilPct}%</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{c.Expiry_Date || '—'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`badge ${
                          c.Status === 'Active' ? 'badge-emerald' :
                          c.Status === 'Blocked' ? 'badge-rose' : 'badge-cyan'
                        }`}>
                          {c.Status}
                        </span>
                      </td>
                    </tr>
                  );
                })
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
            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({formatNumber(totalRows)} cards)
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
