"""
BankSight - About the Project & Creator Portfolio
Page 7: System architecture, schema documentation, engineering highlights & evaluation talking points.
"""

import streamlit as st
from helpers import inject_custom_css
from components.sidebar import render_sidebar

st.set_page_config(
    page_title="About Project | BankSight",
    page_icon="👩‍💻",
    layout="wide"
)

inject_custom_css()
render_sidebar()

# Hero Header
st.markdown("""
<div class="hero-banner">
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.4rem;">
                Academic Live Project & Portfolio Demonstration
            </div>
            <h1 class="hero-title">
                BankSight: Transaction Intelligence Dashboard
            </h1>
            <p class="hero-subtitle">
                An industry-grade full-stack banking analytics platform built using Python, Streamlit, and MySQL, designed to deliver executive transaction intelligence, financial ledger simulation, and multi-dimensional credit risk surveillance.
            </p>
        </div>
        <div style="text-align: right;">
            <span class="kpi-badge badge-emerald" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">
                PRODUCTION READY v2.0
            </span>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Tabs
tab_overview, tab_schema, tab_eng, tab_viva, tab_author = st.tabs([
    "📌 Project Objectives & Tech Stack",
    "🗄 Database Schema & Architecture",
    "⚙️ Engineering Highlights & Fixes",
    "🎓 Viva Exam Prep & Talking Points",
    "👩‍💻 About the Creator"
])

# ==============================================================================
# TAB 1: OBJECTIVES & TECH STACK
# ==============================================================================
with tab_overview:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    st.subheader("🎯 Core Project Objectives")
    st.markdown("""
    Modern retail banking institutions process tens of thousands of transactions daily across branch networks, digital payments, card transactions, and loan portfolios. BankSight was architected to bridge the gap between raw relational transactional data and executive decision-making.

    - **Executive Portfolio Visibility:** Deliver 8 core KPIs tracking gross throughput, liquid deposit reserves, lending exposure, credit card utilization, and failure ratios in real time.
    - **15 Verified Industry SQL Insights:** Formulate and execute complex relational analytical queries covering customer lifetime value, SLA turnaround times, branch profitability, and suspicious fraud velocity.
    - **ACID-Compliant Ledger Simulation:** Implement a genuine banking ledger simulation that performs atomic row locking (`SELECT FOR UPDATE`), balance debit verification, and dual-table commits with automatic rollback on failure.
    - **Enterprise Data Management (CRUD):** Provide full Create, Read, Update, and Delete operations that strictly respect Foreign Key relational integrity.
    - **Modular Clean Architecture:** Transition from a monolithic script into a clean, testable, multi-page software architecture separating database access, business rules, reusable UI components, and test suites.
    """)
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    st.subheader("🛠 Technology Stack")

    t1, t2, t3, t4 = st.columns(4)
    with t1:
        st.markdown("""
        **Frontend & UI**
        - **Streamlit (v1.63+)**
        - Custom CSS3 Design System
        - Google Fonts: *Plus Jakarta Sans*
        - Responsive Glassmorphic Cards
        """)
    with t2:
        st.markdown("""
        **Backend & Logic**
        - **Python 3.10+**
        - `mysql-connector-python`
        - ACID Transaction Engine
        - Parameterized SQL Execution
        """)
    with t3:
        st.markdown("""
        **Database & Storage**
        - **MySQL 8.0 / 9.5 (InnoDB)**
        - Relational Integrity & Keys
        - Environment Config via `.env`
        - Streamlit Secrets Ready
        """)
    with t4:
        st.markdown("""
        **Analytics & Viz**
        - **Plotly Express & Graph Objects**
        - **Pandas 2.0+**
        - Custom Dark Navy Colorway
        - Dynamic SQL Latency Profiling
        """)
    st.markdown('</div>', unsafe_allow_html=True)

# ==============================================================================
# TAB 2: SCHEMA & ARCHITECTURE
# ==============================================================================
with tab_schema:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    st.subheader("🗄 Verified Relational Schema")
    st.markdown("""
    The database contains **7 core entities** reflecting actual banking source systems:
    """)

    st.markdown("""
    ```mermaid
    erDiagram
        customers ||--o{ accounts : "holds deposit"
        customers ||--o{ transactions : "executes"
        customers ||--o{ support_tickets : "files"
        branches ||--o{ loans : "underwrites"
        branches ||--o{ credit_cards : "issues"
        branches ||--o{ support_tickets : "resolves"

        customers {
            varchar customer_id PK
            varchar name
            varchar gender
            int age
            varchar city
            varchar account_type
            date join_date
        }

        accounts {
            varchar customer_id FK
            decimal account_balance
            datetime last_updated
        }

        transactions {
            varchar txn_id PK
            varchar customer_id FK
            varchar txn_type
            decimal amount
            datetime txn_time
            varchar status
        }

        loans {
            int Loan_ID PK
            int Customer_ID
            int Account_ID
            text Branch
            text Loan_Type
            int Loan_Amount
            double Interest_Rate
            int Loan_Term_Months
            text Loan_Status
        }

        credit_cards {
            int Card_ID PK
            int Customer_ID
            text Branch
            bigint Card_Number
            text Card_Type
            text Card_Network
            int Credit_Limit
            double Current_Balance
            text Status
        }

        branches {
            int branch_id PK
            varchar branch_name
            varchar city
            varchar manager_name
            int total_employees
            decimal branch_revenue
            int performance_rating
        }

        support_tickets {
            text Ticket_ID PK
            text Customer_ID
            text Branch_Name
            text Issue_Category
            text Priority
            text Status
            text Support_Agent
            int Customer_Rating
        }
    ```
    """)
    st.markdown('</div>', unsafe_allow_html=True)

# ==============================================================================
# TAB 3: ENGINEERING HIGHLIGHTS & FIXES
# ==============================================================================
with tab_eng:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    st.subheader("⚙️ Critical Schema & Query Fixes Resolved")
    st.markdown("""
    During architectural inspection, key discrepancies in legacy queries were identified and repaired to align with the actual MySQL database schema:

    1. **Unknown Column `account_id` in `accounts`:**
       - *Original Bug:* Queries attempted `SELECT account_id FROM accounts` or `JOIN ... ON a.account_id`.
       - *Root Cause:* In the Core Banking ledger table `accounts`, the primary relationship key is `customer_id` (497 active accounts, each linked to a distinct `customer_id`).
       - *Resolution:* All queries and simulation scripts updated to reference `a.customer_id`.

    2. **Unknown Column `branch_id` / `branch` in `transactions`:**
       - *Original Bug:* Legacy queries tried `JOIN branches b ON t.branch_id = b.branch_id` or `SELECT t.branch`.
       - *Root Cause:* The `transactions` table contains `txn_id`, `customer_id`, `txn_type`, `amount`, `txn_time`, `status`, but no raw branch foreign key.
       - *Resolution:* Branch-level transaction activity is now accurately mapped by joining resident customer locations (`customers.city`) with the local branch network (`branches.city`).

    3. **Loan Table Column Casing (`Branch`, `Loan_Status`, `Loan_Amount`):**
       - *Original Bug:* Queries attempted `JOIN branches b ON l.Branch_id = b.branch_id`.
       - *Root Cause:* The `loans` table records `Branch` containing the full branch name (e.g., `'Perez Ltd Branch'`).
       - *Resolution:* Upgraded to join `branches.branch_name = loans.Branch`, yielding 100% verified matches without schema exceptions.

    4. **ACID Ledger Atomicity in Simulation:**
       - *Original Bug:* Previous simulation only updated account balance directly without locking rows or creating transaction audit records.
       - *Resolution:* Upgraded to row-level locking (`SELECT FOR UPDATE`), pre-validation of funds, and dual-table atomic commits with automatic rollback on failure.

    5. **Hardcoded Credentials & Environment Separation:**
       - *Original Bug:* Database password was previously committed in plaintext in `db.py`.
       - *Resolution:* Migrated to `python-dotenv` reading from `.env`, added `.env` to `.gitignore`, provided `.env.example`, and integrated `st.secrets` fallback for Streamlit Community Cloud.
    """)
    st.markdown('</div>', unsafe_allow_html=True)

# ==============================================================================
# TAB 4: VIVA EXAM PREPARATION & TALKING POINTS
# ==============================================================================
with tab_viva:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    st.subheader("🎓 B.Tech CSE Viva Examination Talking Points")
    st.markdown("""
    Use these structured technical answers during your major project evaluation and oral viva examination:
    """)

    viva_col1, viva_col2 = st.columns(2)

    with viva_col1:
        with st.expander("1. How does BankSight ensure ACID Transaction compliance?", expanded=True):
            st.markdown("""
            - **Atomicity:** Credit/Debit operations update the `accounts` ledger and insert an audit row into `transactions` in a single database transaction block. If either statement fails, `conn.rollback()` restores the pre-transaction state.
            - **Consistency:** Enforces foreign-key constraints and exact numeric storage (`DECIMAL(15,2)`) to eliminate floating-point rounding anomalies.
            - **Isolation:** Implements row-level locking via `SELECT ... FOR UPDATE` on MySQL InnoDB. Simultaneous debits on the same account are serialized, eliminating race conditions and lost updates.
            - **Durability:** Committed transactions are flushed to the InnoDB Write-Ahead Log (WAL / redo log) and survive hardware or application crashes.
            """)

        with st.expander("2. How is the regulatory ₹1,000 Minimum Balance rule enforced?"):
            st.markdown("""
            - In `simulate.py` and the backend controller, every withdrawal evaluates:  
              $$\\text{Projected Balance} = \\text{Current Balance} - \\text{Withdrawal Amount} \\ge 1000.00$$
            - If this rule is breached, the transaction is **aborted immediately** without debiting funds, returning an informative refusal message.
            """)

        with st.expander("3. Why did you choose MySQL InnoDB over SQLite or MongoDB?"):
            st.markdown("""
            - **InnoDB Engine:** Supports true row-level locks, multi-version concurrency control (MVCC), and strict foreign keys.
            - **Relational Integrity:** Banking ledgers are inherently relational (customers $\\rightarrow$ accounts $\\rightarrow$ transactions). Relational normal form (3NF) prevents update anomalies that document stores struggle with.
            """)

    with viva_col2:
        with st.expander("4. How do you prevent SQL Injection attacks?"):
            st.markdown("""
            - We exclusively use **parameterized prepared statements** with placeholder parameters (`%s` in Python, `?` in Node.js).
            - The SQL engine compiles the query template before injecting user parameters, guaranteeing that malicious inputs (e.g. `' OR '1'='1`) are treated as literal text values and never executed as code.
            """)

        with st.expander("5. What is the difference between WHERE and HAVING in your SQL queries?"):
            st.markdown("""
            - `WHERE` filters individual rows **before** aggregation (e.g., `WHERE status = 'failed'`).
            - `HAVING` filters aggregated groups **after** the `GROUP BY` operation (e.g., in Query 8: `HAVING high_value_txn_count >= 5`).
            """)

        with st.expander("6. How is the dual-stack architecture structured?"):
            st.markdown("""
            - **Streamlit (Data Science Focus):** Direct Python connection, transparent SQL query inspection, execution latency tracking, and rich Plotly visualizations for academic evaluation.
            - **React + Express (Full-Stack Showcase):** Decoupled Single-Page Application (SPA), bcrypt hashed authentication, JWT tokens, and RESTful API endpoints for production deployment.
            """)

    st.info("💡 A complete, in-depth **25-Question Viva Preparation Manual** is available in the repository at `docs/VIVA_PREPARATION_GUIDE.md`.")
    st.markdown('</div>', unsafe_allow_html=True)

# ==============================================================================
# TAB 5: ABOUT THE CREATOR
# ==============================================================================
with tab_author:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    col_a1, col_a2 = st.columns([1, 2])
    with col_a1:
        st.markdown("""
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); border: 1.5px solid #bfdbfe; border-radius: 14px; padding: 1.5rem; text-align: center; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.06);">
            <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">👩‍💻</div>
            <h3 style="margin: 0; color: #0f172a; font-weight: 800;">Priya Sharma</h3>
            <div style="color: #1d4ed8; font-size: 0.88rem; font-weight: 700; margin-top: 0.2rem;">Full-Stack Developer & Data Analyst</div>
            <div style="color: #64748b; font-size: 0.78rem; margin-top: 0.5rem;">Specialization: Python, SQL & Financial Data Systems</div>
            <div style="margin-top: 0.8rem;">
                <span class="live-dot-success"></span>
                <span class="kpi-badge badge-green" style="font-size: 0.72rem;">ACTIVE PORTFOLIO PROJECT</span>
            </div>
        </div>
        """, unsafe_allow_html=True)

    with col_a2:
        st.markdown("""
        ### Professional Profile
        Priya Sharma is an aspiring software engineer and data analyst passionate about building scalable, data-driven financial technologies.

        - **Technical Expertise:** Python, MySQL, Relational Database Design, Pandas, Streamlit, Plotly, ACID Transaction Architecture, Git Version Control.
        - **Project Vision:** BankSight was developed as an end-to-end college live project and technical portfolio flagship demonstrating industry-standard analytics, transparent SQL engineering, and resilient UX design.
        - **GitHub:** [github.com/sharmapriya18504-dotcom/Banksight](https://github.com/sharmapriya18504-dotcom/Banksight)
        - **Evaluation Readiness:** Fully prepared with 12-minute project walkthrough covering system architecture, live ACID ledger simulation, and complex analytical SQL queries.
        """)
    st.markdown('</div>', unsafe_allow_html=True)
