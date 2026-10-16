import React, { useState, useEffect } from 'react';
import {
  Coins,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  History,
  AlertTriangle,
  Info
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { API_BASE } from '../config';

export default function SimulationPage() {
  const [accounts, setAccounts] = useState([]);
  const [selectedCid, setSelectedCid] = useState('');
  const [action, setAction] = useState('deposit');
  const [amount, setAmount] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [history, setHistory] = useState([]);

  // Load eligible accounts from database
  const loadAccounts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/simulate/accounts`).then(r => r.json());
      setAccounts(res || []);
      if (res && res.length > 0 && !selectedCid) {
        setSelectedCid(res[0].customer_id);
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  // Load history for selected account
  const loadHistory = async (cid) => {
    if (!cid) return;
    try {
      const res = await fetch(`${API_BASE}/api/simulate/history/${cid}`).then(r => r.json());
      setHistory(res || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (selectedCid) {
      loadHistory(selectedCid);
      setReceipt(null);
      setErrorMsg('');
    }
  }, [selectedCid]);

  const selectedAcc = accounts.find(a => a.customer_id === selectedCid);
  const currentBalance = parseFloat(selectedAcc?.account_balance || 0);

  // Projected balance calculation
  const numAmount = parseFloat(amount || 0);
  const projectedBalance = action === 'deposit'
    ? currentBalance + numAmount
    : currentBalance - numAmount;
  const MIN_BALANCE = 1000.0;
  const isSufficient = action === 'deposit' || (currentBalance - numAmount >= MIN_BALANCE);

  const handleExecute = async (e) => {
    if (e) e.preventDefault();
    if (!selectedCid) return;
    if (numAmount <= 0) {
      setErrorMsg('Transaction amount must be greater than ₹0.00.');
      return;
    }

    setLoading(true);
    setReceipt(null);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/api/simulate/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCid,
          action,
          amount: numAmount
        })
      });

      const data = await res.json();
      if (data.success) {
        setReceipt(data);
        await loadAccounts();
        await loadHistory(selectedCid);
      } else {
        setErrorMsg(data.message || 'Transaction was declined and rolled back.');
      }
    } catch (err) {
      setErrorMsg(`Network or API execution error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '1rem 0 3rem 0' }}>

      {/* Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderLeft: '4px solid #2563eb',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Money Transfer
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.2rem 0 0 0' }}>
            Simulate real-time deposits and withdrawals with live MySQL balance updates.
          </p>
        </div>
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          padding: '0.35rem 0.8rem',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#1d4ed8'
        }}>
          <Info size={14} />
          <span>Demo Simulation Mode</span>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="card glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleExecute} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

          {/* 1. Select Customer Account */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              1. Select Customer Account
            </label>
            <select
              value={selectedCid}
              onChange={e => setSelectedCid(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.92rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border-medium)',
                background: '#ffffff',
                color: 'var(--text-primary)',
                fontWeight: 600
              }}
            >
              {accounts.map(a => (
                <option key={a.customer_id} value={a.customer_id}>
                  {a.customer_id} — {a.name} ({a.city}) | Balance: {formatCurrency(a.account_balance)}
                </option>
              ))}
            </select>

            {/* Current Balance Display Card */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem 1.2rem',
              marginTop: '0.8rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.6rem'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Current Account Balance
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e3a8a', marginTop: '0.1rem' }}>
                  {formatCurrency(currentBalance)}
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                <div><strong>{selectedAcc?.name}</strong></div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>{selectedAcc?.account_type || 'Savings'} Account &bull; {selectedAcc?.city}</div>
              </div>
            </div>
          </div>

          {/* 2. Choose Operation */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              2. Choose Operation
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setAction('deposit')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${action === 'deposit' ? '#16a34a' : 'var(--border-medium)'}`,
                  background: action === 'deposit' ? '#f0fdf4' : '#ffffff',
                  color: action === 'deposit' ? '#15803d' : 'var(--text-secondary)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <ArrowDownRight size={18} />
                <span>Deposit (Add Money)</span>
              </button>

              <button
                type="button"
                onClick={() => setAction('withdrawal')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${action === 'withdrawal' ? '#dc2626' : 'var(--border-medium)'}`,
                  background: action === 'withdrawal' ? '#fef2f2' : '#ffffff',
                  color: action === 'withdrawal' ? '#b91c1c' : 'var(--text-secondary)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <ArrowUpRight size={18} />
                <span>Withdraw (Deduct Money)</span>
              </button>
            </div>
          </div>

          {/* 3. Enter Amount */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              3. Enter Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              max="10000000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount in ₹..."
              required
              style={{
                width: '100%',
                fontSize: '1.25rem',
                fontWeight: 800,
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border-medium)',
                background: '#ffffff',
                color: 'var(--text-primary)'
              }}
            />

            {/* Quick preset buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Select:</span>
              {[1000, 5000, 10000, 25000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '4px',
                    background: '#f1f5f9',
                    border: '1px solid var(--border-subtle)',
                    color: '#1e3a8a',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  +{formatCurrency(val)}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Transaction Summary & Projected Balance */}
          <div style={{
            background: isSufficient ? '#f8fafc' : '#fef2f2',
            border: `1.5px solid ${isSufficient ? 'var(--border-subtle)' : '#fca5a5'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '1rem 1.25rem'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              4. Transaction Summary
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Current Balance: </span>
                <strong>{formatCurrency(currentBalance)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Transaction: </span>
                <strong style={{ color: action === 'deposit' ? '#16a34a' : '#dc2626' }}>
                  {action === 'deposit' ? '+' : '-'}{formatCurrency(numAmount)}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Projected Balance: </span>
                <strong style={{ color: isSufficient ? '#1e3a8a' : '#dc2626', fontSize: '1.05rem' }}>
                  {formatCurrency(projectedBalance)}
                </strong>
              </div>
            </div>

            {/* Validation warning */}
            {!isSufficient && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.6rem' }}>
                <AlertTriangle size={15} />
                <span>Minimum balance rule: Accounts must retain at least ₹1,000. This withdrawal will be declined.</span>
              </div>
            )}
          </div>

          {/* 5. Action Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || numAmount <= 0}
            style={{
              width: '100%',
              padding: '0.9rem',
              fontSize: '1rem',
              fontWeight: 800,
              background: action === 'deposit'
                ? 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)'
                : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              borderColor: action === 'deposit' ? '#1d4ed8' : '#dc2626',
              boxShadow: action === 'deposit'
                ? '0 4px 14px rgba(37, 99, 235, 0.25)'
                : '0 4px 14px rgba(220, 38, 38, 0.25)',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading
              ? 'Processing Transaction...'
              : (action === 'deposit'
                  ? `Confirm Deposit of ${formatCurrency(numAmount)}`
                  : `Confirm Withdrawal of ${formatCurrency(numAmount)}`)}
          </button>

          {/* 6. Success Receipt Display */}
          {receipt && (
            <div style={{
              background: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              marginTop: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 800, fontSize: '1rem' }}>
                  <CheckCircle2 size={18} />
                  <span>Transaction Confirmed</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 700 }}>
                  Ref: {receipt.txnId}
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                <div><strong>Action:</strong> <span style={{ textTransform: 'capitalize' }}>{receipt.action}</span></div>
                <div><strong>Amount:</strong> {formatCurrency(receipt.amount)}</div>
                <div><strong>Opening Balance:</strong> {formatCurrency(receipt.previousBalance)}</div>
                <div><strong>Updated Balance:</strong> <strong style={{ color: '#15803d' }}>{formatCurrency(receipt.newBalance)}</strong></div>
                <div><strong>Timestamp:</strong> {formatDate(receipt.timestamp)}</div>
              </div>
            </div>
          )}

          {/* 6. Error Alert Display */}
          {errorMsg && (
            <div style={{
              background: '#fef2f2',
              border: '1.5px solid #fca5a5',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem 1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem'
            }}>
              <XCircle size={20} color="#dc2626" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#b91c1c', fontSize: '0.9rem' }}>Transaction Declined</strong>
                <p style={{ color: '#991b1b', fontSize: '0.84rem', margin: '0.2rem 0 0 0' }}>{errorMsg}</p>
              </div>
            </div>
          )}

        </form>
      </div>

      {/* Transaction History Section (Below the form) */}
      <div className="card glass-panel" style={{ padding: '1.8rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={18} color="#2563eb" />
              <span>Recent Transactions for this Account</span>
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '0.2rem 0 0 0' }}>
              Last 10 ledger entries for customer {selectedCid} (updates automatically after every transaction)
            </p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Txn Reference</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date & Time</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((t, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 700 }}>
                      {t.txn_id}
                    </td>
                    <td style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                      {t.txn_type === 'credit' ? '➕ Deposit' : '➖ Withdrawal'}
                    </td>
                    <td style={{ fontWeight: 800, color: t.txn_type === 'credit' ? '#15803d' : '#b91c1c' }}>
                      {formatCurrency(t.amount)}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {formatDate(t.txn_time)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`badge ${t.status === 'success' ? 'badge-emerald' : 'badge-rose'}`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No recent transactions recorded for this account.
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
