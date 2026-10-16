# 📡 BankSight REST API Specification

BankSight provides an industry-grade, modular REST API powered by **Node.js, Express.js, and MySQL (InnoDB)**.

All endpoints return JSON responses and standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Server Error`).

---

## 🔒 1. Authentication & Session Endpoints (`/api/auth`)

### `POST /api/auth/login`
Authenticates a user using bcrypt password verification. Sets an `HttpOnly` secure cookie (`bs_token`) and returns a JWT token for Postman / API testing.

- **Request Body:**
  ```json
  {
    "identifier": "admin",
    "password": "Admin@123"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@banksight.internal",
      "fullName": "System Administrator",
      "role": "admin"
    }
  }
  ```

### `POST /api/auth/signup`
Creates a new account with strict `analyst` role (read-only analytical access).
- **Request Body:**
  ```json
  {
    "username": "psharma",
    "fullName": "Priya Sharma",
    "email": "priya@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Response `201 Created`:** User registered and authenticated.

### `POST /api/auth/logout`
Clears the `bs_token` cookie.
- **Response `200 OK`:** `{ "success": true, "message": "Logged out successfully." }`

### `GET /api/auth/me`
Verifies current session and returns active user profile.
- **Headers:** Cookie `bs_token` OR `Authorization: Bearer <token>`
- **Response `200 OK`:** `{ "user": { "id": 1, "username": "admin", "role": "admin" } }`

---

## 🩺 2. System Diagnostics (`/api/health`)

### `GET /api/health`
Checks MySQL connection pool liveness and returns version & table count.
- **Response `200 OK`:**
  ```json
  {
    "connected": true,
    "message": "Database connected successfully via MySQL pool.",
    "version": "8.0.44",
    "database": "banksight",
    "tablesCount": 8,
    "tables": ["accounts", "branches", "credit_cards", "customers", "loans", "support_tickets", "transactions", "users"],
    "host": "localhost",
    "port": 3307
  }
  ```

---

## 📊 3. Executive Dashboard & Charts (`/api`)

### `GET /api/kpis`
Calculates dynamic KPIs across all 7 entities.
- **Query Parameters:** `status` (`'All'`, `'success'`, `'failed'`), `startDate`, `endDate`, `txnTypes`.
- **Response `200 OK`:**
  ```json
  {
    "metrics": {
      "totalCustomers": 500,
      "totalAccounts": 497,
      "totalBalance": 128456720.50,
      "totalTransactions": 10000,
      "totalVolume": 89432010.00,
      "failedTransactions": 382,
      "failureRate": 3.82,
      "successRate": 96.18,
      "activeLoans": 184,
      "totalLoanAmount": 45200000,
      "totalCreditCards": 350,
      "openTickets": 42
    }
  }
  ```

### `GET /api/charts/monthly`
Aggregates monthly transaction volume and success rate percentages over time.

### `GET /api/charts/flow`
Aggregates systemic inflows (Credit: Deposits, Salary, Refunds) vs outflows (Debit: Withdrawals, Transfers, Bill Pay).

### `GET /api/charts/balances`
Groups customer balances into brackets (`< ₹25K`, `₹25K - ₹1L`, `₹1L - ₹5L`, `> ₹5L`).

### `GET /api/charts/loans`
Returns active vs paid-off vs defaulted principal amounts and average interest rates.

### `GET /api/charts/branches`
Top regional branches ranked by annual operating revenue and employee counts.

### `GET /api/recent-transactions`
Returns latest 10 real-time transaction ledger entries with customer joins.

---

## 👥 4. Banking Entities CRUD & Search (`/api`)

### `GET /api/customers`
Paginated customer list with demographic search and tier filters.
- **Query Parameters:** `page`, `limit`, `search` (name or ID), `city`, `accountType`.
- **Response `200 OK`:**
  ```json
  {
    "data": [
      {
        "customer_id": "C0003",
        "name": "Megan Alvarez",
        "gender": "M",
        "age": 46,
        "city": "West Laurieton",
        "account_type": "Savings",
        "join_date": "2022-05-25",
        "balance": "171156.21"
      }
    ],
    "pagination": { "page": 1, "limit": 15, "total": 500, "totalPages": 34 }
  }
  ```

### `GET /api/customers/:id`
Customer 360 inspect endpoint: returns demographic profile, liquid deposit account balance, active loans, credit cards, and latest 10 transactions.

### `POST /api/customers` (Admin Role Required)
Creates a new customer record with parameterized validation.

### `DELETE /api/customers/:id` (Admin Role Required)
Deletes a customer only after verifying 0 linked accounts and 0 transaction history (Foreign Key referential integrity safeguard).

### `GET /api/accounts`
Paginated deposit accounts list with customer names and balances.

### `GET /api/transactions`
Paginated audit feed with date range, status, and transaction type filters.

### `GET /api/loans`
Paginated loans portfolio with status filters (`Active`, `Paid Off`, `Defaulted`).

### `GET /api/credit-cards`
Paginated credit cards with utilization percentages and network indicators.

### `GET /api/branches`
List of all operational branches with revenue and performance ratings.

### `GET /api/support-tickets`
Paginated support tickets with priority and resolution status filters.

---

## ⚡ 5. ACID Credit/Debit Ledger Simulator (`/api/simulate`)

### `POST /api/simulate/execute`
Executes an atomic balance operation enforcing ACID isolation:
1. `connection.beginTransaction()`
2. `SELECT account_balance FROM accounts WHERE customer_id = ? FOR UPDATE` (row-level lock)
3. Balance sufficiency check (declines overdraft attempts immediately)
4. `UPDATE accounts SET account_balance = ? WHERE customer_id = ?`
5. `INSERT INTO transactions (...) VALUES (...)`
6. `connection.commit()`

- **Request Body:**
  ```json
  {
    "customerId": "C0003",
    "action": "deposit",
    "amount": 2500
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Deposit of ₹2,500 successfully processed!",
    "txnId": "TXN20261016010531A2F1",
    "oldBalance": 171156.21,
    "newBalance": 173656.21,
    "delta": 2500,
    "customerId": "C0003",
    "timestamp": "2026-10-16T01:05:31.000Z"
  }
  ```

---

## 💡 6. 15 Schema-Verified SQL Insights (`/api/insights`)

- `GET /api/insights`: Returns catalog metadata for all 15 queries.
- `GET /api/insights/:id`: Executes query `Q01` through `Q15` on MySQL, returns live result set, row count, copyable SQL string, and execution latency in milliseconds (`latencyMs`).

---

## 📑 7. Executive Summary Reports (`/api/reports`)

### `GET /api/reports/summary`
Returns comprehensive executive summary across liquidity reserves, cash flow volume, lending risk, and top branch rankings for PDF/CSV generation.
