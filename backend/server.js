import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { pool, checkConnection } from './config/db.js';
import { runMigrations } from './config/migrate.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import entitiesRoutes from './routes/entities.routes.js';
import insightsRoutes from './routes/insights.routes.js';
import simulationRoutes from './routes/simulation.routes.js';
import reportsRoutes from './routes/reports.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({
  origin: true, // Allow frontend dev server and production origin
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database Health & System Diagnostics
app.get('/api/health', async (req, res) => {
  const status = await checkConnection();
  res.json(status);
});

// Mount API Modules
app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', entitiesRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/simulate', simulationRoutes);
app.use('/api/reports', reportsRoutes);

// Centralized API Error Handling
app.use('/api', errorHandler);

// Serve Compiled React Frontend (Single-Port Production Architecture)
const frontendDist = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.resolve(frontendDist, 'index.html'));
  });
}

// Start Server & Run Auto-Migrations
async function startServer() {
  await runMigrations();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏦 BankSight Enterprise Engine Active`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🛡️ Architecture: Express + MySQL InnoDB + React SPA`);
    console.log(`=======================================================`);
  });
}

startServer();

export default app;
