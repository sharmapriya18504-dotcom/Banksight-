import React, { useState, useEffect } from 'react';
import { Building2, Search, Star, Users, TrendingUp, DollarSign, MapPin } from 'lucide-react';
import { API_BASE } from '../config';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/branches`).then(r => r.json());
      setBranches(res.data || []);
    } catch (err) {
      console.error('Error fetching branches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const filtered = branches.filter(b => 
    (b.branch_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.city || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.manager_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = branches.reduce((sum, b) => sum + parseFloat(b.branch_revenue || 0), 0);
  const totalEmployees = branches.reduce((sum, b) => sum + parseInt(b.total_employees || 0, 10), 0);
  const avgRating = branches.length > 0 
    ? (branches.reduce((sum, b) => sum + parseInt(b.performance_rating || 0, 10), 0) / branches.length).toFixed(1)
    : 0;

  return (
    <div>
      <div style={{ marginBottom: '1.2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Bank Branches & Locations
        </h2>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {formatNumber(branches.length)} Total Bank Branches &bull; Find branch offices, managers, staff count, and customer ratings
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
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 1: Search Branch</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Search by City, Branch Name, or Branch Manager.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#eff6ff', color: '#1d4ed8', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #bfdbfe' }}>
            2
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 2: Check Branch Size</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>View annual branch revenue and staff employee count.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#f0fdf4', color: '#15803d', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #86efac' }}>
            3
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 3: Branch Rating</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Check customer satisfaction rating out of 5.0.</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Building2 size={18} />
            <span>Total Bank Branches</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
            {formatNumber(branches.length)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Active commercial branches</div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--emerald)', fontSize: '0.85rem', fontWeight: 600 }}>
            <TrendingUp size={18} />
            <span>Total Bank Revenue</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald)', marginTop: '0.4rem' }}>
            {formatCurrency(totalRevenue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Combined annual revenue</div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--purple)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Users size={18} />
            <span>Total Bank Staff</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--purple)', marginTop: '0.4rem' }}>
            {formatNumber(totalEmployees)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Bank tellers, officers & managers</div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--amber)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Star size={18} />
            <span>Average Rating</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--amber)', marginTop: '0.4rem' }}>
            {avgRating} / 5.0
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Customer satisfaction score</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card glass-panel" style={{ padding: '1.2rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Branch Name, City, or Branch Manager..."
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
      </div>

      {/* Branches Table */}
      <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Branch ID</th>
                <th>Branch Name</th>
                <th>City</th>
                <th>Branch Manager</th>
                <th>Staff Count</th>
                <th>Annual Revenue</th>
                <th>Opening Date</th>
                <th style={{ textAlign: 'right' }}>Customer Rating</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading branches from MySQL...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No branches found.
                  </td>
                </tr>
              ) : (
                filtered.slice(0, 30).map((b) => (
                  <tr key={b.branch_id}>
                    <td>
                      <span className="badge badge-cyan" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        #{b.branch_id}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{b.branch_name}</strong>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} color="var(--cyan)" />
                        {b.city}
                      </span>
                    </td>
                    <td>{b.manager_name || '—'}</td>
                    <td>{b.total_employees} staff</td>
                    <td>
                      <strong style={{ color: 'var(--emerald)' }}>
                        {formatCurrency(b.branch_revenue)}
                      </strong>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatDate(b.opening_date)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`badge ${
                        b.performance_rating >= 4 ? 'badge-emerald' :
                        b.performance_rating >= 3 ? 'badge-cyan' : 'badge-amber'
                      }`}>
                        ★ {b.performance_rating} / 5
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '0.8rem 1.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Showing top {Math.min(filtered.length, 30)} of {filtered.length} matched branches
        </div>
      </div>
    </div>
  );
}
