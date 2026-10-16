import React, { useState } from 'react';
import {
  Users,
  Landmark,
  Building2,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { API_BASE } from '../config';

export default function CrudPage() {
  const [tab, setTab] = useState('customers');
  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Customer Form state
  const [cId, setCId] = useState('C0501');
  const [cName, setCName] = useState('');
  const [cGender, setCGender] = useState('M');
  const [cAge, setCAge] = useState(28);
  const [cCity, setCCity] = useState('');
  const [cAccType, setCAccType] = useState('Savings');
  const [delCid, setDelCid] = useState('');

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!cId || !cName || !cCity) {
      setStatusMsg({ type: 'error', text: 'Customer ID, Name, and City are required fields.' });
      return;
    }
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch(`${API_BASE}/api/crud/customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: cId,
          name: cName,
          gender: cGender,
          age: cAge,
          city: cCity,
          accountType: cAccType
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({ type: 'success', text: data.message });
        setCName('');
        setCCity('');
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to register customer.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!delCid) {
      setStatusMsg({ type: 'error', text: 'Please enter a Customer ID to delete.' });
      return;
    }
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch(`${API_BASE}/api/crud/customer/${delCid}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({ type: 'success', text: data.message });
        setDelCid('');
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Delete failed.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

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
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Enterprise Data Management (CRUD)</h1>
            <span className="badge badge-amber">FK Guard Active</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Validated, parameterized Create, Read, Update, and Delete operations with relational integrity protection.
          </p>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMsg && (
        <div style={{
          background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
          border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.2rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          color: statusMsg.type === 'success' ? 'var(--emerald)' : 'var(--rose)',
          fontSize: '0.92rem',
          fontWeight: 600
        }}>
          {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.8rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.8rem' }}>
        {[
          { id: 'customers', label: 'Customer Directory', icon: <Users size={16} /> },
          { id: 'rules', label: 'Ledger CRUD Rules', icon: <Landmark size={16} /> }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setStatusMsg(null); }}
            className={`btn ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.88rem' }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Customer Management */}
      {tab === 'customers' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '2rem' }}>

          {/* Create Customer Form */}
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} color="var(--cyan)" />
              Register New Banking Customer
            </h3>

            <form onSubmit={handleAddCustomer}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    CUSTOMER ID
                  </label>
                  <input
                    type="text"
                    value={cId}
                    onChange={e => setCId(e.target.value)}
                    placeholder="e.g. C0501"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={cName}
                    onChange={e => setCName(e.target.value)}
                    placeholder="e.g. Arjun Patel"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    GENDER
                  </label>
                  <select value={cGender} onChange={e => setCGender(e.target.value)}>
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
                    <option value="O">Other (O)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    AGE
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="120"
                    value={cAge}
                    onChange={e => setCAge(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    ACCOUNT TYPE
                  </label>
                  <select value={cAccType} onChange={e => setCAccType(e.target.value)}>
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  RESIDENTIAL CITY
                </label>
                <input
                  type="text"
                  value={cCity}
                  onChange={e => setCCity(e.target.value)}
                  placeholder="e.g. Mumbai, Delhi, Bengaluru"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.8rem' }}
              >
                {loading ? 'Submitting to MySQL...' : 'Register Customer Profile'}
              </button>
            </form>
          </div>

          {/* Delete Customer with FK Warning */}
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rose)' }}>
              <Trash2 size={20} />
              Delete Customer
            </h3>

            <div style={{
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.8rem',
              fontSize: '0.8rem',
              color: '#fca5a5',
              lineHeight: 1.4,
              marginBottom: '1.2rem'
            }}>
              <strong>Foreign Key Protection:</strong> Customers with active accounts or recorded transactions cannot be deleted directly without closing their dependencies.
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                CUSTOMER ID TO REMOVE
              </label>
              <input
                type="text"
                placeholder="e.g. C0501"
                value={delCid}
                onChange={e => setDelCid(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteCustomer}
              disabled={loading || !delCid}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              Verify & Permanently Delete
            </button>
          </div>

        </div>
      )}

      {/* Tab 2: Ledger CRUD Rules */}
      {tab === 'rules' && (
        <div className="card glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Financial Ledger Integrity Standards</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            In modern core banking systems, balance updates and transaction records must never be directly manipulated via raw ad-hoc UPDATE or DELETE queries. Doing so destroys financial auditability.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ color: 'var(--emerald)', marginBottom: '0.5rem' }}>✅ Audited Operations (BankSight Standard)</h4>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li>All deposits and withdrawals pass through the <strong>ACID Ledger Simulator</strong>.</li>
                <li>Uses <code>SELECT ... FOR UPDATE</code> row-level locking to avoid race conditions.</li>
                <li>Automated cryptographic transaction identifiers (<code>TXN...</code>) generated for each entry.</li>
                <li>Rollback triggered if funds are insufficient or database encounters constraint violation.</li>
              </ul>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ color: 'var(--rose)', marginBottom: '0.5rem' }}>❌ Prohibited Operations (Safety Enforced)</h4>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li>Direct arbitrary balance updates bypassing transaction logs are disabled.</li>
                <li>Deleting accounts with positive balances is restricted without explicit confirmation.</li>
                <li>Foreign Key cascade deletions that orphan transaction histories are blocked.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
