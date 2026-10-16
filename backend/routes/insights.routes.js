import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

export const INSIGHTS_CATALOG = [
  {
    id: 'Q01',
    title: 'Customers Per City & Average Account Balance',
    question: 'How many customers exist per city, and what is their average account balance?',
    category: 'Customer & Account Analysis',
    description: 'Calculates the total customer count and average liquid account balance per city to identify primary geographic banking hubs.',
    chartType: 'bar',
    xKey: 'city',
    yKey: 'total_customers',
    sql: `
      SELECT 
        c.city,
        COUNT(DISTINCT c.customer_id) AS total_customers,
        ROUND(AVG(COALESCE(a.account_balance, 0)), 2) AS avg_account_balance,
        ROUND(SUM(COALESCE(a.account_balance, 0)), 2) AS total_balance
      FROM customers c
      LEFT JOIN accounts a ON c.customer_id = a.customer_id
      GROUP BY c.city
      ORDER BY total_customers DESC, avg_account_balance DESC
      LIMIT 15;
    `
  },
  {
    id: 'Q02',
    title: 'Account Type Holding Highest Total Balance',
    question: 'Which account type (Savings, Current, Loan, etc.) holds the highest total balance?',
    category: 'Customer & Account Analysis',
    description: 'Compares deposit reserves and account counts across account types to determine which segment holds the highest capital.',
    chartType: 'donut',
    xKey: 'account_type',
    yKey: 'total_balance',
    sql: `
      SELECT 
        c.account_type,
        COUNT(DISTINCT c.customer_id) AS total_accounts,
        ROUND(SUM(COALESCE(a.account_balance, 0)), 2) AS total_balance,
        ROUND(AVG(COALESCE(a.account_balance, 0)), 2) AS avg_balance
      FROM customers c
      LEFT JOIN accounts a ON c.customer_id = a.customer_id
      GROUP BY c.account_type
      ORDER BY total_balance DESC;
    `
  },
  {
    id: 'Q03',
    title: 'Top 10 Customers by Total Account Balance',
    question: 'Who are the top 10 customers by total account balance across all account types?',
    category: 'Customer & Account Analysis',
    description: 'Profiles the top 10 high-net-worth patrons holding the largest liquid deposit balances across all banking ledgers.',
    chartType: 'bar',
    xKey: 'name',
    yKey: 'total_balance',
    sql: `
      SELECT 
        c.customer_id,
        c.name,
        c.city,
        c.account_type,
        ROUND(a.account_balance, 2) AS total_balance,
        a.last_updated
      FROM customers c
      JOIN accounts a ON c.customer_id = a.customer_id
      ORDER BY a.account_balance DESC
      LIMIT 10;
    `
  },
  {
    id: 'Q04',
    title: 'High-Value Accounts Opened in 2023 (> ₹1,00,000)',
    question: 'Which customers opened accounts in 2023 with a balance above ₹1,00,000?',
    category: 'Customer & Account Analysis',
    description: 'Filters newly onboarded accounts from 2023 that maintain substantial liquidity exceeding ₹1,00,000.',
    chartType: 'bar',
    xKey: 'name',
    yKey: 'account_balance',
    sql: `
      SELECT 
        c.customer_id,
        c.name,
        c.city,
        c.join_date,
        c.account_type,
        ROUND(a.account_balance, 2) AS account_balance
      FROM customers c
      JOIN accounts a ON c.customer_id = a.customer_id
      WHERE YEAR(c.join_date) = 2023 AND a.account_balance > 100000
      ORDER BY a.account_balance DESC;
    `
  },
  {
    id: 'Q05',
    title: 'Total Transaction Volume by Transaction Type',
    question: 'What is the total transaction volume (sum of amounts) by transaction type?',
    category: 'Transaction Behavior',
    description: 'Aggregates aggregate transactional capital and average ticket sizes across deposit, withdrawal, transfer, purchase, and online channels.',
    chartType: 'bar',
    xKey: 'txn_type',
    yKey: 'total_volume',
    sql: `
      SELECT 
        txn_type,
        COUNT(*) AS transaction_count,
        ROUND(SUM(amount), 2) AS total_volume,
        ROUND(AVG(amount), 2) AS avg_ticket_size
      FROM transactions
      GROUP BY txn_type
      ORDER BY total_volume DESC;
    `
  },
  {
    id: 'Q06',
    title: 'Failed Transactions by Transaction Type',
    question: 'How many failed transactions occurred for each transaction type?',
    category: 'Transaction Behavior',
    description: 'Diagnoses failed transaction clusters to identify vulnerable payment channels and quantify abortive transaction amounts.',
    chartType: 'bar',
    xKey: 'txn_type',
    yKey: 'failed_count',
    sql: `
      SELECT 
        txn_type,
        COUNT(*) AS failed_count,
        ROUND(SUM(amount), 2) AS failed_volume,
        ROUND(AVG(amount), 2) AS avg_failed_amount,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transactions WHERE status = 'failed')), 2) AS pct_of_all_failures
      FROM transactions
      WHERE status = 'failed'
      GROUP BY txn_type
      ORDER BY failed_count DESC;
    `
  },
  {
    id: 'Q07',
    title: 'Total Number of Transactions per Transaction Type',
    question: 'What is the total number of transactions per transaction type?',
    category: 'Transaction Behavior',
    description: 'Measures transaction frequency and relative percentage share across all transaction types.',
    chartType: 'pie',
    xKey: 'txn_type',
    yKey: 'total_transactions',
    sql: `
      SELECT 
        txn_type,
        COUNT(*) AS total_transactions,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transactions)), 2) AS pct_share
      FROM transactions
      GROUP BY txn_type
      ORDER BY total_transactions DESC;
    `
  },
  {
    id: 'Q08',
    title: 'Accounts with 5+ High-Value Transactions (> ₹20,000)',
    question: 'Which accounts have 5 or more high-value transactions above ₹20,000?',
    category: 'Transaction Behavior',
    description: 'Isolates high-velocity accounts conducting multiple large transactions (> ₹20,000) for compliance monitoring and VIP relationship management.',
    chartType: 'bar',
    xKey: 'name',
    yKey: 'high_value_txn_count',
    sql: `
      SELECT 
        t.customer_id,
        c.name,
        c.city,
        COUNT(t.txn_id) AS high_value_txn_count,
        ROUND(SUM(t.amount), 2) AS total_high_value_volume,
        ROUND(AVG(t.amount), 2) AS avg_high_value_amount
      FROM transactions t
      JOIN customers c ON t.customer_id = c.customer_id
      WHERE t.amount > 20000
      GROUP BY t.customer_id, c.name, c.city
      HAVING high_value_txn_count >= 5
      ORDER BY high_value_txn_count DESC, total_high_value_volume DESC
      LIMIT 15;
    `
  },
  {
    id: 'Q09',
    title: 'Average Loan Amount & Interest Rate by Loan Type',
    question: 'What is the average loan amount and interest rate by loan type (Personal, Auto, Home, etc.)?',
    category: 'Loan Insights',
    description: 'Benchmarking lending product portfolios across Personal, Home, Auto, Education, and Business categories.',
    chartType: 'bar',
    xKey: 'Loan_Type',
    yKey: 'avg_loan_amount',
    sql: `
      SELECT 
        Loan_Type,
        COUNT(*) AS total_loans,
        ROUND(AVG(Loan_Amount), 2) AS avg_loan_amount,
        ROUND(AVG(Interest_Rate), 2) AS avg_interest_rate,
        ROUND(SUM(Loan_Amount), 2) AS total_disbursed
      FROM loans
      GROUP BY Loan_Type
      ORDER BY avg_loan_amount DESC;
    `
  },
  {
    id: 'Q10',
    title: 'Customers Holding Multiple Active or Approved Loans',
    question: 'Which customers currently hold more than one active or approved loan?',
    category: 'Loan Insights',
    description: 'Highlights leveraged borrowers managing two or more active/approved loans to evaluate debt concentration.',
    chartType: 'bar',
    xKey: 'name',
    yKey: 'active_loans_count',
    sql: `
      SELECT 
        l.Customer_ID AS customer_id,
        c.name,
        c.city,
        COUNT(l.Loan_ID) AS active_loans_count,
        ROUND(SUM(l.Loan_Amount), 2) AS total_active_commitment,
        GROUP_CONCAT(DISTINCT l.Loan_Type ORDER BY l.Loan_Type SEPARATOR ', ') AS loan_types
      FROM loans l
      LEFT JOIN customers c ON l.Customer_ID = c.customer_id
      WHERE l.Loan_Status IN ('Active', 'Approved')
      GROUP BY l.Customer_ID, c.name, c.city
      HAVING active_loans_count > 1
      ORDER BY active_loans_count DESC, total_active_commitment DESC
      LIMIT 15;
    `
  },
  {
    id: 'Q11',
    title: 'Top 5 Customers with Highest Outstanding Loan Amounts',
    question: 'Who are the top 5 customers with the highest outstanding (non-closed) loan amounts?',
    category: 'Loan Insights',
    description: 'Identifies the highest credit risk concentration by ranking customers with the largest cumulative open loan balances.',
    chartType: 'bar',
    xKey: 'name',
    yKey: 'total_outstanding_amount',
    sql: `
      SELECT 
        l.Customer_ID AS customer_id,
        c.name,
        c.city,
        COUNT(l.Loan_ID) AS open_loans_count,
        ROUND(SUM(l.Loan_Amount), 2) AS total_outstanding_amount
      FROM loans l
      LEFT JOIN customers c ON l.Customer_ID = c.customer_id
      WHERE l.Loan_Status != 'Closed'
      GROUP BY l.Customer_ID, c.name, c.city
      ORDER BY total_outstanding_amount DESC
      LIMIT 5;
    `
  },
  {
    id: 'Q12',
    title: 'Average Loan Amount per Branch',
    question: 'What is the average loan amount per branch?',
    category: 'Branch & Performance',
    description: 'Compares branch lending volume and average ticket size to evaluate branch credit origination efficiency.',
    chartType: 'bar',
    xKey: 'branch_name',
    yKey: 'avg_loan_amount',
    sql: `
      SELECT 
        Branch AS branch_name,
        COUNT(*) AS total_loans,
        ROUND(AVG(Loan_Amount), 2) AS avg_loan_amount,
        ROUND(SUM(Loan_Amount), 2) AS total_lending_volume
      FROM loans
      GROUP BY Branch
      ORDER BY avg_loan_amount DESC
      LIMIT 10;
    `
  },
  {
    id: 'Q13',
    title: 'Customer Distribution by Age Cohorts',
    question: 'How many customers exist in each age group (e.g., 18–25, 26–35, etc.)?',
    category: 'Branch & Performance',
    description: 'Demographic breakdown of the retail customer base into key lifecycle cohorts: Young Adult, Early Career, Prime Earning, Pre-Retirement, and Senior.',
    chartType: 'bar',
    xKey: 'age_group',
    yKey: 'customer_count',
    sql: `
      SELECT 
        CASE 
          WHEN age BETWEEN 18 AND 25 THEN '18-25 (Young Adult)'
          WHEN age BETWEEN 26 AND 35 THEN '26-35 (Early Career)'
          WHEN age BETWEEN 36 AND 50 THEN '36-50 (Prime Earning)'
          WHEN age BETWEEN 51 AND 65 THEN '51-65 (Pre-Retirement)'
          ELSE '65+ (Senior Citizen)'
        END AS age_group,
        COUNT(*) AS customer_count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customers)), 2) AS pct_share
      FROM customers
      WHERE age IS NOT NULL
      GROUP BY age_group
      ORDER BY MIN(age) ASC;
    `
  },
  {
    id: 'Q14',
    title: 'Support Issue Categories with Longest Resolution Time',
    question: 'Which issue categories have the longest average resolution time?',
    category: 'Support Tickets & Customer Experience',
    description: 'Calculates average resolution turnaround in calendar days via DATEDIFF across banking support categories.',
    chartType: 'bar',
    xKey: 'Issue_Category',
    yKey: 'avg_resolution_days',
    sql: `
      SELECT 
        Issue_Category,
        COUNT(*) AS total_tickets,
        ROUND(AVG(CASE 
          WHEN Date_Closed IS NOT NULL AND Date_Closed != '' 
          THEN DATEDIFF(STR_TO_DATE(Date_Closed, '%Y-%m-%d'), STR_TO_DATE(Date_Opened, '%Y-%m-%d'))
          ELSE NULL 
        END), 2) AS avg_resolution_days,
        ROUND(AVG(Customer_Rating), 2) AS avg_customer_rating
      FROM support_tickets
      WHERE Date_Closed IS NOT NULL AND Date_Closed != ''
      GROUP BY Issue_Category
      ORDER BY avg_resolution_days DESC;
    `
  },
  {
    id: 'Q15',
    title: 'Top Support Agents Resolving Critical Tickets (Rating ≥ 4)',
    question: 'Which support agents have resolved the most critical tickets with high customer ratings (≥4)?',
    category: 'Support Tickets & Customer Experience',
    description: 'Recognizes elite customer service agents resolving high-stakes critical tickets with high satisfaction scores.',
    chartType: 'bar',
    xKey: 'Support_Agent',
    yKey: 'critical_resolved_count',
    sql: `
      SELECT 
        Support_Agent,
        COUNT(*) AS critical_resolved_count,
        ROUND(AVG(Customer_Rating), 2) AS avg_rating
      FROM support_tickets
      WHERE Priority = 'Critical' 
        AND Status IN ('Resolved', 'Closed') 
        AND Customer_Rating >= 4
      GROUP BY Support_Agent
      ORDER BY critical_resolved_count DESC, avg_rating DESC
      LIMIT 10;
    `
  }
];

router.get('/', (req, res) => {
  res.json(INSIGHTS_CATALOG.map(({ sql, ...meta }) => meta));
});

router.get('/:id', async (req, res) => {
  try {
    const item = INSIGHTS_CATALOG.find(q => q.id.toUpperCase() === req.params.id.toUpperCase());
    if (!item) {
      return res.status(404).json({ error: 'Insight query not found.' });
    }

    const t0 = performance.now();
    const [rows] = await pool.query(item.sql);
    const latency = (performance.now() - t0).toFixed(1);

    res.json({
      ...item,
      latencyMs: latency,
      rowsCount: rows.length,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
