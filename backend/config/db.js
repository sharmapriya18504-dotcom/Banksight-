import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'banksight',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

export const pool = mysql.createPool(dbConfig);

export async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    const [versionRes] = await connection.query('SELECT VERSION() as version, DATABASE() as db');
    const [tablesRes] = await connection.query('SHOW TABLES');
    connection.release();

    const tables = tablesRes.map(row => Object.values(row)[0]);
    return {
      connected: true,
      message: 'Database connected successfully via MySQL pool.',
      version: versionRes[0]?.version || 'Unknown',
      database: versionRes[0]?.db || dbConfig.database,
      tablesCount: tables.length,
      tables,
      host: dbConfig.host,
      port: dbConfig.port
    };
  } catch (error) {
    return {
      connected: false,
      message: `Database connection error: ${error.message}`,
      host: dbConfig.host,
      port: dbConfig.port
    };
  }
}
