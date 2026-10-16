import React, { useState, useEffect } from 'react';
import { Database, Search, ChevronLeft, ChevronRight, Download, Filter, Eye } from 'lucide-react';
import { formatNumber, formatCurrency } from '../utils/formatters';

const TABLES = [
  'customers',
  'accounts',
  'transactions',
  'loans',
  'credit_cards',
  'branches',
  'support_tickets'
];

export default function TablesPage() {
  const [selectedTable, setSelectedTable] = useState('customers');
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSchema, setShowSchema] = useState(false);

  const loadTableData = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/tables/${selectedTable}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url).then(r => r.json());
      setData(res.data || []);
      setColumns(res.columns || []);
      setTotalRows(res.totalRows || 0);
    } catch (err) {
      console.error('Error loading table data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [selectedTable, search, limit]);

  useEffect(() => {
    loadTableData();
  }, [selectedTable, page, limit, search]);

  const totalPages = Math.max(1, Math.ceil(totalRows / limit));

  const exportCsv = () => {
    if (data.length === 0) return;
    const colNames = columns.map(c => c.Field);
    const csvContent = [
      colNames.join(','),
      ...data.map(row => colNames.map(c => JSON.stringify(row[c] ?? '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedTable}_page_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '1.2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Database Table Explorer</h1>
            <span className="badge badge-cyan">Schema Inspector</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Browse and search live relational tables with full column data types, pagination, and CSV exports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowSchema(!showSchema)}
            style={{ fontSize: '0.85rem' }}
          >
            <Eye size={15} />
            {showSchema ? 'Hide Schema' : 'View Schema Types'}
          </button>
          <button
            className="btn btn-primary"
            onClick={exportCsv}
            disabled={data.length === 0}
            style={{ fontSize: '0.85rem' }}
          >
            <Download size={15} />
            Export Page (CSV)
          </button>
        </div>
      </div>

      {/* Control Bar: Table Select + Search + Limit */}
      <div className="card glass-panel" style={{ padding: '1.2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 140px', gap: '1rem', alignItems: 'center' }}>

          {/* Table Dropdown */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              DATABASE TABLE
            </label>
            <select
              value={selectedTable}
              onChange={e => setSelectedTable(e.target.value)}
              style={{ padding: '0.65rem', fontWeight: 700 }}
            >
              {TABLES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              SEARCH RECORDS (TEXT COLUMNS)
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                placeholder={`Search within ${selectedTable}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          {/* Rows per page */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              ROWS / PAGE
            </label>
            <select
              value={limit}
              onChange={e => setLimit(parseInt(e.target.value, 10))}
              style={{ padding: '0.65rem' }}
            >
              <option value="15">15 rows</option>
              <option value="25">25 rows</option>
              <option value="50">50 rows</option>
              <option value="100">100 rows</option>
            </select>
          </div>

        </div>
      </div>

      {/* Optional Schema View */}
      {showSchema && (
        <div className="card glass-panel" style={{ padding: '1.2rem', marginBottom: '1.5rem', background: '#0a1020' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.6rem', color: 'var(--cyan)' }}>
            Schema Definition: banksight.{selectedTable} ({columns.length} columns)
          </h4>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {columns.map(c => (
              <div key={c.Field} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                padding: '0.4rem 0.7rem',
                borderRadius: '6px',
                fontSize: '0.78rem'
              }}>
                <strong style={{ color: 'var(--text-primary)' }}>{c.Field}</strong>
                <span style={{ color: 'var(--cyan)', marginLeft: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                  {c.Type}
                </span>
                {c.Key === 'PRI' && <span className="badge badge-emerald" style={{ marginLeft: '0.4rem', fontSize: '0.62rem' }}>PK</span>}
                {c.Key === 'MUL' && <span className="badge badge-purple" style={{ marginLeft: '0.4rem', fontSize: '0.62rem' }}>FK</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table Display */}
      <div className="card glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Table: <code>{selectedTable}</code></h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Total: <strong>{formatNumber(totalRows)}</strong> records &bull; Page {page} of {totalPages}
            </span>
          </div>

          {/* Pagination Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{ padding: '0.4rem 0.7rem' }}
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0 0.5rem' }}>
              {page} / {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{ padding: '0.4rem 0.7rem' }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="table-container" style={{ maxHeight: '520px', overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                {columns.map(c => (
                  <th key={c.Field}>{c.Field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {columns.map(c => {
                      const val = row[c.Field];
                      const isMoney = typeof val === 'number' && (c.Field.includes('balance') || c.Field.includes('amount') || c.Field.includes('revenue') || c.Field.includes('Limit'));
                      return (
                        <td key={c.Field}>
                          {isMoney ? formatCurrency(val) : String(val ?? '')}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length || 1} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    {loading ? 'Fetching table records...' : 'No records match search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
