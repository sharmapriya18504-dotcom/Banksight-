import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import AccountsPage from './pages/AccountsPage';
import TransactionsPage from './pages/TransactionsPage';
import LoansPage from './pages/LoansPage';
import CreditCardsPage from './pages/CreditCardsPage';
import BranchesPage from './pages/BranchesPage';
import SupportTicketsPage from './pages/SupportTicketsPage';
import InsightsPage from './pages/InsightsPage';
import SimulationPage from './pages/SimulationPage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';

import { API_BASE } from './config';

export default function App() {
  const [dbStatus, setDbStatus] = useState(null);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      const data = await res.json();
      setDbStatus(data);
    } catch (err) {
      setDbStatus({ connected: false, message: err.message });
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Main App Layout containing the 12 Navigation Sections */}
          <Route element={<AppLayout dbStatus={dbStatus} />}>
            <Route path="/" element={<DashboardPage dbStatus={dbStatus} />} />
            <Route path="/dashboard" element={<DashboardPage dbStatus={dbStatus} />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/credit-cards" element={<CreditCardsPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/support-tickets" element={<SupportTicketsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
