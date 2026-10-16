import React, { useState, useEffect } from 'react';
import {
  FileSearch,
  Database,
  Clock,
  Code2,
  Download,
  Check,
  Copy,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Table,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { API_BASE } from '../config';

export default function InsightsPage() {
  const [catalog, setCatalog] = useState([]);
  const [selectedId, setSelectedId] = useState('Q01');
  const [category, setCategory] = useState('All');
  const [queryDetail, setQueryDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Load catalog
  useEffect(() => {
    fetch(`${API_BASE}/api/insights`)
      .then(r => r.json())
      .then(d => {
        setCatalog(d || []);
      })
      .catch(err => console.error('Error fetching catalog:', err));
  }, []);

  // Load specific query
  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    fetch(`${API_BASE}/api/insights/${selectedId}`)
      .then(r => r.json())
      .then(d => {
        setQueryDetail(d);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching insight:', err);
        setLoading(false);
      });
  }, [selectedId]);

  const categories = ['All', ...new Set(catalog.map(c => c.category))];
  const filteredCatalog = catalog.filter(c => {
    const matchesCat = category === 'All' || c.category === category;
    const qStr = searchQuery.toLowerCase().trim();
    const matchesSearch = !qStr ||
      c.title.toLowerCase().includes(qStr) ||
      c.id.toLowerCase().includes(qStr) ||
      (c.question && c.question.toLowerCase().includes(qStr));
    return matchesCat && matchesSearch;
  });

  const copySql = () => {
    if (queryDetail?.sql) {
      navigator.clipboard.writeText(queryDetail.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportCsv = () => {
    if (!queryDetail?.data || queryDetail.data.length === 0) return;
    const cols = Object.keys(queryDetail.data[0]);
    const csvContent = [
      cols.join(','),
      ...queryDetail.data.map(row => cols.map(c => JSON.stringify(row[c] ?? '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedId}_${queryDetail.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem 1rem' }}>

      {/* Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #bfdbfe',
        borderLeft: '5px solid #2563eb',
        borderRadius: '14px',
        padding: '1.4rem 1.8rem',
        marginBottom: '1.2rem',
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span className="live-dot-success" style={{ margin: 0 }}></span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Final Year Major Academic Project
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: '0.1rem 0' }}>
            15 Operational Banking Insights (SQL)
          </h1>
          <p style={{ color: '#475569', fontSize: '0.92rem', margin: '0.2rem 0 0 0' }}>
            Pre-computed bank analytical answers across 15 operational queries. Pick any query from the left list to see the live results.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            padding: '0.45rem 0.9rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#15803d'
          }}>
            <span className="live-dot-success" style={{ margin: 0, width: '8px', height: '8px' }}></span>
            15 / 15 Queries Ready
          </div>
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
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 1: Choose a Question</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Click any question on the left list (or use search).</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#f0fdf4', color: '#15803d', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #86efac' }}>
            2
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 2: View Live Answer & Data</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Read the answer and see the real bank rows instantly.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#f5f3ff', color: '#6d28d9', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #ddd6fe' }}>
            3
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 3: Copy SQL / Download CSV</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>One-click copy the SQL code or export table to Excel.</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginRight: '0.2rem' }}>
          Filter Domain:
        </span>
        {categories.map(cat => {
          const isActive = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                border: isActive ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                background: isActive ? '#2563eb' : '#ffffff',
                color: isActive ? '#ffffff' : '#334155',
                boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.28)' : '0 1px 3px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.6rem', alignItems: 'start' }}>

        {/* Left Query Selector List */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '14px',
          padding: '1.1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          maxHeight: '820px',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.6rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Question ({filteredCatalog.length})
            </span>
            <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              Live Database
            </span>
          </div>

          {/* Quick Search Input */}
          <div style={{ marginBottom: '0.8rem' }}>
            <input
              type="text"
              placeholder="🔍 Search question..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                fontSize: '0.82rem',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                background: '#f8fafc',
                color: '#0f172a'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredCatalog.map(item => {
              const isSelected = selectedId === item.id;
              const isHovered = hoveredId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isSelected
                      ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                      : isHovered
                        ? '#f8fafc'
                        : '#ffffff',
                    border: isSelected
                      ? '1.5px solid #3b82f6'
                      : isHovered
                        ? '1px solid #bfdbfe'
                        : '1px solid #e2e8f0',
                    borderLeft: isSelected
                      ? '5px solid #1d4ed8'
                      : '1px solid #e2e8f0',
                    boxShadow: isSelected
                      ? '0 4px 12px rgba(37, 99, 235, 0.12)'
                      : '0 1px 2px rgba(0,0,0,0.02)',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: isSelected ? '#ffffff' : '#1e40af',
                      background: isSelected ? '#1d4ed8' : '#e0e7ff',
                      padding: '2px 7px',
                      borderRadius: '5px',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.5px'
                    }}>
                      {item.id}
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: isSelected ? '#1d4ed8' : '#64748b'
                    }}>
                      {item.category}
                    </span>
                  </div>

                  {/* Title with ALWAYS readable high-contrast dark color */}
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 800 : 600,
                    color: isSelected ? '#0f172a' : '#334155',
                    lineHeight: 1.4
                  }}>
                    {item.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Query Details & Results */}
        <div>
          {queryDetail ? (
            <div>
              {/* Insight Metadata Header Card */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.8rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                      <span className="badge badge-purple" style={{ fontSize: '0.74rem' }}>{queryDetail.category}</span>
                      <span className="badge badge-blue" style={{ fontSize: '0.74rem' }}>QUERY {queryDetail.id}</span>
                      <span className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>
                        <span className="live-dot-success" style={{ margin: 0, width: '7px', height: '7px' }}></span>
                        MySQL InnoDB Verified
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0' }}>
                      {queryDetail.title}
                    </h2>

                    {/* Official Requirement Question: High-contrast, crystal clear */}
                    {queryDetail.question && (
                      <div style={{
                        background: 'linear-gradient(135deg, #eff6ff 0%, #f0f7ff 100%)',
                        border: '1.5px solid #bfdbfe',
                        borderLeft: '5px solid #2563eb',
                        padding: '1rem 1.25rem',
                        borderRadius: '0 10px 10px 0',
                        margin: '0.9rem 0 0.7rem 0',
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.04)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.3rem' }}>
                          <span className="live-dot-success" style={{ margin: 0, width: '8px', height: '8px' }}></span>
                          <span style={{ fontSize: '0.74rem', color: '#1d4ed8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Official Requirement Question:
                          </span>
                        </div>
                        <p style={{ color: '#0f172a', fontWeight: 700, fontSize: '1.05rem', margin: 0, lineHeight: 1.55 }}>
                          "{queryDetail.question}"
                        </p>
                      </div>
                    )}

                    <p style={{ color: '#475569', fontSize: '0.92rem', marginTop: '0.5rem', lineHeight: 1.6, maxWidth: '850px' }}>
                      {queryDetail.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
                    <button
                      onClick={copySql}
                      className="btn"
                      style={{
                        background: '#f1f5f9',
                        color: '#334155',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                        padding: '0.55rem 0.95rem'
                      }}
                    >
                      {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                      {copied ? 'SQL Copied!' : 'Copy SQL'}
                    </button>
                    <button
                      onClick={exportCsv}
                      className="btn btn-primary"
                      style={{ fontSize: '0.82rem', padding: '0.55rem 1rem' }}
                    >
                      <Download size={14} />
                      Export CSV ({queryDetail.rowsCount} Rows)
                    </button>
                  </div>
                </div>

                {/* Diagnostics metric badges */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginTop: '1.4rem',
                  paddingTop: '1.2rem',
                  borderTop: '1.5px solid #f1f5f9'
                }}>
                  <div style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem'
                  }}>
                    <div style={{ background: '#eff6ff', padding: '0.5rem', borderRadius: '8px', color: '#2563eb' }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Execution Latency</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1d4ed8' }}>{queryDetail.latencyMs} ms</div>
                    </div>
                  </div>

                  <div style={{
                    background: '#f0fdf4',
                    border: '1.5px solid #bbf7d0',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem'
                  }}>
                    <div style={{ background: '#dcfce7', padding: '0.5rem', borderRadius: '8px', color: '#16a34a' }}>
                      <Database size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#15803d', textTransform: 'uppercase', fontWeight: 700 }}>Records Found</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d' }}>{formatNumber(queryDetail.rowsCount)} rows</div>
                    </div>
                  </div>

                  <div style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem'
                  }}>
                    <div style={{ background: '#f5f3ff', padding: '0.5rem', borderRadius: '8px', color: '#7c3aed' }}>
                      <Layers size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Storage Engine</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#6d28d9' }}>InnoDB (ACID)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SQL Code View */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.4rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code2 size={18} color="#2563eb" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      Executed SQL Syntax (Verified on MySQL 8.0 / 9.5)
                    </span>
                  </div>
                  <button
                    onClick={copySql}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Copy size={13} />
                    Copy Code
                  </button>
                </div>
                <pre style={{
                  background: '#f8fafc',
                  padding: '1.1rem',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  color: '#1e3a8a',
                  overflowX: 'auto',
                  lineHeight: 1.6,
                  border: '1.5px solid #bfdbfe',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {queryDetail.sql?.trim()}
                </pre>
              </div>

              {/* Query Results Data Table */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.5rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Table size={18} color="#2563eb" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Query Results Dataset
                    </h3>
                  </div>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px',
                    border: '1px solid #bfdbfe'
                  }}>
                    {queryDetail.rowsCount} Records Returned
                  </span>
                </div>

                <div className="table-container" style={{ maxHeight: '460px', overflowY: 'auto' }}>
                  {queryDetail.data && queryDetail.data.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          {Object.keys(queryDetail.data[0]).map(col => (
                            <th key={col}>{col.replace(/_/g, ' ')}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryDetail.data.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {Object.entries(row).map(([k, val], cIdx) => (
                              <td key={cIdx}>
                                {typeof val === 'number' && (k.includes('volume') || k.includes('balance') || k.includes('amount') || k.includes('revenue') || k.includes('disbursed'))
                                  ? <strong style={{ color: '#1d4ed8' }}>{formatCurrency(val)}</strong>
                                  : String(val ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      No records returned for this query on the active database dataset.
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              padding: '4rem 2rem',
              textAlign: 'center'
            }}>
              <Sparkles size={40} color="#2563eb" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: '#0f172a', fontWeight: 800 }}>Loading Analytical Query...</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                Fetching results directly from MySQL InnoDB tables.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
