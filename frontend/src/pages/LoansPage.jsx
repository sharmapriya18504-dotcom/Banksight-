import React, { useState, useEffect } from 'react';
import { Coins, Filter, ChevronLeft, ChevronRight, Percent, Calendar, AlertTriangle } from 'lucide-react';
import { API_BASE } from '../config';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/api/loans?page=${page}&limit=${limit}&status=${statusFilter}`;
      const res = await fetch(url).then(r => r.json());
      setLoans(res.data || []);
      setTotalRows(res.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [page, limit, statusFilter]);

  const totalPages = Math.ceil(totalRows / limit) || 1;

  // Aggregate stats
  const pagePrincipal = loans.reduce((sum, l) => sum + parseFloat(l.Loan_Amount || 0), 0);
  const avgRate = loans.length > 0 
    ? (loans.reduce((sum, l) => sum + parseFloat(l.Interest_Rate || 0), 0) / loans.length).toFixed(2)
    : 0;

  return (
    <div>
      <div style={{ marginBottom: '1.2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Bank Loans & Borrowings
        </h2>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {formatNumber(totalRows)} Total Registered Customer Loans &bull; Track loan amounts, interest rates, and loan status
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
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 1: Filter Status</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Select All, Active (Ongoing), or Closed loans.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#eff6ff', color: '#1d4ed8', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #bfdbfe' }}>
            2
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 2: Check Loan Details</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Inspect Loan Amount, Interest Rate (%), and Term.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#f0fdf4', color: '#15803d', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #86efac' }}>
            3
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 3: Branch & Customer</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>See Customer ID and issuing branch location.</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--purple)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Coins size={18} />
            <span>Total Bank Loans</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
            {formatNumber(totalRows)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Personal, Home & Commercial loans</div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Coins size={18} />
            <span>Page Loan Amount</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cyan)', marginTop: '0.4rem' }}>
            {formatCurrency(pagePrincipal)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Total borrowed on current page</div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--emerald)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Percent size={18} />
            <span>Average Interest Rate</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald)', marginTop: '0.4rem' }}>
            {avgRate}% p.a.
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Average annual loan interest rate</div>
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
          <option value="All">All Loan Statuses</option>
          <option value="Active">Active (Ongoing)</option>
          <option value="Paid Off">Paid Off (Closed)</option>
          <option value="Defaulted">Defaulted (Overdue)</option>
        </select>
      </div>

      {/* Loans Table */}
      <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Customer ID</th>
                <th>Issuing Branch</th>
                <th>Loan Type</th>
                <th>Loan Amount</th>
                <th>Interest Rate</th>
                <th>Tenure (Months)</th>
                <th>Start Date</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading loans from database...
                  </td>
                </tr>
              ) : loans.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No loan facilities found.
                  </td>
                </tr>
              ) : (
                loans.map((l) => (
                  <tr key={l.Loan_ID}>
                    <td>
                      <span className="badge badge-purple" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        #{l.Loan_ID}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', color: 'var(--cyan)' }}>
                        C{String(l.Customer_ID).padStart(4, '0')}
                      </span>
                    </td>
                    <td>{l.Branch || 'Main Branch'}</td>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{l.Loan_Type}</strong>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--cyan)', fontSize: '0.92rem' }}>
                        {formatCurrency(l.Loan_Amount)}
                      </strong>
                    </td>
                    <td>{l.Interest_Rate}%</td>
                    <td>{l.Loan_Term_Months} mos</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{l.Start_Date || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`badge ${
                        l.Loan_Status === 'Active' ? 'badge-emerald' :
                        l.Loan_Status === 'Defaulted' ? 'badge-rose' : 'badge-cyan'
                      }`}>
                        {l.Loan_Status}
                      </span>
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
            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({formatNumber(totalRows)} loans)
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
