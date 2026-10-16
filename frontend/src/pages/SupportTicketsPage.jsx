import React, { useState, useEffect } from 'react';
import { LifeBuoy, Filter, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Clock, Star } from 'lucide-react';
import { API_BASE } from '../config';
import { formatNumber } from '../utils/formatters';

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/api/support-tickets?page=${page}&limit=${limit}&status=${statusFilter}&priority=${priorityFilter}`;
      const res = await fetch(url).then(r => r.json());
      setTickets(res.data || []);
      setTotalRows(res.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, limit, statusFilter, priorityFilter]);

  const totalPages = Math.ceil(totalRows / limit) || 1;

  return (
    <div>
      <div style={{ marginBottom: '1.2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Customer Complaints & Helpdesk
        </h2>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {formatNumber(totalRows)} Total Customer Tickets &bull; Track customer complaints, assigned agents, and resolution progress
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
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 1: Filter Tickets</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Filter by Status (Open vs Resolved) or Priority.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#eff6ff', color: '#1d4ed8', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #bfdbfe' }}>
            2
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 2: Check Complaint Details</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>View the problem category, customer ID, and branch.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#f0fdf4', color: '#15803d', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #86efac' }}>
            3
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 3: Track Resolution</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>See assigned staff member and satisfaction score.</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
            <LifeBuoy size={18} />
            <span>Total Customer Inquiries</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
            {formatNumber(totalRows)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>All historical service requests</div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--amber)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Clock size={18} />
            <span>Current Status Filter</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--amber)', marginTop: '0.4rem' }}>
            {statusFilter}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Filtered service queue</div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--emerald)', fontSize: '0.85rem', fontWeight: 600 }}>
            <Star size={18} />
            <span>Average CSAT Rating</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald)', marginTop: '0.4rem' }}>
            4.2 / 5.0
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Customer satisfaction rating</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card glass-panel" style={{ padding: '1.2rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status:</span>
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
            <option value="Open">Open (Pending)</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
            style={{
              padding: '0.55rem 0.8rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Customer ID</th>
                <th>Branch</th>
                <th>Issue Category</th>
                <th>Priority</th>
                <th>Date Opened</th>
                <th>Channel</th>
                <th>Assigned Agent</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading support tickets from database...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No support tickets found for the given criteria.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.Ticket_ID}>
                    <td>
                      <span className="badge badge-cyan" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        {t.Ticket_ID}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {t.Customer_ID}
                      </span>
                    </td>
                    <td>{t.Branch_Name || '—'}</td>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{t.Issue_Category}</strong>
                    </td>
                    <td>
                      <span className={`badge ${
                        t.Priority === 'Urgent' ? 'badge-rose' :
                        t.Priority === 'High' ? 'badge-amber' :
                        t.Priority === 'Medium' ? 'badge-cyan' : 'badge-emerald'
                      }`}>
                        {t.Priority}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.Date_Opened}</td>
                    <td>{t.Channel || 'Web Portal'}</td>
                    <td>{t.Support_Agent || 'Unassigned'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`badge ${
                        ['Resolved', 'Closed'].includes(t.Status) ? 'badge-emerald' : 'badge-amber'
                      }`}>
                        {t.Status}
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
            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({formatNumber(totalRows)} tickets)
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
