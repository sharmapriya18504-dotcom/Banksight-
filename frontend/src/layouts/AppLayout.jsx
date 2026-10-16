import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const PAGE_TITLES = {
  '/': { title: 'Dashboard', subtitle: 'Overview of bank performance, deposits, and transaction volume' },
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of bank performance, deposits, and transaction volume' },
  '/customers': { title: 'Customers', subtitle: 'Manage customer accounts and personal banking profiles' },
  '/accounts': { title: 'Accounts', subtitle: 'Real-time account balances and deposit monitoring' },
  '/transactions': { title: 'Transactions', subtitle: 'Audit log of all deposits, withdrawals, and payments' },
  '/loans': { title: 'Loans', subtitle: 'Loan portfolio, active borrowing facilities, and interest rates' },
  '/credit-cards': { title: 'Credit Cards', subtitle: 'Credit limits, card utilization, and outstanding balances' },
  '/branches': { title: 'Branches', subtitle: 'Branch network, staff headcount, and operational revenue' },
  '/support-tickets': { title: 'Support', subtitle: 'Customer service inquiries and ticket resolution' },
  '/insights': { title: 'SQL Insights', subtitle: 'Analytical banking queries with live results' },
  '/simulation': { title: 'Money Transfer', subtitle: 'Deposit and withdrawal simulator (Demo Mode)' },
  '/reports': { title: 'Reports & Exports', subtitle: 'Financial summary and exportable datasets' },
  '/about': { title: 'About BankSight', subtitle: 'Project overview, verified architecture, and system details' }
};

export default function AppLayout({ dbStatus }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentInfo = PAGE_TITLES[location.pathname] || {
    title: 'BankSight Enterprise',
    subtitle: 'Transaction Intelligence Platform'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-dark)' }}>
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        dbStatus={dbStatus} 
      />

      {/* Main Content Area */}
      <div 
        className="main-layout-content"
        style={{
          flex: 1,
          marginLeft: '260px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Header 
          pageTitle={currentInfo.title}
          pageSubtitle={currentInfo.subtitle}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          dbStatus={dbStatus}
        />

        <main style={{ flex: 1, padding: '2rem', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>

        <footer style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.2rem 2rem',
          background: 'var(--bg-primary)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>BankSight Enterprise</strong> &bull; v2.0 Transaction Intelligence
          </div>
          <div>
            Developed by <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Priya Sharma</span> &bull; React + Node.js + MySQL
          </div>
          <div style={{ color: 'var(--text-dim)' }}>
            College Live Project & Technical Portfolio Showcase
          </div>
        </footer>
      </div>
    </div>
  );
}
