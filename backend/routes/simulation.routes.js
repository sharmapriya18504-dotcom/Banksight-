import express from 'express';
import crypto from 'crypto';
import { pool } from '../config/db.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// 1. GET ELIGIBLE SIMULATION ACCOUNTS
router.get('/accounts', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.customer_id,
        c.name,
        c.city,
        c.account_type,
        ROUND(a.account_balance, 2) AS account_balance,
        a.last_updated
      FROM accounts a
      JOIN customers c ON a.customer_id = c.customer_id
      ORDER BY a.account_balance DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET RECENT TRANSACTION HISTORY FOR ACCOUNT
router.get('/history/:customerId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT txn_id, txn_type, amount, status, DATE_FORMAT(txn_time, '%Y-%m-%d %H:%i') as txn_time
      FROM transactions
      WHERE customer_id = ?
      ORDER BY txn_time DESC
      LIMIT 10
    `, [req.params.customerId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. EXECUTE ACID SIMULATION
router.post('/execute', optionalAuth, async (req, res) => {
  const { customerId, action, amount } = req.body;

  if (!customerId) {
    return res.status(400).json({ success: false, message: 'Customer ID is required.' });
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ success: false, message: 'Transaction amount must be greater than ₹0.00.' });
  }

  if (numAmount > 10000000) {
    return res.status(400).json({ success: false, message: 'Transaction exceeds single-transfer regulatory limit of ₹1 Crore.' });
  }

  const act = (action || '').toLowerCase();
  if (!['deposit', 'withdrawal'].includes(act)) {
    return res.status(400).json({ success: false, message: 'Action must be deposit or withdrawal.' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Lock account row for atomic balance check
    const [accRows] = await connection.query(
      'SELECT account_balance FROM accounts WHERE customer_id = ? FOR UPDATE',
      [customerId]
    );

    if (accRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: `Account for Customer ${customerId} not found in database.` });
    }

    const currentBalance = parseFloat(accRows[0].account_balance);
    let newBalance = currentBalance;

    if (act === 'deposit') {
      newBalance = currentBalance + numAmount;
    } else {
      if (currentBalance < numAmount) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Declined: Insufficient balance. Available: ₹${currentBalance.toLocaleString('en-IN')}, Requested: ₹${numAmount.toLocaleString('en-IN')}.`
        });
      }
      if (currentBalance - numAmount < 1000.0) {
        await connection.rollback();
        const remaining = currentBalance - numAmount;
        return res.status(400).json({
          success: false,
          message: `Declined: Minimum balance requirement of ₹1,000.00 violated. Account balance cannot drop below ₹1,000.00 (Available: ₹${currentBalance.toLocaleString('en-IN')}, Requested: ₹${numAmount.toLocaleString('en-IN')}, Remaining would be: ₹${remaining.toLocaleString('en-IN')}).`
        });
      }
      newBalance = currentBalance - numAmount;
    }

    // Generate unique transaction ID (TXN + timestamp + hex)
    const nowTs = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const randSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
    const txnId = `TXN${nowTs}${randSuffix}`;

    // Update account balance
    await connection.query(
      'UPDATE accounts SET account_balance = ?, last_updated = NOW() WHERE customer_id = ?',
      [newBalance, customerId]
    );

    // Insert transaction into transactions ledger
    await connection.query(
      'INSERT INTO transactions (txn_id, customer_id, txn_type, amount, txn_time, status) VALUES (?, ?, ?, ?, NOW(), ?)',
      [txnId, customerId, act, numAmount, 'success']
    );

    await connection.commit();

    res.json({
      success: true,
      message: `${act === 'deposit' ? 'Deposit' : 'Withdrawal'} of ₹${numAmount.toLocaleString('en-IN')} successfully processed!`,
      txnId,
      oldBalance: currentBalance,
      newBalance,
      delta: act === 'deposit' ? numAmount : -numAmount,
      customerId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: `ACID Execution Error: ${error.message}` });
  } finally {
    connection.release();
  }
});

export default router;
