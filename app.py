"""
BankSight: Transaction Intelligence Dashboard
Main Application Entry Point & Executive Landing Page
"""

import streamlit as st
from helpers import inject_custom_css, run_query, format_currency, format_number
from components.sidebar import render_sidebar
from db import check_db_connection

st.set_page_config(
    page_title="BankSight | Transaction Intelligence Dashboard",
    page_icon="🏦",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Apply Dark Navy Design System
inject_custom_css()
render_sidebar()

# -----------------------------------------------------------------------------
# 1. HERO SECTION
# -----------------------------------------------------------------------------
st.markdown("""
<div class="hero-banner">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
        <div style="flex: 1; min-width: 320px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem;">
                <span class="kpi-badge badge-cyan">ENTERPRISE EDITION v2.0</span>
                <span class="kpi-badge badge-emerald">MYSQL 8.0/9.5 COMPLIANT</span>
            </div>
            <h1 class="hero-title">
                BankSight: Transaction Intelligence Dashboard
            </h1>
            <p class="hero-subtitle">
                An industry-grade full-stack banking analytics platform built using Python, Streamlit, and MySQL. Delivering executive KPI monitoring, financial ledger simulation, and 15 verified relational analytical insights.
            </p>
        </div>
        <div style="background: #ffffff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 1.2rem; min-width: 260px; text-align: center; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);">
            <div style="font-size: 0.72rem; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.08em;">Real-Time Ledger Status</div>
            <div style="font-size: 1.25rem; font-weight: 800; color: #16a34a; margin: 0.3rem 0; display: flex; align-items: center; justify-content: center;">
                <span class="live-dot-success"></span> ACTIVE & AUDITED
            </div>
            <div style="font-size: 0.75rem; color: #475569;">7 Relational Datasets &bull; ACID Ledger Engine</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Quick CTA Navigation Buttons
c1, c2, c3, c4 = st.columns(4)
with c1:
    st.page_link("pages/1_Dashboard.py", label="📊 Launch Executive Dashboard", icon="🚀", use_container_width=True)
with c2:
    st.page_link("pages/5_Credit_Debit_Simulation.py", label="💰 Credit/Debit Simulator", icon="⚡", use_container_width=True)
with c3:
    st.page_link("pages/6_Analytical_Insights.py", label="💡 15 SQL Insights Engine", icon="🔍", use_container_width=True)
with c4:
    st.page_link("pages/4_CRUD_Operations.py", label="🛠 Manage Records (CRUD)", icon="📝", use_container_width=True)

st.markdown("<br>", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 2. EXECUTIVE METRICS PREVIEW
# -----------------------------------------------------------------------------
is_conn, _, _ = check_db_connection()
if is_conn:
    try:
        metrics_df = run_query("""
            SELECT 
                (SELECT COUNT(*) FROM customers) AS cust_cnt,
                (SELECT COUNT(*) FROM accounts) AS acc_cnt,
                (SELECT COUNT(*) FROM transactions) AS txn_cnt,
                (SELECT COALESCE(SUM(amount), 0) FROM transactions) AS txn_vol,
                (SELECT COUNT(*) FROM loans) AS loan_cnt,
                (SELECT COUNT(*) FROM credit_cards) AS card_cnt
        """)
        if not metrics_df.empty:
            m = metrics_df.iloc[0]
            st.markdown('<div class="content-card">', unsafe_allow_html=True)
            st.markdown("#### ⚡ Real-Time Ledger Summary")
            k1, k2, k3, k4, k5, k6 = st.columns(6)
            k1.metric("Customers", format_number(m["cust_cnt"]))
            k2.metric("Accounts", format_number(m["acc_cnt"]))
            k3.metric("Transactions", format_number(m["txn_cnt"]))
            k4.metric("Gross Volume", format_currency(m["txn_vol"]))
            k5.metric("Loans", format_number(m["loan_cnt"]))
            k6.metric("Credit Cards", format_number(m["card_cnt"]))
            st.markdown('</div>', unsafe_allow_html=True)
    except Exception:
        pass

# -----------------------------------------------------------------------------
# 3. PROJECT OVERVIEW & OBJECTIVES
# -----------------------------------------------------------------------------
ov_col1, ov_col2 = st.columns(2)

with ov_col1:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    st.subheader("📌 Project Overview & Problem Statement")
    st.markdown("""
    Commercial banks face massive complexities analyzing customer behavior, mitigating transaction fraud, balancing liquidity across branch networks, and maintaining regulatory compliance.

    **BankSight** solves this by unifying disparate banking entities — customer KYC, core deposit accounts, transaction throughput, lending portfolios, credit card debts, branch operations, and customer support tickets — into a coherent, high-velocity intelligence hub.
    
    Built strictly on live MySQL relational datasets without synthetic placeholders, BankSight empowers risk officers and branch managers with actionable business visibility.
    """)
    st.markdown('</div>', unsafe_allow_html=True)

with ov_col2:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    st.subheader("🎯 Core Objectives")
    st.markdown("""
    - **Single Source of Truth:** Unify 7 relational banking tables with zero schema errors or column mismatches.
    - **ACID Transaction Simulator:** Demonstrate real-world banking ledger consistency with row locks (`SELECT FOR UPDATE`) and dual-table commits.
    - **15 Verified SQL Queries:** Execute advanced aggregation, DATEDIFF resolution tracking, and rule-based fraud pattern detection.
    - **Enterprise CRUD Workflows:** Implement full Create, Read, Update, and Delete operations with strict foreign-key protection.
    - **Executive UI/UX:** Deliver a modern dark navy design system with high-contrast accessibility and Plotly visualizations.
    """)
    st.markdown('</div>', unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 4. CORE FEATURES SHOWCASE
# -----------------------------------------------------------------------------
st.markdown("### 🚀 Platform Capabilities & Modules")

f1, f2, f3 = st.columns(3)
with f1:
    st.markdown("""
    <div class="kpi-card" style="height: 220px;">
        <div style="font-size: 1.8rem; margin-bottom: 0.3rem;">📊</div>
        <div style="font-weight: 700; color: #0f172a; font-size: 1.1rem;">1. Executive Dashboard</div>
        <p style="color: #475569; font-size: 0.82rem; margin-top: 0.4rem; line-height: 1.4;">
            8 dynamic KPI cards, interactive date sliders, cash flow donut charts, loan exposure distributions, and real-time failure alerts.
        </p>
        <span class="kpi-badge badge-blue">Real-time Analytics</span>
    </div>
    """, unsafe_allow_html=True)

with f2:
    st.markdown("""
    <div class="kpi-card" style="height: 220px;">
        <div style="font-size: 1.8rem; margin-bottom: 0.3rem;">💰</div>
        <div style="font-weight: 700; color: #0f172a; font-size: 1.1rem;">2. Ledger Simulator</div>
        <p style="color: #475569; font-size: 0.82rem; margin-top: 0.4rem; line-height: 1.4;">
            Simulate deposits & withdrawals with atomic ACID compliance. Row-level locks, overdraft prevention, and live audit generation.
        </p>
        <span class="kpi-badge badge-emerald">ACID Compliant</span>
    </div>
    """, unsafe_allow_html=True)

with f3:
    st.markdown("""
    <div class="kpi-card" style="height: 220px;">
        <div style="font-size: 1.8rem; margin-bottom: 0.3rem;">💡</div>
        <div style="font-weight: 700; color: #0f172a; font-size: 1.1rem;">3. 15 SQL Insights</div>
        <p style="color: #475569; font-size: 0.82rem; margin-top: 0.4rem; line-height: 1.4;">
            15 industry-standard queries: top customers, credit vs debit, loan risk, support SLAs, and rule-based fraud detection.
        </p>
        <span class="kpi-badge badge-purple">100% Schema Tested</span>
    </div>
    """, unsafe_allow_html=True)

f4, f5, f6 = st.columns(3)
with f4:
    st.markdown("""
    <div class="kpi-card" style="height: 220px;">
        <div style="font-size: 1.8rem; margin-bottom: 0.3rem;">📄</div>
        <div style="font-weight: 700; color: #0f172a; font-size: 1.1rem;">4. Table Explorer</div>
        <p style="color: #475569; font-size: 0.82rem; margin-top: 0.4rem; line-height: 1.4;">
            Search, sort, and paginate across all 7 database tables with real-time schema column definitions and CSV export.
        </p>
        <span class="kpi-badge badge-blue">Full Schema Inspection</span>
    </div>
    """, unsafe_allow_html=True)

with f5:
    st.markdown("""
    <div class="kpi-card" style="height: 220px;">
        <div style="font-size: 1.8rem; margin-bottom: 0.3rem;">🔍</div>
        <div style="font-weight: 700; color: #0f172a; font-size: 1.1rem;">5. Multi-Filter Engine</div>
        <p style="color: #475569; font-size: 0.82rem; margin-top: 0.4rem; line-height: 1.4;">
            Slice banking datasets by numeric ranges, categorical tags, and regex strings with dynamic summary metrics.
        </p>
        <span class="kpi-badge badge-emerald">Interactive Slicing</span>
    </div>
    """, unsafe_allow_html=True)

with f6:
    st.markdown("""
    <div class="kpi-card" style="height: 220px;">
        <div style="font-size: 1.8rem; margin-bottom: 0.3rem;">🛠</div>
        <div style="font-weight: 700; color: #0f172a; font-size: 1.1rem;">6. Enterprise CRUD</div>
        <p style="color: #475569; font-size: 0.82rem; margin-top: 0.4rem; line-height: 1.4;">
            Forms for Customer, Account, Branch, and Support Ticket lifecycle management with foreign-key constraint enforcement.
        </p>
        <span class="kpi-badge badge-purple">FK Safe & Parameterized</span>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 5. TECHNOLOGY STACK & CREATOR
# -----------------------------------------------------------------------------
tech_col, author_col = st.columns([1.3, 1])

with tech_col:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    st.subheader("🛠 Technology Architecture")
    st.markdown("""
    | Layer | Technology | Key Responsibility |
    |---|---|---|
    | **Frontend** | Streamlit + Modern White & Blue CSS | Executive UI, responsive layout, real-time indicators |
    | **Visuals** | Plotly Express & Graph Objects | Dual-axis trend charts, donut charts, exposure histograms |
    | **Backend** | Python 3.10+ | Business validation, transaction orchestration, safety wrappers |
    | **Database** | MySQL 8.0/9.5 (InnoDB) | Relational storage, ACID commits, foreign key constraints |
    | **Config** | `python-dotenv` & `st.secrets` | Zero credential leakage, deployment parity |
    """)
    st.markdown('</div>', unsafe_allow_html=True)

with author_col:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    st.subheader("👩‍💻 About the Creator")
    st.markdown("""
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.8rem;">
        <div style="font-size: 2.5rem;">👩‍💻</div>
        <div>
            <h4 style="margin: 0; color: #0f172a;">Priya Sharma</h4>
            <div style="color: #2563eb; font-size: 0.82rem; font-weight: 700;">Full-Stack Developer & Data Analyst</div>
        </div>
    </div>
    <p style="color: #475569; font-size: 0.85rem; line-height: 1.5; margin: 0;">
        BankSight was engineered as a flagship live project demonstrating production-quality SQL, full-stack architecture, and financial ledger safety for portfolio and interview evaluations.
    </p>
    <div style="margin-top: 0.8rem;">
        <span class="kpi-badge badge-blue">Python</span>
        <span class="kpi-badge badge-emerald">MySQL</span>
        <span class="kpi-badge badge-purple">Streamlit</span>
        <span class="kpi-badge badge-blue">Plotly</span>
    </div>
    """, unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)