"""
BankSight Analytical SQL Engine
Contains the 15 official B.Tech Capstone analytical queries fully verified against
the live MySQL database schema.
"""

from helpers import run_query
import pandas as pd

# ==============================================================================
# 1️⃣ CUSTOMER & ACCOUNT ANALYSIS
# ==============================================================================

# Q1: How many customers exist per city, and what is their average account balance?
Q1_SQL = """
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
"""

def q1_customers_per_city_avg_balance():
    """Q1: Number of customers per city and their average account balance."""
    return run_query(Q1_SQL)

q1_top_customers_by_volume = q1_customers_per_city_avg_balance  # backward compatibility


# Q2: Which account type (Savings, Current, Loan, etc.) holds the highest total balance?
Q2_SQL = """
SELECT 
    c.account_type,
    COUNT(DISTINCT c.customer_id) AS total_accounts,
    ROUND(SUM(COALESCE(a.account_balance, 0)), 2) AS total_balance,
    ROUND(AVG(COALESCE(a.account_balance, 0)), 2) AS avg_balance
FROM customers c
LEFT JOIN accounts a ON c.customer_id = a.customer_id
GROUP BY c.account_type
ORDER BY total_balance DESC;
"""

def q2_account_type_highest_total_balance():
    """Q2: Account type holding the highest total balance."""
    return run_query(Q2_SQL)

q2_monthly_transaction_trends = q2_account_type_highest_total_balance  # backward compatibility


# Q3: Who are the top 10 customers by total account balance across all account types?
Q3_SQL = """
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
"""

def q3_top_10_customers_by_balance():
    """Q3: Top 10 customers ranked by total account balance."""
    return run_query(Q3_SQL)

q3_failed_transactions_analysis = q3_top_10_customers_by_balance  # backward compatibility


# Q4: Which customers opened accounts in 2023 with a balance above ₹1,00,000?
Q4_SQL = """
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
"""

def q4_customers_opened_2023_above_100k():
    """Q4: Customers who opened accounts in 2023 with balance > ₹1,00,000."""
    return run_query(Q4_SQL)

q4_customers_multiple_accounts = q4_customers_opened_2023_above_100k  # backward compatibility


# ==============================================================================
# 2️⃣ TRANSACTION BEHAVIOR
# ==============================================================================

# Q5: What is the total transaction volume (sum of amounts) by transaction type?
Q5_SQL = """
SELECT 
    txn_type,
    COUNT(*) AS transaction_count,
    ROUND(SUM(amount), 2) AS total_volume,
    ROUND(AVG(amount), 2) AS avg_ticket_size
FROM transactions
GROUP BY txn_type
ORDER BY total_volume DESC;
"""

def q5_total_volume_by_txn_type():
    """Q5: Total transaction volume and counts by transaction type."""
    return run_query(Q5_SQL)

q5_highest_account_balances = q5_total_volume_by_txn_type  # backward compatibility


# Q6: How many failed transactions occurred for each transaction type?
Q6_SQL = """
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
"""

def q6_failed_transactions_by_type():
    """Q6: Failed transaction count and volume by transaction type."""
    return run_query(Q6_SQL)

q6_credit_versus_debit = q6_failed_transactions_by_type  # backward compatibility
q6_accounts_more_than_3_failed_month = q6_failed_transactions_by_type  # backward compatibility


# Q7: What is the total number of transactions per transaction type?
Q7_SQL = """
SELECT 
    txn_type,
    COUNT(*) AS total_transactions,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transactions)), 2) AS pct_share
FROM transactions
GROUP BY txn_type
ORDER BY total_transactions DESC;
"""

def q7_total_transactions_per_type():
    """Q7: Total number of transactions and percentage share per transaction type."""
    return run_query(Q7_SQL)

q7_top5_branches_last_6_months = q7_total_transactions_per_type  # backward compatibility


# Q8: Which accounts have 5 or more high-value transactions above ₹20,000?
Q8_SQL = """
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
"""

def q8_accounts_high_value_5plus():
    """Q8: Accounts with 5 or more high-value transactions (> ₹20,000)."""
    return run_query(Q8_SQL)

q8_loan_status_analysis = q8_accounts_high_value_5plus  # backward compatibility


# ==============================================================================
# 3️⃣ LOAN INSIGHTS
# ==============================================================================

# Q9: What is the average loan amount and interest rate by loan type (Personal, Auto, Home, etc.)?
Q9_SQL = """
SELECT 
    Loan_Type,
    COUNT(*) AS total_loans,
    ROUND(AVG(Loan_Amount), 2) AS avg_loan_amount,
    ROUND(AVG(Interest_Rate), 2) AS avg_interest_rate,
    ROUND(SUM(Loan_Amount), 2) AS total_disbursed
FROM loans
GROUP BY Loan_Type
ORDER BY avg_loan_amount DESC;
"""

def q9_avg_loan_amount_interest_by_type():
    """Q9: Average loan amount and interest rate by loan type."""
    return run_query(Q9_SQL)

q9_highest_value_loans = q9_avg_loan_amount_interest_by_type  # backward compatibility


# Q10: Which customers currently hold more than one active or approved loan?
Q10_SQL = """
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
"""

def q10_customers_multiple_active_loans():
    """Q10: Customers holding more than one active or approved loan."""
    return run_query(Q10_SQL)

q10_credit_card_analysis = q10_customers_multiple_active_loans  # backward compatibility


# Q11: Who are the top 5 customers with the highest outstanding (non-closed) loan amounts?
Q11_SQL = """
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
"""

def q11_top5_customers_highest_outstanding():
    """Q11: Top 5 customers with highest outstanding (non-closed) loan amounts."""
    return run_query(Q11_SQL)

q11_customer_account_distribution = q11_top5_customers_highest_outstanding  # backward compatibility


# ==============================================================================
# 4️⃣ BRANCH & PERFORMANCE
# ==============================================================================

# Q12: What is the average loan amount per branch?
Q12_SQL = """
SELECT 
    Branch AS branch_name,
    COUNT(*) AS total_loans,
    ROUND(AVG(Loan_Amount), 2) AS avg_loan_amount,
    ROUND(SUM(Loan_Amount), 2) AS total_lending_volume
FROM loans
GROUP BY Branch
ORDER BY avg_loan_amount DESC
LIMIT 10;
"""

def q12_avg_loan_amount_per_branch():
    """Q12: Average loan amount per branch."""
    return run_query(Q12_SQL)

q12_branch_highest_total_balance = q12_avg_loan_amount_per_branch  # backward compatibility


# Q13: How many customers exist in each age group (e.g., 18–25, 26–35, etc.)?
Q13_SQL = """
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
"""

def q13_customers_by_age_group():
    """Q13: Customer distribution across demographic age cohorts."""
    return run_query(Q13_SQL)

q13_branch_performance_summary = q13_customers_by_age_group  # backward compatibility


# ==============================================================================
# 5️⃣ SUPPORT TICKETS & CUSTOMER EXPERIENCE
# ==============================================================================

# Q14: Which issue categories have the longest average resolution time?
Q14_SQL = """
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
"""

def q14_issue_category_longest_resolution():
    """Q14: Support issue categories with longest average resolution time."""
    return run_query(Q14_SQL)


# Q15: Which support agents have resolved the most critical tickets with high customer ratings (≥4)?
Q15_SQL = """
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
"""

def q15_agents_most_highrated_critical():
    """Q15: Support agents who resolved the most critical tickets with rating >= 4."""
    return run_query(Q15_SQL)

q15_suspicious_patterns = q15_agents_most_highrated_critical  # backward compatibility


# ==============================================================================
# INSIGHTS CATALOG METADATA (For UI Directory and Filters)
# ==============================================================================
INSIGHTS_CATALOG = {
    "Q01": {
        "title": "Customers Per City & Average Account Balance",
        "question": "How many customers exist per city, and what is their average account balance?",
        "category": "Customer & Account Analysis",
        "func": q1_customers_per_city_avg_balance,
        "sql": Q1_SQL,
        "description": "Calculates the total customer count and average liquid account balance per city to identify primary geographic banking hubs.",
        "chart_type": "bar",
        "chart_x": "city",
        "chart_y": "total_customers",
        "chart_color": "avg_account_balance"
    },
    "Q02": {
        "title": "Account Type Holding Highest Total Balance",
        "question": "Which account type (Savings, Current, Loan, etc.) holds the highest total balance?",
        "category": "Customer & Account Analysis",
        "func": q2_account_type_highest_total_balance,
        "sql": Q2_SQL,
        "description": "Compares deposit reserves and account counts across account types to determine which segment holds the highest capital.",
        "chart_type": "donut",
        "chart_names": "account_type",
        "chart_values": "total_balance"
    },
    "Q03": {
        "title": "Top 10 Customers by Total Account Balance",
        "question": "Who are the top 10 customers by total account balance across all account types?",
        "category": "Customer & Account Analysis",
        "func": q3_top_10_customers_by_balance,
        "sql": Q3_SQL,
        "description": "Profiles the top 10 high-net-worth patrons holding the largest liquid deposit balances across all banking ledgers.",
        "chart_type": "bar",
        "chart_x": "name",
        "chart_y": "total_balance",
        "chart_color": "city"
    },
    "Q04": {
        "title": "High-Value Accounts Opened in 2023 (> ₹1,00,000)",
        "question": "Which customers opened accounts in 2023 with a balance above ₹1,00,000?",
        "category": "Customer & Account Analysis",
        "func": q4_customers_opened_2023_above_100k,
        "sql": Q4_SQL,
        "description": "Filters newly onboarded accounts from 2023 that maintain substantial liquidity exceeding ₹1,00,000.",
        "chart_type": "bar",
        "chart_x": "name",
        "chart_y": "account_balance",
        "chart_color": "city"
    },
    "Q05": {
        "title": "Total Transaction Volume by Transaction Type",
        "question": "What is the total transaction volume (sum of amounts) by transaction type?",
        "category": "Transaction Behavior",
        "func": q5_total_volume_by_txn_type,
        "sql": Q5_SQL,
        "description": "Aggregates aggregate transactional capital and average ticket sizes across deposit, withdrawal, transfer, purchase, and online channels.",
        "chart_type": "bar",
        "chart_x": "txn_type",
        "chart_y": "total_volume",
        "chart_color": "transaction_count"
    },
    "Q06": {
        "title": "Failed Transactions by Transaction Type",
        "question": "How many failed transactions occurred for each transaction type?",
        "category": "Transaction Behavior",
        "func": q6_failed_transactions_by_type,
        "sql": Q6_SQL,
        "description": "Diagnoses failed transaction clusters to identify vulnerable payment channels and quantify abortive transaction amounts.",
        "chart_type": "bar",
        "chart_x": "txn_type",
        "chart_y": "failed_count",
        "chart_color": "failed_volume"
    },
    "Q07": {
        "title": "Total Number of Transactions per Transaction Type",
        "question": "What is the total number of transactions per transaction type?",
        "category": "Transaction Behavior",
        "func": q7_total_transactions_per_type,
        "sql": Q7_SQL,
        "description": "Measures transaction frequency and relative percentage share across all transaction types.",
        "chart_type": "pie",
        "chart_names": "txn_type",
        "chart_values": "total_transactions"
    },
    "Q08": {
        "title": "Accounts with 5+ High-Value Transactions (> ₹20,000)",
        "question": "Which accounts have 5 or more high-value transactions above ₹20,000?",
        "category": "Transaction Behavior",
        "func": q8_accounts_high_value_5plus,
        "sql": Q8_SQL,
        "description": "Isolates high-velocity accounts conducting multiple large transactions (> ₹20,000) for compliance monitoring and VIP relationship management.",
        "chart_type": "bar",
        "chart_x": "name",
        "chart_y": "high_value_txn_count",
        "chart_color": "total_high_value_volume"
    },
    "Q09": {
        "title": "Average Loan Amount & Interest Rate by Loan Type",
        "question": "What is the average loan amount and interest rate by loan type (Personal, Auto, Home, etc.)?",
        "category": "Loan Insights",
        "func": q9_avg_loan_amount_interest_by_type,
        "sql": Q9_SQL,
        "description": "Benchmarking lending product portfolios across Personal, Home, Auto, Education, and Business categories.",
        "chart_type": "bar",
        "chart_x": "Loan_Type",
        "chart_y": "avg_loan_amount",
        "chart_color": "avg_interest_rate"
    },
    "Q10": {
        "title": "Customers Holding Multiple Active or Approved Loans",
        "question": "Which customers currently hold more than one active or approved loan?",
        "category": "Loan Insights",
        "func": q10_customers_multiple_active_loans,
        "sql": Q10_SQL,
        "description": "Highlights leveraged borrowers managing two or more active/approved loans to evaluate debt concentration.",
        "chart_type": "bar",
        "chart_x": "name",
        "chart_y": "active_loans_count",
        "chart_color": "total_active_commitment"
    },
    "Q11": {
        "title": "Top 5 Customers with Highest Outstanding Loan Amounts",
        "question": "Who are the top 5 customers with the highest outstanding (non-closed) loan amounts?",
        "category": "Loan Insights",
        "func": q11_top5_customers_highest_outstanding,
        "sql": Q11_SQL,
        "description": "Identifies the highest credit risk concentration by ranking customers with the largest cumulative open loan balances.",
        "chart_type": "bar",
        "chart_x": "name",
        "chart_y": "total_outstanding_amount"
    },
    "Q12": {
        "title": "Average Loan Amount per Branch",
        "question": "What is the average loan amount per branch?",
        "category": "Branch & Performance",
        "func": q12_avg_loan_amount_per_branch,
        "sql": Q12_SQL,
        "description": "Compares branch lending volume and average ticket size to evaluate branch credit origination efficiency.",
        "chart_type": "bar",
        "chart_x": "branch_name",
        "chart_y": "avg_loan_amount",
        "chart_color": "total_lending_volume"
    },
    "Q13": {
        "title": "Customer Distribution by Age Cohorts",
        "question": "How many customers exist in each age group (e.g., 18–25, 26–35, etc.)?",
        "category": "Branch & Performance",
        "func": q13_customers_by_age_group,
        "sql": Q13_SQL,
        "description": "Demographic breakdown of the retail customer base into key lifecycle cohorts: Young Adult, Early Career, Prime Earning, Pre-Retirement, and Senior.",
        "chart_type": "bar",
        "chart_x": "age_group",
        "chart_y": "customer_count",
        "chart_color": "pct_share"
    },
    "Q14": {
        "title": "Support Issue Categories with Longest Resolution Time",
        "question": "Which issue categories have the longest average resolution time?",
        "category": "Support Tickets & Customer Experience",
        "func": q14_issue_category_longest_resolution,
        "sql": Q14_SQL,
        "description": "Calculates average resolution turnaround in calendar days via DATEDIFF across banking support categories.",
        "chart_type": "bar",
        "chart_x": "Issue_Category",
        "chart_y": "avg_resolution_days",
        "chart_color": "avg_customer_rating"
    },
    "Q15": {
        "title": "Top Support Agents Resolving Critical Tickets (Rating ≥ 4)",
        "question": "Which support agents have resolved the most critical tickets with high customer ratings (≥4)?",
        "category": "Support Tickets & Customer Experience",
        "func": q15_agents_most_highrated_critical,
        "sql": Q15_SQL,
        "description": "Recognizes elite customer service agents resolving high-stakes critical tickets with high satisfaction scores.",
        "chart_type": "bar",
        "chart_x": "Support_Agent",
        "chart_y": "critical_resolved_count",
        "chart_color": "avg_rating"
    }
}