import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Eye, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Landmark,
  Coins,
  CreditCard
} from 'lucide-react';
import { API_BASE } from '../config';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export default function CustomersPage() {
  const { isAdmin } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Customer Detail Drawer state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // Add Customer Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCid, setNewCid] = useState('C0501');
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState('M');
  const [newAge, setNewAge] = useState(30);
  const [newCity, setNewCity] = useState('');
  const [newAccType, setNewAccType] = useState('Savings');
  const [actionMsg, setActionMsg] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/api/customers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&city=${cityFilter}&accountType=${typeFilter}`;
      const res = await fetch(url).then(r => r.json());
      setCustomers(res.data || []);
      setTotalRows(res.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, limit, cityFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  const handleViewCustomer = async (cid) => {
    setSelectedCustomer(cid);
    setDetailLoading(true);
    setDetailData(null);
    try {
      const res = await fetch(`${API_BASE}/api/customers/${cid}`).then(r => r.json());
      setDetailData(res);
    } catch (err) {
      console.error('Error fetching customer detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setActionMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          customerId: newCid,
          name: newName,
          gender: newGender,
          age: newAge,
          city: newCity,
          accountType: newAccType
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMsg({ type: 'success', text: data.message });
        setShowAddModal(false);
        setNewName('');
        setNewCity('');
        fetchCustomers();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'Failed to add customer.' });
      }
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message });
    }
  };

  const handleDeleteCustomer = async (cid) => {
    if (!window.confirm(`Are you sure you want to delete customer ${cid}? This action verifies that no active accounts or transaction ledgers exist.`)) {
      return;
    }
    setActionMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/customers/${cid}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMsg({ type: 'success', text: data.message });
        if (selectedCustomer === cid) setSelectedCustomer(null);
        fetchCustomers();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'Delete failed.' });
      }
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message });
    }
  };

  const totalPages = Math.ceil(totalRows / limit) || 1;

  return (
    <div>
      {/* Top Banner & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Customer Profiles & Accounts
          </h2>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {formatNumber(totalRows)} Total Registered Customers &bull; Click any customer to view full profile
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => { setShowAddModal(true); setActionMsg(null); }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem', fontSize: '0.88rem', fontWeight: 700 }}
          >
            <Plus size={16} />
            <span>Add New Customer</span>
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
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 1: Search Customer</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Search by Name or Customer ID (e.g. C0003) below.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#eff6ff', color: '#1d4ed8', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #bfdbfe' }}>
            2
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 2: Click "View Profile"</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Open their complete profile with savings, loans, and cards.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#f0fdf4', color: '#15803d', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #86efac' }}>
            3
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 3: Add Customer</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Click "Add New Customer" above to insert a new person.</span>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionMsg && (
        <div style={{
          padding: '0.8rem 1rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.2rem',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: actionMsg.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${actionMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: actionMsg.type === 'success' ? 'var(--emerald)' : 'var(--rose)'
        }}>
          {actionMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card glass-panel" style={{ padding: '1.2rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Customer ID (e.g. C0003) or Name..."
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

          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
              <option value="All">All Account Types</option>
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
            </select>

            <button type="submit" className="btn btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Customer Data Table */}
      <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Full Name</th>
                <th>Gender / Age</th>
                <th>City</th>
                <th>Account Type</th>
                <th>Bank Balance</th>
                <th>Join Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading bank customers from MySQL database...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No customer records found matching your search.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.customer_id}>
                    <td>
                      <span className="badge badge-cyan" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        {c.customer_id}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{c.name}</strong>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-muted)' }}>{c.gender}</span> / {c.age} yrs
                    </td>
                    <td>{c.city}</td>
                    <td>
                      <span className={`badge ${c.account_type === 'Savings' ? 'badge-emerald' : 'badge-purple'}`}>
                        {c.account_type}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--cyan)' }}>
                        {formatCurrency(c.balance)}
                      </strong>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {formatDate(c.join_date)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleViewCustomer(c.customer_id)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Eye size={13} />
                          <span>View Profile</span>
                        </button>

                        <button
                          onClick={() => handleDeleteCustomer(c.customer_id)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: 'var(--rose)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
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
            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({formatNumber(totalRows)} total records)
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

      {/* Customer 360 Inspect Drawer */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '540px',
          maxWidth: '95vw',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.7)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.8rem',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="badge badge-cyan">{selectedCustomer}</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Customer Profile</h3>
            </div>
            <button 
              onClick={() => setSelectedCustomer(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {detailLoading || !detailData ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading customer banking records...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              {/* Demographics Card */}
              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', color: 'var(--cyan)', fontSize: '0.95rem' }}>Personal & Address Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.82rem' }}>
                  <div>Full Name: <strong>{detailData.customer?.name}</strong></div>
                  <div>City: <strong>{detailData.customer?.city}</strong></div>
                  <div>Age: <strong>{detailData.customer?.age} years</strong></div>
                  <div>Gender: <strong>{detailData.customer?.gender}</strong></div>
                  <div>Account Opened: <strong>{formatDate(detailData.customer?.join_date)}</strong></div>
                  <div>Account Type: <strong>{detailData.customer?.account_type}</strong></div>
                </div>
              </div>

              {/* Deposit Account */}
              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', color: 'var(--emerald)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Landmark size={16} />
                  <span>Bank Account & Available Balance</span>
                </h4>
                {detailData.account ? (
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald)', margin: '0.3rem 0' }}>
                      {formatCurrency(detailData.account.account_balance)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Last Updated: {formatDate(detailData.account.last_updated)}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No deposit account record.</div>
                )}
              </div>

              {/* Linked Loans */}
              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', color: 'var(--purple)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Coins size={16} />
                  <span>Approved Loans & Borrowings ({detailData.loans?.length || 0})</span>
                </h4>
                {detailData.loans?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {detailData.loans.map(l => (
                      <div key={l.Loan_ID} style={{ padding: '0.6rem', background: 'var(--bg-secondary)', borderRadius: '4px', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                          <span>{l.Loan_Type} (#{l.Loan_ID})</span>
                          <span style={{ color: 'var(--purple)' }}>{formatCurrency(l.Loan_Amount)}</span>
                        </div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Rate: {l.Interest_Rate}% &bull; {l.Branch}</span>
                          <span className={`badge ${l.Loan_Status === 'Active' ? 'badge-emerald' : 'badge-cyan'}`}>{l.Loan_Status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No active loan accounts.</div>
                )}
              </div>

              {/* Linked Credit Cards */}
              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', color: 'var(--amber)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={16} />
                  <span>Credit Cards ({detailData.creditCards?.length || 0})</span>
                </h4>
                {detailData.creditCards?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {detailData.creditCards.map(c => (
                      <div key={c.Card_ID} style={{ padding: '0.6rem', background: 'var(--bg-secondary)', borderRadius: '4px', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                          <span>{c.Card_Network} {c.Card_Type}</span>
                          <span style={{ color: 'var(--amber)' }}>Limit: {formatCurrency(c.Credit_Limit)}</span>
                        </div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Balance: {formatCurrency(c.Current_Balance)}</span>
                          <span className="badge badge-cyan">{c.Status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No credit card accounts.</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Customer Modal (Admin Only) */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '1rem'
        }}>
          <div className="card glass-panel" style={{ width: '480px', maxWidth: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Register New Customer</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Customer ID</label>
                <input
                  type="text"
                  value={newCid}
                  onChange={e => setNewCid(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '6px', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  required
                  style={{ width: '100%', padding: '0.65rem', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '6px', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={e => setNewCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    required
                    style={{ width: '100%', padding: '0.65rem', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '6px', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Age</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={e => setNewAge(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.65rem', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '6px', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Gender</label>
                  <select
                    value={newGender}
                    onChange={e => setNewGender(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '6px', color: 'var(--text-primary)' }}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Account Type</label>
                  <select
                    value={newAccType}
                    onChange={e => setNewAccType(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '6px', color: 'var(--text-primary)' }}
                  >
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', marginTop: '0.8rem' }}>
                Save Customer Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
