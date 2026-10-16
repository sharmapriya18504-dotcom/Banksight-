"""
BankSight Sidebar Component
Renders branded navigation header, real-time database health badge, and quick stats.
"""

import streamlit as st
from db import check_db_connection
from helpers import run_query, format_number

def render_sidebar():
    """
    Renders the unified enterprise sidebar across all BankSight pages.
    """
    with st.sidebar:
        # Branding Header
        st.markdown("""
        <div style="text-align: center; padding: 0.8rem 0 1.2rem 0; border-bottom: 1px solid #e2e8f0;">
            <div style="font-size: 2.2rem; margin-bottom: 0.2rem;">🏦</div>
            <div style="font-size: 1.45rem; font-weight: 800; color: #1e3a8a; letter-spacing: -0.02em;">
                BankSight
            </div>
            <div style="font-size: 0.72rem; color: #2563eb; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; margin-top: 0.15rem;">
                Transaction Intelligence
            </div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)

        # Database Health Monitor Widget (Green Success vs Red Stop)
        is_conn, msg, diag = check_db_connection()
        if is_conn:
            st.markdown(f"""
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 0.75rem 0.85rem; margin-bottom: 1.2rem; box-shadow: 0 1px 3px rgba(22, 163, 74, 0.08);">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center;">
                        <span class="live-dot-success"></span>
                        <span style="font-size: 0.75rem; font-weight: 800; color: #15803d; letter-spacing: 0.04em;">LIVE MYSQL AUDIT</span>
                    </div>
                    <span style="font-size: 0.7rem; color: #16a34a; font-family: monospace; font-weight: 700;">v{diag.get('version', '').split('-')[0]}</span>
                </div>
                <div style="font-size: 0.72rem; color: #166534; margin-top: 0.35rem;">
                    Database: <code style="color: #1e3a8a; background: #e0f2fe; padding: 1px 4px; border-radius: 4px; font-size: 0.72rem;">{diag.get('database')}</code> &bull; Port: <code style="padding: 1px 4px; border-radius: 4px; font-size: 0.72rem;">{diag.get('config', {}).get('port')}</code>
                </div>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 0.75rem 0.85rem; margin-bottom: 1.2rem; box-shadow: 0 1px 3px rgba(220, 38, 38, 0.08);">
                <div style="display: flex; align-items: center;">
                    <span class="live-dot-stop"></span>
                    <span style="font-size: 0.75rem; font-weight: 800; color: #b91c1c;">⛔ DATABASE STOPPED / OFFLINE</span>
                </div>
                <div style="font-size: 0.72rem; color: #991b1b; margin-top: 0.35rem;">
                    Verify local MySQL server or check <code>.env</code> settings.
                </div>
            </div>
            """, unsafe_allow_html=True)

        # Quick System Stats (if DB available)
        if is_conn:
            try:
                stats_df = run_query("""
                    SELECT 
                        (SELECT COUNT(*) FROM customers) AS cust_cnt,
                        (SELECT COUNT(*) FROM transactions) AS txn_cnt
                """)
                if not stats_df.empty:
                    c_cnt = stats_df['cust_cnt'].iloc[0]
                    t_cnt = stats_df['txn_cnt'].iloc[0]
                    st.markdown(f"""
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: 3px solid #2563eb; border-radius: 10px; padding: 0.8rem; margin-bottom: 1.2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <div style="font-size: 0.7rem; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 0.4rem; letter-spacing: 0.04em;">Real-Time Ledger Volume</div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: #334155; margin-bottom: 0.3rem;">
                            <span>Active Customers:</span>
                            <strong style="color: #2563eb;">{format_number(c_cnt)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: #334155;">
                            <span>Processed Txns:</span>
                            <strong style="color: #2563eb;">{format_number(t_cnt)}</strong>
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
            except Exception:
                pass

        # Navigation Guide
        st.markdown("""
        <div style="font-size: 0.75rem; color: #1e40af; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem;">
            Quick Navigation
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        - 🏠 [Home (Welcome Page)](/)
        - 📊 [1. Dashboard (Overview & KPIs)](/Dashboard)
        - 📄 [2. View Tables (All 7 Datasets)](/View_Tables)
        - 🔍 [3. Search & Filter (Multi-Column)](/Filter_Data)
        - 🛠 [4. Customer Management (CRUD)](/CRUD_Operations)
        - 💰 [5. Money Transfer Sim (Deposit/Withdraw)](/Credit_Debit_Simulation)
        - 💡 [6. 15 Bank Questions (SQL Insights)](/Analytical_Insights)
        - 👩‍💻 [7. About Project & Viva Guide](/About_Project)
        """, unsafe_allow_html=True)

        st.markdown("<br><hr style='border: none; border-top: 1px solid #e2e8f0; margin: 1rem 0;'>", unsafe_allow_html=True)

        # Developer Footer
        st.markdown("""
        <div style="text-align: center; font-size: 0.72rem; color: #64748b; line-height: 1.4;">
            <div>Developed by <strong style="color: #0f172a;">Priya Sharma</strong></div>
            <div style="margin-top: 0.2rem; color: #2563eb; font-weight: 700;">BankSight Project v2.0</div>
            <div style="color: #64748b; font-size: 0.68rem; margin-top: 0.1rem;">B.Tech Major Project Edition</div>
        </div>
        """, unsafe_allow_html=True)
