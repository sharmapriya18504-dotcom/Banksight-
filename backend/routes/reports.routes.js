import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

// Generate comprehensive executive summary report
router.get('/summary', async (req, res) => {
  try {
    const [
      [custStats],
      [accStats],
      [txnStats],
      [loanStats],
      [cardStats],
      [branchRank],
      [ticketStats]
    ] = await Promise.all([
      pool.query(`
        SELECT 
          COUNT(*) as total_customers,
          COUNT(CASE WHEN account_type = 'Savings' THEN 1 END) as savings_customers,
          COUNT(CASE WHEN account_type = 'Current' THEN 1 END) as current_customers,
          ROUND(AVG(age), 1) as avg_customer_age
        FROM customers
      `),
      pool.query(`
        SELECT 
          COUNT(*) as total_accounts,
          ROUND(SUM(account_balance), 2) as total_reserves,
          ROUND(AVG(account_balance), 2) as avg_account_balance,
          ROUND(MAX(account_balance), 2) as max_account_balance
        FROM accounts
      `),
      pool.query(`
        SELECT 
          COUNT(*) as total_transactions,
          ROUND(SUM(amount), 2) as gross_volume,
          ROUND(SUM(CASE WHEN txn_type IN ('Deposit', 'Salary', 'Refund') THEN amount ELSE 0 END), 2) as total_credits,
          ROUND(SUM(CASE WHEN txn_type IN ('Withdrawal', 'Transfer', 'Payment', 'Bill Pay', 'POS') THEN amount ELSE 0 END), 2) as total_debits,
          ROUND(SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as success_rate_pct,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count
        FROM transactions
      `),
      pool.query(`
        SELECT 
          COUNT(*) as total_facilities,
          COUNT(CASE WHEN Loan_Status = 'Active' THEN 1 END) as active_loans,
          ROUND(SUM(CASE WHEN Loan_Status = 'Active' THEN Loan_Amount ELSE 0 END), 2) as active_loan_principal,
          ROUND(AVG(Interest_Rate), 2) as avg_interest_rate
        FROM loans
      `),
      pool.query(`
        SELECT 
          COUNT(*) as total_cards,
          ROUND(SUM(Credit_Limit), 2) as total_credit_limit,
          ROUND(SUM(Current_Balance), 2) as total_utilized_balance,
          ROUND(SUM(Current_Balance) / SUM(Credit_Limit) * 100, 2) as avg_utilization_pct
        FROM credit_cards
      `),
      pool.query(`
        SELECT branch_name, city, branch_revenue, performance_rating
        FROM branches
        ORDER BY branch_revenue DESC
        LIMIT 5
      `),
      pool.query(`
        SELECT 
          COUNT(*) as total_tickets,
          COUNT(CASE WHEN Status IN ('Resolved', 'Closed') THEN 1 END) as resolved_tickets,
          ROUND(AVG(Customer_Rating), 2) as avg_satisfaction_rating
        FROM support_tickets
      `)
    ]);

    res.json({
      generatedAt: new Date().toISOString(),
      reportTitle: 'BankSight Enterprise Financial & Operational Executive Summary',
      executiveMetrics: {
        customers: custStats[0],
        accounts: accStats[0],
        transactions: txnStats[0],
        loans: loanStats[0],
        creditCards: cardStats[0],
        supportTickets: ticketStats[0],
        topBranches: branchRank
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
