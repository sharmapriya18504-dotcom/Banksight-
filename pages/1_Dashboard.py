"""
BankSight - Executive Banking Analytics Dashboard
Page 1: Comprehensive KPI metrics, trend charts, and risk monitoring.
"""

import streamlit as st
import pandas as pd
from helpers import inject_custom_css, run_query, format_currency, format_number
from components.sidebar import render_sidebar
from components.kpi_cards import render_overview_kpis
from components.charts import (
    chart_monthly_trends,
    chart_credit_vs_debit,
    chart_balance_distribution,
    chart_loan_status,
    chart_branch_performance,
    chart_customer_segmentation,
    chart_transaction_failures
)

st.set_page_config(
    page_title="Executive Dashboard | BankSight",
    page_icon="🏦",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Apply Dark Navy Design System
inject_custom_css()
render_sidebar()

# Page Header
st.markdown("""
<div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;">
    <div>
        <h1 style="font-size: 2rem; font-weight: 800; margin: 0; color: #1e3a8a;">
            Executive Banking Dashboard
        </h1>
        <p style="color: #64748b; margin: 0.3rem 0 0 0; font-size: 0.95rem;">
            Real-time multi-dimensional portfolio intelligence, cash flow liquidity & risk surveillance.
        </p>
    </div>
    <div style="text-align: right;">
        <span class="kpi-badge badge-emerald" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
            <span class="live-dot-success"></span> LIVE LEDGER AUDIT
        </span>
    </div>
</div>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# GLOBAL FILTER BAR
# -----------------------------------------------------------------------------
with st.expander("🔍 Interactive Dashboard Filters", expanded=True):
    f_col1, f_col2, f_col3 = st.columns([2, 1, 1])

    # Fetch min and max transaction dates for slider
    date_bounds = run_query("SELECT MIN(txn_time) as min_t, MAX(txn_time) as max_t FROM transactions")
    min_date = pd.to_datetime(date_bounds['min_t'].iloc[0]).date() if not date_bounds.empty and pd.notna(date_bounds['min_t'].iloc[0]) else None
    max_date = pd.to_datetime(date_bounds['max_t'].iloc[0]).date() if not date_bounds.empty and pd.notna(date_bounds['max_t'].iloc[0]) else None

    with f_col1:
        if min_date and max_date:
            selected_dates = st.date_input(
                "Filter Date Range (Transactions)",
                value=(min_date, max_date),
                min_value=min_date,
                max_value=max_date,
                help="Filters transactions and monthly trends across selected timeframe."
            )
        else:
            selected_dates = None

    with f_col2:
        status_filter = st.selectbox(
            "Transaction Status",
            options=["All Statuses", "Success Only", "Failed Only"],
            index=0
        )

    with f_col3:
        all_types = ["deposit", "withdrawal", "transfer", "purchase", "online fraud", "credit"]
        selected_types = st.multiselect(
            "Transaction Types",
            options=all_types,
            default=all_types
        )

# Construct Dynamic SQL Filter Clause
where_clauses = ["1=1"]
filter_params = []

if selected_dates and len(selected_dates) == 2:
    start_d, end_d = selected_dates
    where_clauses.append("txn_time >= %s AND txn_time <= %s")
    filter_params.extend([f"{start_d} 00:00:00", f"{end_d} 23:59:59"])

if status_filter == "Success Only":
    where_clauses.append("status = 'success'")
elif status_filter == "Failed Only":
    where_clauses.append("status = 'failed'")

if selected_types and len(selected_types) < len(all_types):
    placeholders = ", ".join(["%s"] * len(selected_types))
    where_clauses.append(f"txn_type IN ({placeholders})")
    filter_params.extend(selected_types)

filter_sql = " AND ".join(where_clauses)

# -----------------------------------------------------------------------------
# 1. KPI CARDS CALCULATION (Dynamic from Database)
# -----------------------------------------------------------------------------
kpi_query = f"""
    SELECT 
        (SELECT COUNT(*) FROM customers) AS total_customers,
        (SELECT COUNT(*) FROM accounts) AS total_accounts,
        (SELECT COUNT(*) FROM transactions WHERE {filter_sql}) AS total_transactions,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE {filter_sql}) AS total_txn_amount,
        (SELECT COUNT(*) FROM loans) AS total_loans,
        (SELECT COUNT(*) FROM credit_cards) AS total_credit_cards,
        (SELECT COUNT(*) FROM transactions WHERE status = 'failed' AND {filter_sql}) AS failed_transactions,
        (SELECT COUNT(*) FROM support_tickets) AS total_support_tickets
"""

kpi_res = run_query(kpi_query, filter_params if filter_params else None)

if not kpi_res.empty:
    metrics = {
        "total_customers": int(kpi_res["total_customers"].iloc[0]),
        "total_accounts": int(kpi_res["total_accounts"].iloc[0]),
        "total_transactions": int(kpi_res["total_transactions"].iloc[0]),
        "total_txn_amount": float(kpi_res["total_txn_amount"].iloc[0]),
        "total_loans": int(kpi_res["total_loans"].iloc[0]),
        "total_credit_cards": int(kpi_res["total_credit_cards"].iloc[0]),
        "failed_transactions": int(kpi_res["failed_transactions"].iloc[0]),
        "total_support_tickets": int(kpi_res["total_support_tickets"].iloc[0])
    }
else:
    metrics = {}

render_overview_kpis(metrics)

st.markdown("<br>", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 2. CHARTS SECTION
# -----------------------------------------------------------------------------
# Row 1: Monthly Trends (2/3) + Credit vs Debit (1/3)
c_row1_left, c_row1_right = st.columns([2, 1])

with c_row1_left:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    monthly_sql = f"""
        SELECT 
            DATE_FORMAT(txn_time, '%Y-%m') AS txn_month,
            COUNT(*) AS total_txns,
            ROUND(SUM(amount), 2) AS total_volume,
            ROUND((SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS success_rate_pct
        FROM transactions
        WHERE {filter_sql}
        GROUP BY txn_month
        ORDER BY txn_month ASC
    """
    df_monthly = run_query(monthly_sql, filter_params if filter_params else None)
    if not df_monthly.empty:
        fig_trend = chart_monthly_trends(df_monthly)
        st.plotly_chart(fig_trend, use_container_width=True)
    else:
        st.info("No transaction data available for the selected filters.")
    st.markdown('</div>', unsafe_allow_html=True)

with c_row1_right:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    flow_sql = f"""
        SELECT 
            CASE 
                WHEN txn_type IN ('deposit', 'credit') THEN 'Credit (Inflow)'
                ELSE 'Debit (Outflow)'
            END AS flow_type,
            ROUND(SUM(amount), 2) AS total_volume
        FROM transactions
        WHERE {filter_sql}
        GROUP BY flow_type
    """
    df_flow = run_query(flow_sql, filter_params if filter_params else None)
    if not df_flow.empty:
        fig_flow = chart_credit_vs_debit(df_flow)
        st.plotly_chart(fig_flow, use_container_width=True)
    else:
        st.info("No flow data available.")
    st.markdown('</div>', unsafe_allow_html=True)

# Row 2: Account Balance Distribution & Loan Status Distribution
c_row2_left, c_row2_right = st.columns(2)

with c_row2_left:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    df_balances = run_query("SELECT account_balance FROM accounts WHERE account_balance IS NOT NULL")
    if not df_balances.empty:
        fig_bal = chart_balance_distribution(df_balances)
        st.plotly_chart(fig_bal, use_container_width=True)
    else:
        st.info("No account balance data available.")
    st.markdown('</div>', unsafe_allow_html=True)

with c_row2_right:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    df_loans = run_query("""
        SELECT 
            Loan_Status,
            COUNT(*) AS total_loans,
            ROUND(SUM(Loan_Amount), 2) AS total_principal
        FROM loans
        GROUP BY Loan_Status
        ORDER BY total_principal DESC
    """)
    if not df_loans.empty:
        fig_loan = chart_loan_status(df_loans)
        st.plotly_chart(fig_loan, use_container_width=True)
    else:
        st.info("No loan portfolio data available.")
    st.markdown('</div>', unsafe_allow_html=True)

# Row 3: Branch Performance & Transaction Failure Analysis
c_row3_left, c_row3_right = st.columns(2)

with c_row3_left:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    df_branches = run_query("""
        SELECT 
            branch_name,
            ROUND(branch_revenue, 2) AS branch_revenue,
            performance_rating
        FROM branches
        ORDER BY branch_revenue DESC
        LIMIT 10
    """)
    if not df_branches.empty:
        fig_branch = chart_branch_performance(df_branches)
        st.plotly_chart(fig_branch, use_container_width=True)
    else:
        st.info("No branch data available.")
    st.markdown('</div>', unsafe_allow_html=True)

with c_row3_right:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    df_failures = run_query(f"""
        SELECT 
            txn_type,
            COUNT(*) AS failed_count,
            ROUND(SUM(amount), 2) AS failed_volume
        FROM transactions
        WHERE status = 'failed' AND {filter_sql}
        GROUP BY txn_type
        ORDER BY failed_count DESC
    """, filter_params if filter_params else None)
    if not df_failures.empty:
        fig_fail = chart_transaction_failures(df_failures)
        st.plotly_chart(fig_fail, use_container_width=True)
    else:
        st.info("No failed transactions in the current filter range.")
    st.markdown('</div>', unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 3. LIVE TRANSACTION FEED PREVIEW
# -----------------------------------------------------------------------------
st.markdown('<div class="content-card">', unsafe_allow_html=True)
st.subheader("⚡ Real-Time Ledger Transactions Feed")
st.markdown("<p style='color: #94a3b8; font-size: 0.85rem;'>Live audit feed of the 10 most recent transactions conforming to active filters.</p>", unsafe_allow_html=True)

recent_sql = f"""
    SELECT 
        t.txn_id AS `Txn ID`,
        t.customer_id AS `Customer ID`,
        c.name AS `Customer Name`,
        t.txn_type AS `Type`,
        CONCAT('₹', FORMAT(t.amount, 2)) AS `Amount`,
        t.status AS `Status`,
        t.txn_time AS `Timestamp`
    FROM transactions t
    LEFT JOIN customers c ON t.customer_id = c.customer_id
    WHERE {filter_sql}
    ORDER BY t.txn_time DESC
    LIMIT 10
"""
df_recent = run_query(recent_sql, filter_params if filter_params else None)

if not df_recent.empty:
    st.dataframe(df_recent, use_container_width=True, hide_index=True)
else:
    st.info("No transactions found.")
st.markdown('</div>', unsafe_allow_html=True)
