import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

// 1. DASHBOARD KPIS
router.get('/kpis', async (req, res) => {
  try {
    const { startDate, endDate, status, txnTypes } = req.query;

    let whereClauses = ['1=1'];
    let params = [];

    if (startDate && endDate) {
      whereClauses.push('txn_time >= ? AND txn_time <= ?');
      params.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
    }

    if (status && status !== 'All') {
      whereClauses.push('status = ?');
      params.push(status.toLowerCase());
    }

    if (txnTypes) {
      const types = Array.isArray(txnTypes) ? txnTypes : txnTypes.split(',');
      if (types.length > 0) {
        whereClauses.push(`txn_type IN (${types.map(() => '?').join(',')})`);
        params.push(...types);
      }
    }

    const whereSql = whereClauses.join(' AND ');

    const [
      [custCount],
      [accData],
      [txnData],
      [failCount],
      [loanData],
      [cardCount],
      [ticketCount]
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM customers'),
      pool.query('SELECT COUNT(DISTINCT customer_id) as totalAccounts, COALESCE(SUM(account_balance), 0) as totalBalance FROM accounts'),
      pool.query(`SELECT COUNT(*) as totalTxns, COALESCE(SUM(amount), 0) as totalVolume FROM transactions WHERE ${whereSql}`, params),
      pool.query(`SELECT COUNT(*) as count FROM transactions WHERE status = 'failed' AND ${whereSql}`, params),
      pool.query(`SELECT COUNT(*) as activeLoans, COALESCE(SUM(Loan_Amount), 0) as totalLoanAmt FROM loans WHERE Loan_Status = 'Active'`),
      pool.query(`SELECT COUNT(*) as totalCards FROM credit_cards`),
      pool.query(`SELECT COUNT(*) as openTickets FROM support_tickets WHERE Status IN ('Open', 'In Progress')`)
    ]);

    const totalTxns = txnData[0].totalTxns;
    const failedTxns = failCount[0].count;
    const failureRate = totalTxns > 0 ? ((failedTxns / totalTxns) * 100).toFixed(2) : 0;
    const successRate = totalTxns > 0 ? (100 - failureRate).toFixed(2) : 100;

    res.json({
      metrics: {
        totalCustomers: custCount[0].count,
        totalAccounts: accData[0].totalAccounts,
        totalBalance: parseFloat(accData[0].totalBalance),
        totalTransactions: totalTxns,
        totalVolume: parseFloat(txnData[0].totalVolume),
        failedTransactions: failedTxns,
        failureRate: parseFloat(failureRate),
        successRate: parseFloat(successRate),
        activeLoans: loanData[0]?.activeLoans || 0,
        totalLoanAmount: parseFloat(loanData[0]?.totalLoanAmt || 0),
        totalCreditCards: cardCount[0]?.totalCards || 0,
        openTickets: ticketCount[0]?.openTickets || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. RECENT TRANSACTIONS
router.get('/recent-transactions', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.txn_id, t.customer_id, c.name as customer_name, t.txn_type, t.amount, t.txn_time, t.status 
       FROM transactions t 
       LEFT JOIN customers c ON t.customer_id = c.customer_id 
       ORDER BY t.txn_time DESC 
       LIMIT 10`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. MONTHLY TRENDS
router.get('/charts/monthly', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         DATE_FORMAT(txn_time, '%Y-%m') AS month,
         COUNT(*) AS total_txns,
         ROUND(SUM(amount), 2) AS total_volume,
         ROUND(SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) AS success_rate
       FROM transactions
       WHERE txn_time IS NOT NULL
       GROUP BY DATE_FORMAT(txn_time, '%Y-%m')
       ORDER BY month ASC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. FLOW (CREDIT VS DEBIT)
router.get('/charts/flow', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         CASE 
           WHEN txn_type IN ('Deposit', 'Salary', 'Refund') THEN 'Credit (Inflow)'
           WHEN txn_type IN ('Withdrawal', 'Transfer', 'Payment', 'Bill Pay', 'POS') THEN 'Debit (Outflow)'
           ELSE 'Other'
         END as flow_category,
         COUNT(*) as txn_count,
         ROUND(SUM(amount), 2) as total_volume,
         ROUND(AVG(amount), 2) as avg_amount
       FROM transactions
       GROUP BY flow_category
       ORDER BY total_volume DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. BALANCES DISTRIBUTION
router.get('/charts/balances', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         CASE 
           WHEN account_balance < 25000 THEN '< ₹25K'
           WHEN account_balance BETWEEN 25000 AND 100000 THEN '₹25K - ₹1L'
           WHEN account_balance BETWEEN 100000 AND 500000 THEN '₹1L - ₹5L'
           ELSE '> ₹5L'
         END as balance_bracket,
         COUNT(*) as count,
         ROUND(SUM(account_balance), 2) as total_bracket_balance
       FROM accounts
       GROUP BY balance_bracket
       ORDER BY count DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. LOAN STATUS BREAKDOWN
router.get('/charts/loans', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         COALESCE(Loan_Status, 'Unknown') as status,
         COUNT(*) as count,
         ROUND(SUM(Loan_Amount), 2) as total_amount,
         ROUND(AVG(Interest_Rate), 2) as avg_interest
       FROM loans
       GROUP BY Loan_Status`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. BRANCH PERFORMANCE
router.get('/charts/branches', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         branch_name,
         city,
         branch_revenue,
         total_employees,
         performance_rating
       FROM branches
       ORDER BY branch_revenue DESC
       LIMIT 8`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. FAILURES BY TYPE
router.get('/charts/failures', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         txn_type,
         COUNT(*) as failed_count,
         ROUND(SUM(amount), 2) as failed_volume
       FROM transactions
       WHERE status = 'failed'
       GROUP BY txn_type
       ORDER BY failed_count DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
