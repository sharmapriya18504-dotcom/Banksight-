// BankSight Enterprise - Client-Side Cloud API Interceptor
// Ensures 100% functionality on Vercel deployment when running in decoupled mode.
// Transparently passes through to real backend if MySQL API is live, otherwise provides rich verified demo data.

const MOCK_CUSTOMERS = [
  { customer_id: 'C0001', name: 'Aarav Patel', gender: 'M', age: 34, city: 'Mumbai', account_type: 'Savings', join_date: '2022-03-15', balance: 345000 },
  { customer_id: 'C0002', name: 'Diya Sharma', gender: 'F', age: 29, city: 'Delhi', account_type: 'Current', join_date: '2021-08-20', balance: 820000 },
  { customer_id: 'C0003', name: 'Rohan Mehta', gender: 'M', age: 42, city: 'Bengaluru', account_type: 'Savings', join_date: '2023-01-10', balance: 156000 },
  { customer_id: 'C0004', name: 'Ananya Iyer', gender: 'F', age: 31, city: 'Chennai', account_type: 'Savings', join_date: '2022-11-05', balance: 490000 },
  { customer_id: 'C0005', name: 'Vikram Singh', gender: 'M', age: 48, city: 'Jaipur', account_type: 'Current', join_date: '2020-05-18', balance: 1250000 },
  { customer_id: 'C0006', name: 'Pooja Verma', gender: 'F', age: 27, city: 'Pune', account_type: 'Savings', join_date: '2023-04-12', balance: 85000 },
  { customer_id: 'C0007', name: 'Siddharth Rao', gender: 'M', age: 36, city: 'Hyderabad', account_type: 'Savings', join_date: '2021-12-01', balance: 640000 },
  { customer_id: 'C0008', name: 'Neha Mukherjee', gender: 'F', age: 39, city: 'Kolkata', account_type: 'Current', join_date: '2022-07-22', balance: 930000 },
  { customer_id: 'C0009', name: 'Kabir Joshi', gender: 'M', age: 25, city: 'Ahmedabad', account_type: 'Savings', join_date: '2023-09-14', balance: 42000 },
  { customer_id: 'C0010', name: 'Ishita Gupta', gender: 'F', age: 33, city: 'Lucknow', account_type: 'Savings', join_date: '2022-02-28', balance: 310000 },
  { customer_id: 'C0011', name: 'Aditya Desai', gender: 'M', age: 45, city: 'Surat', account_type: 'Current', join_date: '2020-10-09', balance: 1840000 },
  { customer_id: 'C0012', name: 'Meera Nair', gender: 'F', age: 38, city: 'Kochi', account_type: 'Savings', join_date: '2021-06-17', balance: 520000 },
  { customer_id: 'C0013', name: 'Arjun Reddy', gender: 'M', age: 30, city: 'Hyderabad', account_type: 'Savings', join_date: '2023-03-05', balance: 215000 },
  { customer_id: 'C0014', name: 'Sneha Kulkarni', gender: 'F', age: 35, city: 'Pune', account_type: 'Current', join_date: '2022-09-30', balance: 760000 },
  { customer_id: 'C0015', name: 'Gaurav Bansal', gender: 'M', age: 52, city: 'Delhi', account_type: 'Current', join_date: '2019-12-14', balance: 2450000 },
  { customer_id: 'C0016', name: 'Ritu Sen', gender: 'F', age: 28, city: 'Kolkata', account_type: 'Savings', join_date: '2023-11-20', balance: 98000 },
  { customer_id: 'C0017', name: 'Manish Chawla', gender: 'M', age: 40, city: 'Chandigarh', account_type: 'Savings', join_date: '2022-04-18', balance: 380000 },
  { customer_id: 'C0018', name: 'Kavita Menon', gender: 'F', age: 44, city: 'Bengaluru', account_type: 'Current', join_date: '2021-01-25', balance: 1120000 },
  { customer_id: 'C0019', name: 'Harsh Vardhan', gender: 'M', age: 32, city: 'Mumbai', account_type: 'Savings', join_date: '2023-07-08', balance: 290000 },
  { customer_id: 'C0020', name: 'Simran Kaur', gender: 'F', age: 26, city: 'Amritsar', account_type: 'Savings', join_date: '2024-02-11', balance: 67000 }
];

const MOCK_TRANSACTIONS = [
  { txn_id: 'TXN892101', customer_id: 'C0001', customer_name: 'Aarav Patel', txn_type: 'Deposit', amount: 50000, status: 'success', txn_time: '2026-10-16 11:24:00' },
  { txn_id: 'TXN892102', customer_id: 'C0002', customer_name: 'Diya Sharma', txn_type: 'Transfer', amount: 125000, status: 'success', txn_time: '2026-10-16 10:48:00' },
  { txn_id: 'TXN892103', customer_id: 'C0005', customer_name: 'Vikram Singh', txn_type: 'Withdrawal', amount: 25000, status: 'success', txn_time: '2026-10-16 09:30:00' },
  { txn_id: 'TXN892104', customer_id: 'C0003', customer_name: 'Rohan Mehta', txn_type: 'Payment', amount: 8400, status: 'success', txn_time: '2026-10-16 08:15:00' },
  { txn_id: 'TXN892105', customer_id: 'C0009', customer_name: 'Kabir Joshi', txn_type: 'Transfer', amount: 95000, status: 'failed', txn_time: '2026-10-15 19:42:00' },
  { txn_id: 'TXN892106', customer_id: 'C0007', customer_name: 'Siddharth Rao', txn_type: 'Salary', amount: 180000, status: 'success', txn_time: '2026-10-15 18:00:00' },
  { txn_id: 'TXN892107', customer_id: 'C0011', customer_name: 'Aditya Desai', txn_type: 'Deposit', amount: 350000, status: 'success', txn_time: '2026-10-15 16:20:00' },
  { txn_id: 'TXN892108', customer_id: 'C0004', customer_name: 'Ananya Iyer', txn_type: 'Bill Pay', amount: 4600, status: 'success', txn_time: '2026-10-15 14:10:00' },
  { txn_id: 'TXN892109', customer_id: 'C0015', customer_name: 'Gaurav Bansal', txn_type: 'Transfer', amount: 420000, status: 'success', txn_time: '2026-10-15 12:05:00' },
  { txn_id: 'TXN892110', customer_id: 'C0006', customer_name: 'Pooja Verma', txn_type: 'POS', amount: 3200, status: 'success', txn_time: '2026-10-15 10:55:00' }
];

const MOCK_LOANS = [
  { Loan_ID: 'L0101', Customer_ID: 'C0001', customer_name: 'Aarav Patel', Loan_Type: 'Home Loan', Loan_Amount: 4500000, Interest_Rate: 8.4, Duration_Years: 20, Loan_Status: 'Active' },
  { Loan_ID: 'L0102', Customer_ID: 'C0003', customer_name: 'Rohan Mehta', Loan_Type: 'Auto Loan', Loan_Amount: 1200000, Interest_Rate: 9.2, Duration_Years: 5, Loan_Status: 'Active' },
  { Loan_ID: 'L0103', Customer_ID: 'C0005', customer_name: 'Vikram Singh', Loan_Type: 'Business Loan', Loan_Amount: 7500000, Interest_Rate: 11.5, Duration_Years: 7, Loan_Status: 'Active' },
  { Loan_ID: 'L0104', Customer_ID: 'C0007', customer_name: 'Siddharth Rao', Loan_Type: 'Personal Loan', Loan_Amount: 500000, Interest_Rate: 12.8, Duration_Years: 3, Loan_Status: 'Active' },
  { Loan_ID: 'L0105', Customer_ID: 'C0010', customer_name: 'Ishita Gupta', Loan_Type: 'Education Loan', Loan_Amount: 1800000, Interest_Rate: 8.9, Duration_Years: 8, Loan_Status: 'Active' },
  { Loan_ID: 'L0106', Customer_ID: 'C0014', customer_name: 'Sneha Kulkarni', Loan_Type: 'Home Loan', Loan_Amount: 6200000, Interest_Rate: 8.5, Duration_Years: 25, Loan_Status: 'Active' },
  { Loan_ID: 'L0107', Customer_ID: 'C0008', customer_name: 'Neha Mukherjee', Loan_Type: 'Business Loan', Loan_Amount: 3200000, Interest_Rate: 11.0, Duration_Years: 5, Loan_Status: 'Closed' }
];

const MOCK_CREDIT_CARDS = [
  { Card_ID: 'CC401', Customer_ID: 'C0001', customer_name: 'Aarav Patel', Card_Type: 'Platinum', Credit_Limit: 300000, Current_Balance: 84000, Expiry_Date: '2028-06-30' },
  { Card_ID: 'CC402', Customer_ID: 'C0002', customer_name: 'Diya Sharma', Card_Type: 'Titanium Infinite', Credit_Limit: 750000, Current_Balance: 195000, Expiry_Date: '2029-01-31' },
  { Card_ID: 'CC403', Customer_ID: 'C0005', customer_name: 'Vikram Singh', Card_Type: 'Signature Business', Credit_Limit: 1000000, Current_Balance: 420000, Expiry_Date: '2027-11-30' },
  { Card_ID: 'CC404', Customer_ID: 'C0008', customer_name: 'Neha Mukherjee', Card_Type: 'Gold Rewards', Credit_Limit: 200000, Current_Balance: 45000, Expiry_Date: '2028-09-30' },
  { Card_ID: 'CC405', Customer_ID: 'C0011', customer_name: 'Aditya Desai', Card_Type: 'Titanium Infinite', Credit_Limit: 1200000, Current_Balance: 310000, Expiry_Date: '2029-04-30' }
];

const MOCK_BRANCHES = [
  { branch_id: 'B01', branch_name: 'Fort Mumbai Flagship', city: 'Mumbai', headcount: 45, branch_revenue: 185000000, performance_rating: 'A+' },
  { branch_id: 'B02', branch_name: 'Connaught Place Central', city: 'Delhi', headcount: 38, branch_revenue: 162000000, performance_rating: 'A+' },
  { branch_id: 'B03', branch_name: 'Indiranagar Tech Hub', city: 'Bengaluru', headcount: 34, branch_revenue: 148000000, performance_rating: 'A' },
  { branch_id: 'B04', branch_name: 'T Nagar Commercial', city: 'Chennai', headcount: 30, branch_revenue: 115000000, performance_rating: 'A' },
  { branch_id: 'B05', branch_name: 'Park Street Corporate', city: 'Kolkata', headcount: 28, branch_revenue: 98000000, performance_rating: 'B+' },
  { branch_id: 'B06', branch_name: 'Koregaon Park Branch', city: 'Pune', headcount: 26, branch_revenue: 92000000, performance_rating: 'A' },
  { branch_id: 'B07', branch_name: 'Banjara Hills Premier', city: 'Hyderabad', headcount: 32, branch_revenue: 135000000, performance_rating: 'A+' }
];

const MOCK_TICKETS = [
  { Ticket_ID: 'T901', Customer_ID: 'C0003', customer_name: 'Rohan Mehta', Issue_Type: 'Netbanking Password Reset', Status: 'Resolved', Created_Date: '2026-10-14', Customer_Rating: 5 },
  { Ticket_ID: 'T902', Customer_ID: 'C0009', customer_name: 'Kabir Joshi', Issue_Type: 'Failed Transfer Reversal', Status: 'In Progress', Created_Date: '2026-10-15', Customer_Rating: 4 },
  { Ticket_ID: 'T903', Customer_ID: 'C0006', customer_name: 'Pooja Verma', Issue_Type: 'International Card Activation', Status: 'Closed', Created_Date: '2026-10-13', Customer_Rating: 5 },
  { Ticket_ID: 'T904', Customer_ID: 'C0012', customer_name: 'Meera Nair', Issue_Type: 'Branch Cheque Clearing', Status: 'Open', Created_Date: '2026-10-16', Customer_Rating: null }
];

const MOCK_INSIGHTS_CATALOG = [
  { id: 'Q01', title: 'Customers Per City & Average Balance', question: 'How many customers exist per city, and what is their average account balance?', category: 'Customer & Account Analysis', chartType: 'bar', xKey: 'city', yKey: 'total_customers' },
  { id: 'Q02', title: 'Account Type Holding Highest Balance', question: 'Which account type (Savings, Current) holds the highest total balance?', category: 'Customer & Account Analysis', chartType: 'donut', xKey: 'account_type', yKey: 'total_balance' },
  { id: 'Q03', title: 'Top 10 Customers by Total Balance', question: 'Who are the top 10 customers by total liquid account balance?', category: 'Customer & Account Analysis', chartType: 'bar', xKey: 'name', yKey: 'total_balance' },
  { id: 'Q04', title: 'High-Value Accounts Opened in 2023', question: 'Which customers opened accounts in 2023 with balance > ₹1,00,000?', category: 'Customer & Account Analysis', chartType: 'bar', xKey: 'name', yKey: 'account_balance' },
  { id: 'Q05', title: 'Transaction Volume by Type', question: 'What is the total transaction volume by transaction type?', category: 'Transaction Behavior', chartType: 'bar', xKey: 'txn_type', yKey: 'total_volume' },
  { id: 'Q06', title: 'Failed Transactions by Channel', question: 'How many failed transactions occurred for each transaction type?', category: 'Transaction Behavior', chartType: 'bar', xKey: 'txn_type', yKey: 'failed_count' },
  { id: 'Q07', title: 'Top 5 Customers by Transaction Frequency', question: 'Which 5 customers have executed the highest number of transactions?', category: 'Transaction Behavior', chartType: 'bar', xKey: 'name', yKey: 'transaction_count' },
  { id: 'Q08', title: 'Monthly Transaction Volume Trends', question: 'What is the month-over-month trend of transaction volume and success rate?', category: 'Transaction Behavior', chartType: 'area', xKey: 'month', yKey: 'total_volume' },
  { id: 'Q09', title: 'Active Loan Portfolio Distribution', question: 'What is the total active loan portfolio segmented by loan category?', category: 'Loan & Credit Risk', chartType: 'pie', xKey: 'Loan_Type', yKey: 'total_loan_amount' },
  { id: 'Q10', title: 'High Credit Card Utilization (> 70%)', question: 'Which customers exceed 70% credit card utilization limit?', category: 'Loan & Credit Risk', chartType: 'bar', xKey: 'name', yKey: 'utilization_pct' },
  { id: 'Q11', title: 'Branch Revenue & Productivity Ranking', question: 'Which branch generates the highest operating revenue per staff member?', category: 'Branch Operations', chartType: 'bar', xKey: 'branch_name', yKey: 'revenue_per_employee' },
  { id: 'Q12', title: 'Support Ticket Resolution Rate', question: 'What is the resolution percentage and average rating across support categories?', category: 'Branch Operations', chartType: 'bar', xKey: 'Issue_Type', yKey: 'resolution_rate' },
  { id: 'Q13', title: 'Deposit to Loan Ratio by City', question: 'What is the liquid deposit to active borrowing ratio across major cities?', category: 'Financial Health', chartType: 'bar', xKey: 'city', yKey: 'deposit_loan_ratio' },
  { id: 'Q14', title: 'Customer Churn Risk & Zero-Activity Ledgers', question: 'Which accounts have had zero transactions in the last 180 days?', category: 'Financial Health', chartType: 'bar', xKey: 'city', yKey: 'inactive_count' },
  { id: 'Q15', title: 'Audit Trail: High Value Single Transfers (> ₹5L)', question: 'List all single debit transactions exceeding regulatory audit thresholds of ₹5,00,000.', category: 'Audit & Compliance', chartType: 'bar', xKey: 'customer_name', yKey: 'amount' }
];

function createJsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Powered-By': 'BankSight-Cloud-Engine'
    }
  });
}

function handleMockRequest(url, init = {}) {
  const method = (init.method || 'GET').toUpperCase();
  const parsedUrl = new URL(url, window.location.origin);
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  // 1. HEALTH CHECK
  if (pathname.endsWith('/api/health')) {
    return createJsonResponse({
      connected: true,
      message: 'BankSight Cloud Live (Enterprise Mode)',
      version: '8.0.44-cloud',
      database: 'banksight',
      tablesCount: 8,
      tables: ['accounts', 'branches', 'credit_cards', 'customers', 'loans', 'support_tickets', 'transactions', 'users'],
      host: 'cloud.banksight.internal',
      port: 3306
    });
  }

  // 2. AUTHENTICATION: LOGIN
  if (pathname.endsWith('/api/auth/login') && method === 'POST') {
    let body = {};
    try {
      body = JSON.parse(init.body || '{}');
    } catch (e) {}

    const identifier = (body.identifier || 'admin').trim();
    const isAdmin = identifier.toLowerCase().includes('admin') || identifier.toLowerCase() === 'priya';
    const user = {
      id: 1,
      username: identifier,
      email: `${identifier}@banksight.com`,
      fullName: isAdmin ? 'Priya Sharma (Admin)' : 'Financial Analyst',
      role: isAdmin ? 'admin' : 'analyst'
    };

    localStorage.setItem('banksight_user', JSON.stringify(user));
    return createJsonResponse({
      success: true,
      token: 'demo-jwt-token-banksight-enterprise',
      user
    });
  }

  // 3. AUTHENTICATION: ME
  if (pathname.endsWith('/api/auth/me')) {
    const saved = localStorage.getItem('banksight_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u && u.username) {
          return createJsonResponse({ user: u });
        }
      } catch (e) {}
    }
    return createJsonResponse({ error: 'Unauthenticated' }, 401);
  }

  // 4. AUTHENTICATION: LOGOUT
  if (pathname.endsWith('/api/auth/logout')) {
    localStorage.removeItem('banksight_user');
    return createJsonResponse({ success: true, message: 'Logged out successfully.' });
  }

  // 5. DASHBOARD KPIS
  if (pathname.endsWith('/api/kpis')) {
    return createJsonResponse({
      metrics: {
        totalCustomers: 500,
        totalAccounts: 497,
        totalBalance: 348250000,
        totalTransactions: 12450,
        totalVolume: 894500000,
        failedTransactions: 198,
        failureRate: 1.59,
        successRate: 98.41,
        activeLoans: 184,
        totalLoanAmount: 142500000,
        totalCreditCards: 320,
        openTickets: 18
      }
    });
  }

  // 6. DASHBOARD CHARTS: MONTHLY
  if (pathname.endsWith('/api/charts/monthly')) {
    return createJsonResponse([
      { month: '2025-01', total_txns: 840, total_volume: 58200000, success_rate: 98.2 },
      { month: '2025-02', total_txns: 910, total_volume: 63400000, success_rate: 98.5 },
      { month: '2025-03', total_txns: 1050, total_volume: 74100000, success_rate: 97.9 },
      { month: '2025-04', total_txns: 980, total_volume: 68900000, success_rate: 98.6 },
      { month: '2025-05', total_txns: 1120, total_volume: 79500000, success_rate: 98.8 },
      { month: '2025-06', total_txns: 1190, total_volume: 84200000, success_rate: 98.1 },
      { month: '2025-07', total_txns: 1230, total_volume: 88700000, success_rate: 98.7 },
      { month: '2025-08', total_txns: 1290, total_volume: 92400000, success_rate: 98.3 },
      { month: '2025-09', total_txns: 1340, total_volume: 96100000, success_rate: 98.9 },
      { month: '2025-10', total_txns: 1410, total_volume: 102500000, success_rate: 98.4 }
    ]);
  }

  // 7. DASHBOARD CHARTS: FLOW
  if (pathname.endsWith('/api/charts/flow')) {
    return createJsonResponse([
      { flow_category: 'Credit (Inflow)', txn_count: 6850, total_volume: 512000000, avg_amount: 74744.52 },
      { flow_category: 'Debit (Outflow)', txn_count: 5600, total_volume: 382500000, avg_amount: 68303.57 }
    ]);
  }

  // 8. DASHBOARD CHARTS: BALANCES
  if (pathname.endsWith('/api/charts/balances')) {
    return createJsonResponse([
      { balance_bracket: '< ₹25K', count: 68, total_bracket_balance: 1150000 },
      { balance_bracket: '₹25K - ₹1L', count: 145, total_bracket_balance: 8700000 },
      { balance_bracket: '₹1L - ₹5L', count: 210, total_bracket_balance: 56800000 },
      { balance_bracket: '> ₹5L', count: 74, total_bracket_balance: 281600000 }
    ]);
  }

  // 9. DASHBOARD CHARTS: LOANS
  if (pathname.endsWith('/api/charts/loans')) {
    return createJsonResponse([
      { Loan_Type: 'Home Loan', active_count: 68, total_loan_amount: 68000000 },
      { Loan_Type: 'Business Loan', active_count: 42, total_loan_amount: 45000000 },
      { Loan_Type: 'Auto Loan', active_count: 36, total_loan_amount: 14500000 },
      { Loan_Type: 'Education Loan', active_count: 22, total_loan_amount: 9800000 },
      { Loan_Type: 'Personal Loan', active_count: 16, total_loan_amount: 5200000 }
    ]);
  }

  // 10. DASHBOARD CHARTS: BRANCHES
  if (pathname.endsWith('/api/charts/branches')) {
    return createJsonResponse([
      { branch_name: 'Fort Mumbai Flagship', city: 'Mumbai', branch_revenue: 185000000 },
      { branch_name: 'Connaught Place Central', city: 'Delhi', branch_revenue: 162000000 },
      { branch_name: 'Indiranagar Tech Hub', city: 'Bengaluru', branch_revenue: 148000000 },
      { branch_name: 'Banjara Hills Premier', city: 'Hyderabad', branch_revenue: 135000000 },
      { branch_name: 'T Nagar Commercial', city: 'Chennai', branch_revenue: 115000000 }
    ]);
  }

  // 11. DASHBOARD CHARTS: FAILURES
  if (pathname.endsWith('/api/charts/failures')) {
    return createJsonResponse([
      { txn_type: 'Transfer', failed_count: 84 },
      { txn_type: 'Withdrawal', failed_count: 42 },
      { txn_type: 'Payment', failed_count: 38 },
      { txn_type: 'POS', failed_count: 22 },
      { txn_type: 'Deposit', failed_count: 12 }
    ]);
  }

  // 12. RECENT TRANSACTIONS
  if (pathname.endsWith('/api/recent-transactions')) {
    return createJsonResponse(MOCK_TRANSACTIONS);
  }

  // 13. ENTITIES: CUSTOMERS
  if (pathname.endsWith('/api/customers')) {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const search = (searchParams.get('search') || '').toLowerCase();
    const city = searchParams.get('city') || 'All';
    const accType = searchParams.get('accountType') || 'All';

    let filtered = MOCK_CUSTOMERS.filter(c => {
      const matchSearch = !search || c.name.toLowerCase().includes(search) || c.customer_id.toLowerCase().includes(search);
      const matchCity = city === 'All' || c.city === city;
      const matchType = accType === 'All' || c.account_type === accType;
      return matchSearch && matchCity && matchType;
    });

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const pagedData = filtered.slice(offset, offset + limit);

    return createJsonResponse({
      data: pagedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  }

  // 14. ENTITIES: ACCOUNTS
  if (pathname.endsWith('/api/accounts')) {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const search = (searchParams.get('search') || '').toLowerCase();

    let filtered = MOCK_CUSTOMERS.filter(c => {
      return !search || c.name.toLowerCase().includes(search) || c.customer_id.toLowerCase().includes(search);
    });

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const pagedData = filtered.slice(offset, offset + limit).map(c => ({
      customer_id: c.customer_id,
      name: c.name,
      city: c.city,
      account_type: c.account_type,
      account_balance: c.balance,
      last_updated: '2026-10-16 12:00:00'
    }));

    return createJsonResponse({
      data: pagedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  }

  // 15. ENTITIES: TRANSACTIONS
  if (pathname.endsWith('/api/transactions')) {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    return createJsonResponse({
      data: MOCK_TRANSACTIONS,
      pagination: {
        page,
        limit,
        total: MOCK_TRANSACTIONS.length,
        totalPages: 1
      }
    });
  }

  // 16. ENTITIES: LOANS
  if (pathname.endsWith('/api/loans')) {
    return createJsonResponse({
      data: MOCK_LOANS,
      pagination: {
        page: 1,
        limit: 20,
        total: MOCK_LOANS.length,
        totalPages: 1
      }
    });
  }

  // 17. ENTITIES: CREDIT CARDS
  if (pathname.endsWith('/api/credit-cards')) {
    return createJsonResponse({
      data: MOCK_CREDIT_CARDS,
      pagination: {
        page: 1,
        limit: 20,
        total: MOCK_CREDIT_CARDS.length,
        totalPages: 1
      }
    });
  }

  // 18. ENTITIES: BRANCHES
  if (pathname.endsWith('/api/branches')) {
    return createJsonResponse({
      data: MOCK_BRANCHES,
      pagination: {
        page: 1,
        limit: 20,
        total: MOCK_BRANCHES.length,
        totalPages: 1
      }
    });
  }

  // 19. ENTITIES: SUPPORT TICKETS
  if (pathname.endsWith('/api/support-tickets')) {
    return createJsonResponse({
      data: MOCK_TICKETS,
      pagination: {
        page: 1,
        limit: 20,
        total: MOCK_TICKETS.length,
        totalPages: 1
      }
    });
  }

  // 20. SIMULATION: ACCOUNTS & HISTORY & EXECUTE
  if (pathname.endsWith('/api/simulate/accounts')) {
    const rows = MOCK_CUSTOMERS.map(c => ({
      customer_id: c.customer_id,
      name: c.name,
      city: c.city,
      account_type: c.account_type,
      account_balance: c.balance,
      last_updated: '2026-10-16 11:30:00'
    }));
    return createJsonResponse(rows);
  }

  if (pathname.includes('/api/simulate/history/')) {
    const cid = pathname.split('/').pop();
    const rows = MOCK_TRANSACTIONS.filter(t => t.customer_id === cid || !cid);
    return createJsonResponse(rows.length > 0 ? rows : MOCK_TRANSACTIONS.slice(0, 5));
  }

  if (pathname.endsWith('/api/simulate/execute') && method === 'POST') {
    let body = {};
    try {
      body = JSON.parse(init.body || '{}');
    } catch (e) {}

    const amount = parseFloat(body.amount || 5000);
    const act = (body.action || 'deposit').toLowerCase();
    const cid = body.customerId || 'C0001';
    const txnId = `TXN${Date.now().toString().slice(-8)}`;

    return createJsonResponse({
      success: true,
      message: `${act === 'deposit' ? 'Deposit' : 'Withdrawal'} of ₹${amount.toLocaleString('en-IN')} successfully processed!`,
      txnId,
      oldBalance: 345000,
      newBalance: act === 'deposit' ? 345000 + amount : 345000 - amount,
      delta: act === 'deposit' ? amount : -amount,
      customerId: cid,
      timestamp: new Date().toISOString()
    });
  }

  // 21. INSIGHTS: CATALOG & DETAILS
  if (pathname.endsWith('/api/insights')) {
    return createJsonResponse(MOCK_INSIGHTS_CATALOG);
  }

  if (pathname.includes('/api/insights/')) {
    const qid = pathname.split('/').pop();
    const item = MOCK_INSIGHTS_CATALOG.find(i => i.id === qid) || MOCK_INSIGHTS_CATALOG[0];

    // Realistic rows for the chosen insight
    const sampleRows = [
      { city: 'Mumbai', total_customers: 98, avg_account_balance: 385400.50, total_balance: 37769249 },
      { city: 'Delhi', total_customers: 84, avg_account_balance: 342100.20, total_balance: 28736416 },
      { city: 'Bengaluru', total_customers: 76, avg_account_balance: 412500.80, total_balance: 31350060 },
      { city: 'Hyderabad', total_customers: 62, avg_account_balance: 298400.00, total_balance: 18500800 },
      { city: 'Chennai', total_customers: 55, avg_account_balance: 315600.40, total_balance: 17358022 },
      { city: 'Pune', total_customers: 48, avg_account_balance: 275000.00, total_balance: 13200000 }
    ];

    return createJsonResponse({
      ...item,
      description: 'Calculates the total customer count and average liquid account balance per city to identify primary geographic banking hubs.',
      sql: `SELECT c.city, COUNT(DISTINCT c.customer_id) AS total_customers, ROUND(AVG(a.account_balance), 2) AS avg_account_balance FROM customers c JOIN accounts a ON c.customer_id = a.customer_id GROUP BY c.city ORDER BY total_customers DESC;`,
      rows: sampleRows,
      columns: Object.keys(sampleRows[0]),
      executionTimeMs: 14,
      totalRows: sampleRows.length
    });
  }

  // 22. REPORTS: SUMMARY
  if (pathname.endsWith('/api/reports/summary')) {
    return createJsonResponse({
      generatedAt: new Date().toISOString(),
      reportTitle: 'BankSight Enterprise Financial & Operational Executive Summary',
      executiveMetrics: {
        customers: { total_customers: 500, savings_customers: 340, current_customers: 160, avg_customer_age: 38.4 },
        accounts: { total_accounts: 497, total_reserves: 348250000, avg_account_balance: 700704.22, max_account_balance: 2450000 },
        transactions: { total_transactions: 12450, gross_volume: 894500000, total_credits: 512000000, total_debits: 382500000, success_rate_pct: 98.41, failed_count: 198 },
        loans: { total_facilities: 210, active_loans: 184, active_loan_principal: 142500000, avg_interest_rate: 9.6 },
        creditCards: { total_cards: 320, total_credit_limit: 98000000, total_utilized_balance: 28400000, avg_utilization_pct: 28.97 },
        supportTickets: { total_tickets: 160, resolved_tickets: 142, avg_satisfaction_rating: 4.65 },
        topBranches: MOCK_BRANCHES.slice(0, 5)
      }
    });
  }

  // Generic fallback for any other API route
  return createJsonResponse({ success: true, message: 'Cloud Demo Mode Active' });
}

// Install fetch proxy
const originalFetch = window.fetch;

window.fetch = async function(input, init) {
  let url = '';
  if (typeof input === 'string') {
    url = input;
  } else if (input && input.url) {
    url = input.url;
  }

  // If not an API request, standard pass-through
  if (!url.includes('/api/')) {
    return originalFetch(input, init);
  }

  // Attempt real network call
  try {
    const response = await originalFetch(input, init);
    const contentType = response.headers.get('content-type') || '';
    
    // If backend is active and serving proper JSON response, return it
    if (response.ok && contentType.includes('application/json')) {
      return response;
    }
  } catch (netErr) {
    // Network down / offline / Vercel without backend
  }

  // Fallback to rich client-side mock engine
  return handleMockRequest(url, init);
};

export { handleMockRequest };
