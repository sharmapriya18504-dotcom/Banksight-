import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

// 1. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please provide both username/email and password.' });
    }

    const [users] = await pool.query(
      'SELECT id, username, email, password_hash, full_name, role FROM users WHERE username = ? OR email = ? LIMIT 1',
      [identifier.trim(), identifier.trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username/email or password.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username/email or password.' });
    }

    const token = signToken(user);
    res.cookie('bs_token', token, COOKIE_OPTIONS);

    res.json({
      success: true,
      token, // Also provided for API client / Postman convenience
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. SIGNUP (Creates Analyst account only)
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ error: 'All fields (Username, Email, Full Name, Password) are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check existing
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
      [username.trim(), email.trim()]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username or email already registered.' });
    }

    const hash = await bcrypt.hash(password, 10);
    // Role is strictly locked to analyst for public signups
    const role = 'analyst';

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)',
      [username.trim(), email.trim(), hash, fullName.trim(), role]
    );

    const newUser = {
      id: result.insertId,
      username: username.trim(),
      email: email.trim(),
      full_name: fullName.trim(),
      role
    };

    const token = signToken(newUser);
    res.cookie('bs_token', token, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.full_name,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('bs_token', COOKIE_OPTIONS);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 4. ME / SESSION VERIFICATION
router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: req.user
  });
});

export default router;
