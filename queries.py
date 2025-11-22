from helpers import run_query

# 1. Q1: Customers per city + avg balance
def q1_customers_per_city_avg_balance():
    return run_query("""
        SELECT c.city,
               COUNT(c.customer_id) AS total_customers,
               ROUND(AVG(a.account_balance),2) AS avg_balance
        FROM customers c
        JOIN accounts a ON c.customer_id = a.customer_id
        GROUP BY c.city
        ORDER BY total_customers DESC;
    """)

# 2. Q2: Account type (from customers table) highest total balance
def q2_account_type_highest_total_balance():
    return run_query("""
        SELECT 
            c.account_type,
            SUM(a.account_balance) AS total_balance
        FROM accounts a
        JOIN customers c ON a.customer_id = c.customer_id
        GROUP BY c.account_type
        ORDER BY total_balance DESC;
    """)

# 3. Q3: Top 10 customers by total balance
def q3_top_10_customers_by_balance():
    return run_query("""
        SELECT c.customer_id, c.name,
               SUM(a.account_balance) AS total_balance
        FROM customers c
        JOIN accounts a ON c.customer_id = a.customer_id
        GROUP BY c.customer_id, c.name
        ORDER BY total_balance DESC
        LIMIT 10;
    """)

# 4. Q4: Customers who joined in 2023 with balance > 100000
def q4_customers_opened_2023_above_100k():
    return run_query("""
        SELECT c.customer_id, c.name, c.join_date,
               a.account_balance
        FROM customers c
        JOIN accounts a ON c.customer_id = a.customer_id
        WHERE YEAR(c.join_date) = 2023
          AND a.account_balance > 100000;
    """)

# 5. Q5: Total transaction volume by type
def q5_total_volume_by_txn_type():
    return run_query("""
        SELECT txn_type, 
               SUM(amount) AS total_amount
        FROM transactions
        GROUP BY txn_type
        ORDER BY total_amount DESC;
    """)

# 6. Q6: Accounts with >3 failed txn in a month
def q6_accounts_more_than_3_failed_month():
    return run_query("""
        SELECT customer_id,
               YEAR(txn_time) AS yr,
               MONTH(txn_time) AS mon,
               COUNT(*) AS failed_count
        FROM transactions
        WHERE status = 'failed'
        GROUP BY customer_id, yr, mon
        HAVING failed_count > 3
        ORDER BY failed_count DESC;
    """)

# 7. Q7: Top 5 branches by txn volume (requires branch_id in txn)
def q7_top5_branches_last_6_months():
    return run_query("""
        SELECT COALESCE(t.branch, 'UNKNOWN') AS branch_name,
        ROUND(SUM(t.amount),2) AS total_volume,
          COUNT(*) AS txn_count
        FROM transactions t
        WHERE t.txn_time >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY t.branch
        ORDER BY total_volume DESC
        LIMIT 5;
    """)

# 8. Q8: 5+ high value (>200000) txns
def q8_accounts_high_value_5plus():
    return run_query("""
        SELECT customer_id,
               COUNT(*) AS high_value_txns
        FROM transactions
        WHERE amount > 200000
        GROUP BY customer_id
        HAVING high_value_txns >= 5
        ORDER BY high_value_txns DESC;
    """)

# 9. Q9: Avg loan amount & interest by type
def q9_avg_loan_amount_interest_by_type():
    return run_query("""
        SELECT loan_type,
               ROUND(AVG(loan_amount),2) AS avg_loan_amount,
               ROUND(AVG(interest_rate),2) AS avg_interest_rate
        FROM loans
        GROUP BY loan_type;
    """)

# 10. Q10: Customers with multiple active/approved loans
def q10_customers_multiple_active_loans():
    return run_query("""
        SELECT customer_id,
               COUNT(*) AS active_loans
        FROM loans
        WHERE loan_status IN ('Active','Approved')
        GROUP BY customer_id
        HAVING active_loans > 1;
    """)

# 11. Q11: Highest outstanding loan customers
def q11_top5_customers_highest_outstanding():
    return run_query("""
        SELECT customer_id,
               SUM(loan_amount) AS outstanding_amount
        FROM loans
        WHERE loan_status != 'Closed'
        GROUP BY customer_id
        ORDER BY outstanding_amount DESC
        LIMIT 5;
    """)

# 12. Q12: Branch with highest total balance (requires branch_id inside accounts)
def q12_branch_highest_total_balance():
    return run_query("""
        SELECT b.branch_id, b.branch_name,
               SUM(a.account_balance) AS total_balance
        FROM accounts a
        JOIN branches b ON a.branch_id = b.branch_id
        GROUP BY b.branch_id, b.branch_name
        ORDER BY total_balance DESC
        LIMIT 1;
    """)

# 13. Q13: Branch performance
def q13_branch_performance_summary():
    return run_query("""
        SELECT 
            b.branch_id,
            b.branch_name,

            COUNT(DISTINCT a.customer_id) AS total_customers,
            ROUND(COALESCE(SUM(a.account_balance), 0), 2) AS total_account_balance,
            ROUND(COALESCE(SUM(t.amount), 0), 2) AS total_txn_volume,
            ROUND(COALESCE(SUM(l.loan_amount), 0), 2) AS total_loan_amount

        FROM branches b
        LEFT JOIN accounts a 
            ON b.branch_id = a.branch_id

        LEFT JOIN transactions t 
            ON b.branch_id = t.branch_id

        LEFT JOIN loans l 
            ON b.branch_name = l.branch   -- MATCHES YOUR TABLE EXACTLY

        GROUP BY 
            b.branch_id, 
            b.branch_name

        ORDER BY total_txn_volume DESC
        LIMIT 10;
    """)

# 14. Q14: Longest average ticket resolution
def q14_issue_category_longest_resolution():
    return run_query("""
        SELECT 
            issue_category,
            ROUND(AVG(DATEDIFF(Date_Closed, Date_Opened)), 2) AS avg_resolution_days
        FROM support_tickets
        WHERE Date_Closed IS NOT NULL
        GROUP BY issue_category
        ORDER BY avg_resolution_days DESC;
    """)

# 15. Q15: Agents resolving most critical high-rated tickets
def q15_agents_most_highrated_critical():
    return run_query("""
        SELECT support_agent,
               COUNT(*) AS high_rated_resolved
        FROM support_tickets
        WHERE customer_rating >= 4
          AND priority = 'Critical'
          AND status IN ('Resolved','Closed')
        GROUP BY support_agent
        ORDER BY high_rated_resolved DESC;
    """)