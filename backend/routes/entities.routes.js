import express from 'express';
import { pool } from '../config/db.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// ==============================================================================
// 1. CUSTOMERS
// ==============================================================================
router.get('/customers', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;
    const search = req.query.search ? `%${req.query.search.trim()}%` : '%';
    const city = req.query.city;
    const accountType = req.query.accountType;

    let whereSql = '(c.customer_id LIKE ? OR c.name LIKE ?)';
    let params = [search, search];

    if (city && city !== 'All') {
      whereSql += ' AND c.city = ?';
      params.push(city);
    }
    if (accountType && accountType !== 'All') {
      whereSql += ' AND c.account_type = ?';
      params.push(accountType);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM customers c WHERE ${whereSql}`,
      params
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT c.customer_id, c.name, c.gender, c.age, c.city, c.account_type, 
              DATE_FORMAT(c.join_date, '%Y-%m-%d') as join_date,
              COALESCE(a.account_balance, 0) as balance
       FROM customers c
       LEFT JOIN accounts a ON c.customer_id = a.customer_id
       WHERE ${whereSql}
       ORDER BY c.customer_id ASC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Single customer lookup with linked accounts, loans, cards
router.get('/customers/:id', async (req, res) => {
  try {
    const cid = req.params.id;
    const [cust] = await pool.query('SELECT * FROM customers WHERE customer_id = ?', [cid]);
    if (cust.length === 0) return res.status(404).json({ error: 'Customer not found.' });

    const [acc] = await pool.query('SELECT * FROM accounts WHERE customer_id = ?', [cid]);
    const [loans] = await pool.query('SELECT * FROM loans WHERE Customer_ID = ?', [cid.replace(/\D/g, '')]);
    const [cards] = await pool.query('SELECT * FROM credit_cards WHERE Customer_ID = ?', [cid.replace(/\D/g, '')]);
    const [txns] = await pool.query('SELECT * FROM transactions WHERE customer_id = ? ORDER BY txn_time DESC LIMIT 10', [cid]);

    res.json({
      customer: cust[0],
      account: acc[0] || null,
      loans,
      creditCards: cards,
      recentTransactions: txns
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only: Create Customer
router.post('/customers', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { customerId, name, gender, age, city, accountType } = req.body;
    if (!customerId || !name || !city) {
      return res.status(400).json({ error: 'Customer ID, Name, and City are required fields.' });
    }

    const [existing] = await pool.query('SELECT customer_id FROM customers WHERE customer_id = ?', [customerId]);
    if (existing.length > 0) {
      return res.status(409).json({ error: `Customer ID ${customerId} already exists.` });
    }

    await pool.query(
      'INSERT INTO customers (customer_id, name, gender, age, city, account_type, join_date) VALUES (?, ?, ?, ?, ?, ?, CURDATE())',
      [customerId, name, gender || 'M', parseInt(age, 10) || 30, city, accountType || 'Savings']
    );

    res.status(201).json({ success: true, message: `Customer ${name} (${customerId}) created successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only: Update Customer
router.put('/customers/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { name, gender, age, city, accountType } = req.body;
    await pool.query(
      'UPDATE customers SET name = ?, gender = ?, age = ?, city = ?, account_type = ? WHERE customer_id = ?',
      [name, gender, parseInt(age, 10) || 30, city, accountType, req.params.id]
    );
    res.json({ success: true, message: `Customer ${req.params.id} updated successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only: Delete Customer with Foreign Key Check
router.delete('/customers/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const cid = req.params.id;
    const [acc] = await pool.query('SELECT COUNT(*) as count FROM accounts WHERE customer_id = ?', [cid]);
    const [txns] = await pool.query('SELECT COUNT(*) as count FROM transactions WHERE customer_id = ?', [cid]);

    if (acc[0].count > 0 || txns[0].count > 0) {
      return res.status(400).json({
        error: `Integrity Protection: Cannot delete customer with ${acc[0].count} active account(s) and ${txns[0].count} transaction record(s).`
      });
    }

    await pool.query('DELETE FROM customers WHERE customer_id = ?', [cid]);
    res.json({ success: true, message: `Customer ${cid} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 2. ACCOUNTS
// ==============================================================================
router.get('/accounts', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;
    const search = req.query.search ? `%${req.query.search.trim()}%` : '%';

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM accounts a 
       LEFT JOIN customers c ON a.customer_id = c.customer_id 
       WHERE a.customer_id LIKE ? OR c.name LIKE ?`,
      [search, search]
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT a.customer_id, c.name, c.account_type, c.city, a.account_balance, 
              DATE_FORMAT(a.last_updated, '%Y-%m-%d %H:%i') as last_updated
       FROM accounts a
       LEFT JOIN customers c ON a.customer_id = c.customer_id
       WHERE a.customer_id LIKE ? OR c.name LIKE ?
       ORDER BY a.account_balance DESC
       LIMIT ? OFFSET ?`,
      [search, search, limit, offset]
    );

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 3. TRANSACTIONS
// ==============================================================================
router.get('/transactions', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;
    const search = req.query.search ? `%${req.query.search.trim()}%` : '%';
    const status = req.query.status;
    const txnType = req.query.txnType;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let whereSql = '(t.txn_id LIKE ? OR t.customer_id LIKE ?)';
    let params = [search, search];

    if (status && status !== 'All') {
      whereSql += ' AND t.status = ?';
      params.push(status.toLowerCase());
    }
    if (txnType && txnType !== 'All') {
      whereSql += ' AND t.txn_type = ?';
      params.push(txnType);
    }
    if (startDate && endDate) {
      whereSql += ' AND t.txn_time >= ? AND t.txn_time <= ?';
      params.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM transactions t WHERE ${whereSql}`,
      params
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT t.txn_id, t.customer_id, c.name as customer_name, t.txn_type, t.amount, 
              DATE_FORMAT(t.txn_time, '%Y-%m-%d %H:%i') as txn_time, t.status
       FROM transactions t
       LEFT JOIN customers c ON t.customer_id = c.customer_id
       WHERE ${whereSql}
       ORDER BY t.txn_time DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 4. LOANS
// ==============================================================================
router.get('/loans', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let whereSql = '1=1';
    let params = [];

    if (status && status !== 'All') {
      whereSql += ' AND Loan_Status = ?';
      params.push(status);
    }

    const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM loans WHERE ${whereSql}`, params);
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT Loan_ID, Customer_ID, Branch, Loan_Type, Loan_Amount, Interest_Rate, 
              Loan_Term_Months, Start_Date, End_Date, Loan_Status 
       FROM loans 
       WHERE ${whereSql} 
       ORDER BY Loan_Amount DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 5. CREDIT CARDS
// ==============================================================================
router.get('/credit-cards', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let whereSql = '1=1';
    let params = [];

    if (status && status !== 'All') {
      whereSql += ' AND Status = ?';
      params.push(status);
    }

    const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM credit_cards WHERE ${whereSql}`, params);
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT Card_ID, Customer_ID, Branch, Card_Type, Card_Network, Credit_Limit, 
              Current_Balance, ROUND((Current_Balance / Credit_Limit) * 100, 1) as utilization_pct,
              Issued_Date, Expiry_Date, Status 
       FROM credit_cards 
       WHERE ${whereSql} 
       ORDER BY Current_Balance DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 6. BRANCHES
// ==============================================================================
router.get('/branches', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT branch_id, branch_name, city, manager_name, total_employees, 
              branch_revenue, DATE_FORMAT(opening_date, '%Y-%m-%d') as opening_date, 
              performance_rating 
       FROM branches 
       ORDER BY branch_revenue DESC`
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// 7. SUPPORT TICKETS
// ==============================================================================
router.get('/support-tickets', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const priority = req.query.priority;

    let whereSql = '1=1';
    let params = [];

    if (status && status !== 'All') {
      whereSql += ' AND Status = ?';
      params.push(status);
    }
    if (priority && priority !== 'All') {
      whereSql += ' AND Priority = ?';
      params.push(priority);
    }

    const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM support_tickets WHERE ${whereSql}`, params);
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT Ticket_ID, Customer_ID, Branch_Name, Issue_Category, Description, 
              Date_Opened, Date_Closed, Priority, Status, Support_Agent, Channel, Customer_Rating 
       FROM support_tickets 
       WHERE ${whereSql} 
       ORDER BY Date_Opened DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
