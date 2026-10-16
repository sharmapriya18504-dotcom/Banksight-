import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Landmark, TrendingUp, Coins, CreditCard, LifeBuoy, Building2, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../config';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/reports/summary`).then(r => r.json());
      setReport(res);
    } catch (err) {
      console.error('Error fetching summary report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    if (!report) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `BankSight_Executive_Report_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  };

  const m = report?.executiveMetrics || {};

  return (
    <div>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Banking Reports & Summary Export
          </h2>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Generated live from MySQL core banking tables &bull; {report?.generatedAt ? new Date(report.generatedAt).toLocaleString() : 'Loading...'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={handleDownloadJSON}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', fontSize: '0.88rem', fontWeight: 600 }}
          >
            <Download size={16} />
            <span>Export JSON</span>
          </button>

          <button 
            onClick={handlePrint}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem', fontSize: '0.88rem', fontWeight: 700 }}
          >
            <Printer size={16} />
            <span>Print Report</span>
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
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 1: Review Bank Totals</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Check customer money, loan disbursals, and daily cash flow.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#eff6ff', color: '#1d4ed8', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #bfdbfe' }}>
            2
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 2: Print Report</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Click "Print Report" to save a clean PDF for evaluation.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#f0fdf4', color: '#15803d', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, border: '2px solid #86efac' }}>
            3
          </div>
          <div>
            <strong style={{ color: '#0f172a', fontSize: '0.86rem', display: 'block' }}>Step 3: Export Raw Data</strong>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Click "Export JSON" to download the machine-readable dataset.</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Aggregating bank metrics across all tables...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section 1: Macro Financial Resiliency */}
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Landmark size={20} color="var(--cyan)" />
              <span>1. Total Customer Deposits & Savings Accounts</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Customer Money Saved</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald)', marginTop: '0.3rem' }}>
                  {formatCurrency(m.accounts?.total_reserves)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Across {formatNumber(m.accounts?.total_accounts)} customer accounts
                </div>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Account Balance</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cyan)', marginTop: '0.3rem' }}>
                  {formatCurrency(m.accounts?.avg_account_balance)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Highest Balance: {formatCurrency(m.accounts?.max_account_balance)}
                </div>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Customers</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--purple)', marginTop: '0.3rem' }}>
                  {formatNumber(m.customers?.total_customers)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {m.customers?.savings_customers} Savings &bull; {m.customers?.current_customers} Current
                </div>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Customer Age</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--amber)', marginTop: '0.3rem' }}>
                  {m.customers?.avg_customer_age} Years
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Customer age range
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Transaction Throughput & Inflow/Outflow */}
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <TrendingUp size={20} color="var(--emerald)" />
              <span>2. Money Transfers & Daily Cash Flow</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gross Transaction Volume</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.3rem' }}>
                  {formatCurrency(m.transactions?.gross_volume)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {formatNumber(m.transactions?.total_transactions)} Total transactions recorded
                </div>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Credit Inflow (Deposits/Salaries)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald)', marginTop: '0.3rem' }}>
                  {formatCurrency(m.transactions?.total_credits)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--emerald)', marginTop: '0.2rem' }}>
                  Positive liquidity injection
                </div>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Debit Outflow (Withdrawals/Transfers)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cyan)', marginTop: '0.3rem' }}>
                  {formatCurrency(m.transactions?.total_debits)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Consumer spending & transfers
                </div>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Settlement Success Rate</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--purple)', marginTop: '0.3rem' }}>
                  {m.transactions?.success_rate_pct}%
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--rose)', marginTop: '0.2rem' }}>
                  {m.transactions?.failed_count} Failed transaction attempts
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Credit Risk, Lending & Cards */}
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Coins size={20} color="var(--purple)" />
              <span>3. Credit Risk, Lending Portfolio & Card Utilization</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Loan Exposure</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--purple)', marginTop: '0.3rem' }}>
                  {formatCurrency(m.loans?.active_loan_principal)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {m.loans?.active_loans} of {m.loans?.total_facilities} facilities currently active
                </div>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Loan Interest Coupon</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cyan)', marginTop: '0.3rem' }}>
                  {m.loans?.avg_interest_rate}% p.a.
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Portfolio lending spread
                </div>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Credit Card Debt Utilized</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--amber)', marginTop: '0.3rem' }}>
                  {formatCurrency(m.creditCards?.total_utilized_balance)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Limit: {formatCurrency(m.creditCards?.total_credit_limit)}
                </div>
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Card Line Utilization</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald)', marginTop: '0.3rem' }}>
                  {m.creditCards?.avg_utilization_pct}%
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Across {formatNumber(m.creditCards?.total_cards)} cards
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Top Branches by Revenue */}
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Building2 size={20} color="var(--amber)" />
              <span>4. Top Regional Branches by Operating Revenue</span>
            </h3>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Branch Name</th>
                    <th>City</th>
                    <th>Annual Revenue</th>
                    <th style={{ textAlign: 'right' }}>Performance Score</th>
                  </tr>
                </thead>
                <tbody>
                  {m.topBranches?.map((b, idx) => (
                    <tr key={b.branch_name}>
                      <td>
                        <span className="badge badge-cyan">#{idx + 1}</span>
                      </td>
                      <td><strong>{b.branch_name}</strong></td>
                      <td>{b.city}</td>
                      <td><strong style={{ color: 'var(--emerald)' }}>{formatCurrency(b.branch_revenue)}</strong></td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-emerald">★ {b.performance_rating} / 5</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
