# 🚀 BankSight Production Deployment Guide

This guide walks you through deploying **BankSight: Transaction Intelligence Dashboard** both **locally** and to **cloud hosting environments** (Render.com, Railway.app, or VPS).

---

## 🛠 Local Single-Command Execution

BankSight is architected for single-port unified execution where Node.js Express serves both the **REST API** and the compiled **React Single Page Application (SPA)** from `http://localhost:5000`.

### Option A: Production Unified Server (Fastest)

1. **Install Dependencies & Build Client:**
   ```bash
   npm install
   npm run build
   ```
2. **Start Unified Server:**
   ```bash
   npm start
   ```
   Open **`http://localhost:5000`** in your browser.

---

### Option B: Development Mode (Hot Reloading)

1. **Terminal 1 (Backend API with Auto-Restart):**
   ```bash
   npm run server
   ```
   *(Runs on `http://localhost:5000`)*

2. **Terminal 2 (Frontend React Vite Dev Server):**
   ```bash
   npm run client
   ```
   *(Runs on `http://localhost:5173` with auto-proxying to port 5000)*

---

## ☁️ Cloud Deployment (Render.com)

Render provides free/low-cost Web Services for Node.js.

### Step 1: Push Repository to GitHub
Ensure `.env` is ignored by Git (already configured in `.gitignore`):
```bash
git add .
git commit -m "Upgrade BankSight to modular React + Node.js + MySQL architecture"
git push origin main
```

### Step 2: Set Up a Cloud MySQL Database
Cloud hosts cannot reach `localhost:3306` or `localhost:3307`. Provision a managed MySQL database using:
- **Aiven for MySQL** (Free tier available)
- **Railway MySQL**
- **PlanetScale** or **AWS RDS**

Export your local tables and import them to your cloud MySQL:
```bash
mysqldump -u root -p banksight > banksight_backup.sql
mysql -h your-cloud-mysql-host.com -u your_user -p banksight < banksight_backup.sql
```

### Step 3: Create Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + → Web Service**.
2. Connect your GitHub repository: `sharmapriya18504-dotcom/Banksight`.
3. Configure the service settings:
   - **Environment:** `Node`
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Add **Environment Variables** under Environment tab:
   ```env
   NODE_ENV=production
   PORT=10000
   DB_HOST=your-remote-mysql-host.com
   DB_PORT=3306
   DB_USER=your_db_username
   DB_PASSWORD=your_secure_db_password
   DB_NAME=banksight
   JWT_SECRET=super_secret_production_jwt_key_2026
   ```
5. Click **Create Web Service**.

Render will install dependencies, build the React frontend into `frontend/dist`, and start Express on the allocated port. Your live URL will be: `https://banksight-app.onrender.com`.

---

## 🚂 Cloud Deployment (Railway.app)

1. Go to [Railway.app](https://railway.app/) and create a **New Project**.
2. Add a **MySQL** database service.
3. Add a **GitHub Repo** service pointing to `sharmapriya18504-dotcom/Banksight`.
4. In Project Variables, link database variables:
   - `DB_HOST`: `${{MySQL.MYSQLHOST}}`
   - `DB_PORT`: `${{MySQL.MYSQLPORT}}`
   - `DB_USER`: `${{MySQL.MYSQLUSER}}`
   - `DB_PASSWORD`: `${{MySQL.MYSQLPASSWORD}}`
   - `DB_NAME`: `${{MySQL.MYSQLDATABASE}}`
   - `JWT_SECRET`: `secure_railway_jwt_secret_2026`
5. Railway automatically executes `npm run build` and `npm start`.

---

## 🧪 Post-Deployment Verification Checklist

1. **Health Check:** Open `https://your-domain.com/api/health` and verify:
   ```json
   { "connected": true, "database": "banksight", "tablesCount": 8 }
   ```
2. **Dashboard UI:** Open `https://your-domain.com/` and confirm that all 8 KPI cards render real numbers.
3. **Authentication:**
   - Log in using demo admin credentials: `admin` / `Admin@123`.
   - Verify that your role badge shows `ADMIN`.
4. **Simulation:**
   - Go to `/simulation`.
   - Select an account, enter ₹100 deposit, and click Execute.
   - Verify that an ACID receipt appears with updated balance.
5. **Insights:**
   - Go to `/insights`.
   - Click `Q06: Credit vs Debit Breakdown` and `Q15: Fraud Detection`.
   - Confirm execution latency is reported under 50ms.
