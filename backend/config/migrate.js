import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  try {
    const migrationPath = path.resolve(__dirname, '../migrations/001_create_users_table.sql');
    if (fs.existsSync(migrationPath)) {
      const sql = fs.readFileSync(migrationPath, 'utf8');
      await pool.query(sql);
      // Check if any users exist
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
      if (rows[0].count === 0) {
        console.log('Seeding initial Admin and Analyst users...');
        const adminHash = await bcrypt.hash('Admin@123', 10);
        const analystHash = await bcrypt.hash('Analyst@123', 10);

        await pool.query(
          `INSERT INTO users (username, email, password_hash, full_name, role) VALUES 
          (?, ?, ?, ?, ?),
          (?, ?, ?, ?, ?)`,
          [
            'admin', 'admin@banksight.internal', adminHash, 'System Administrator', 'admin',
            'analyst', 'analyst@banksight.internal', analystHash, 'Risk Analyst', 'analyst'
          ]
        );
        console.log('Initial accounts seeded: admin (Admin@123) and analyst (Analyst@123)');
      }
    }
  } catch (err) {
    console.warn('Migration warning:', err.message);
  }
}
