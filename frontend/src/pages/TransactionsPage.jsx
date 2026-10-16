import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle,
  RotateCcw,
  Coins
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/api/transactions?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&status=${statusFilter}&txnType=${typeFilter}`;
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      const res = await fetch(url).then(r => r.json());
      setTransactions(res.data || []);
      setTotalRows(res.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, limit, statusFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setTypeFilter('All');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const exportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['Transaction ID', 'Customer ID', 'Customer Name', 'Type', 'Amount', 'Timestamp', 'Status'];
    const rows = transactions.map(t => [
      t.txn_id,
      t.customer_id,
      `"${t.customer_name || ''}"`,
      t.txn_type,
      t.amount,
      t.txn_time,
      t.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BankSight_Transactions_Page_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(totalRows / limit) || 1;

  // Page stats
  const pageVolume = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const successCount = transactions.filter(t => t.status === 'success').length;
  const pageSuccessRate = transactions.length > 0 ? ((successCount / transactions.length) * 100).toFixed(1) : 100;

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            All Transactions (Bank Passbook)
          </h2>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {formatNumber(totalRows)} Total Recorded Transactions in MySQL &bull; Live passbook audit trail
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <Link to="/simulation" style={{ textDecoration: 'none' }}>
            <button 
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem', fontSize: '0.88rem', fontWeight: 700 }}
            >
              <Coins size={16} />
              <span>⚡ Test New Transfer</span>
            </button>
          </Link>

          <button 
            onClick={exportCSV}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', fontSize: '0.88rem', fontWeight: 600 }}
          >
            <Download size={16} />
            <span>Export Page to CSV</span>
          </button>
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
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 1: Search & Filter</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Filter by Success vs Failed, or Deposit vs Withdrawal.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#eff6ff', color: '#1d4ed8', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #bfdbfe' }}>
            2
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 2: Check Passbook Entry</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>See Txn ID, customer name, money amount (+/-), and date.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#f0fdf4', color: '#15803d', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #86efac' }}>
            3
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 3: Test New Transfer</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Click "Test New Transfer" above to deposit or withdraw money.</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Activity size={18} />
            <span>Total Journal Records</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
            {formatNumber(totalRows)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>All historical transactions</div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--emerald)', fontSize: '0.85rem', fontWeight: 600 }}>
            <ArrowUpRight size={18} />
            <span>Page Money Transferred</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald)', marginTop: '0.4rem' }}>
            {formatCurrency(pageVolume)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Total value on current page</div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--purple)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Activity size={18} />
            <span>Transfer Success Rate</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cyan)', marginTop: '0.4rem' }}>
            {pageSuccessRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{successCount} of {transactions.length} successful on page</div>
        </div>
      </div>

      {/* Filter and Date Slicer Bar */}
      <div className="card glass-panel" style={{ padding: '1.2rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Transaction ID (TXN...) or Customer ID (C0003)..."
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
              <option value="All">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              style={{
                padding: '0.55rem 0.8rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            >
              <option value="All">All Types</option>
              <option value="Deposit">Deposit (Credit)</option>
              <option value="Withdrawal">Withdrawal (Debit)</option>
              <option value="Transfer">Transfer</option>
              <option value="Payment">Payment</option>
              <option value="Bill Pay">Bill Pay</option>
              <option value="Salary">Salary</option>
              <option value="POS">POS</option>
              <option value="online fraud">Online Fraud</option>
            </select>

            <button type="submit" className="btn btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
              Filter
            </button>

            <button 
              type="button" 
              onClick={handleResetFilters}
              title="Reset Filters"
              style={{
                padding: '0.55rem',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Transactions Data Table */}
      <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Timestamp</th>
                <th style={{ textAlign: 'right' }}>Settlement Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading transactions from MySQL ledger...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No transactions found for the specified filters.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => {
                  const isCredit = ['Deposit', 'Salary', 'Refund', 'deposit'].includes(t.txn_type);
                  const isFailed = t.status === 'failed';

                  return (
                    <tr key={t.txn_id}>
                      <td>
                        <span className="badge badge-cyan" style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          {t.txn_id}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{t.customer_name || t.customer_id}</strong>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {t.customer_id}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          t.txn_type === 'online fraud' ? 'badge-rose' :
                          isCredit ? 'badge-emerald' : 'badge-purple'
                        }`}>
                          {t.txn_type}
                        </span>
                      </td>
                      <td>
                        <strong style={{
                          color: isCredit ? 'var(--emerald)' : 'var(--text-primary)',
                          fontSize: '0.92rem'
                        }}>
                          {isCredit ? '+' : '-'}{formatCurrency(t.amount)}
                        </strong>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {t.txn_time || '—'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`badge ${isFailed ? 'badge-rose' : 'badge-emerald'}`}>
                          {t.status.toUpperCase()}
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
            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({formatNumber(totalRows)} transactions)
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
