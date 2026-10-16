"""
BankSight Helper Utilities
Provides query execution, table loading, formatters, and design styling.
"""

import streamlit as st
import pandas as pd
from db import get_connection

ALLOWED_TABLES = {
    "customers",
    "accounts",
    "transactions",
    "loans",
    "credit_cards",
    "branches",
    "support_tickets"
}

def run_query(sql: str, params=None) -> pd.DataFrame:
    """
    Safely executes an SQL query using parameterized execution and returns a Pandas DataFrame.
    """
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor(dictionary=True)
        if params:
            cur.execute(sql, params)
        else:
            cur.execute(sql)
        rows = cur.fetchall()
        df = pd.DataFrame(rows)
        return df
    except Exception as e:
        st.error(f"SQL Execution Error: {e}")
        return pd.DataFrame()
    finally:
        if cur:
            try:
                cur.close()
            except Exception:
                pass
        if conn:
            try:
                conn.close()
            except Exception:
                pass

def load_table(table: str, limit: int = None, offset: int = None) -> pd.DataFrame:
    """
    Safely loads a full table or paginated slice from the allowed tables whitelist.
    """
    if table.lower() not in ALLOWED_TABLES:
        raise ValueError(f"Table '{table}' is not in the allowed tables list.")

    sql = f"SELECT * FROM `{table.lower()}`"
    if limit is not None:
        if offset is not None:
            sql += f" LIMIT {int(offset)}, {int(limit)}"
        else:
            sql += f" LIMIT {int(limit)}"

    return run_query(sql)

def get_table_count(table: str) -> int:
    """Returns the total row count of an allowed table."""
    if table.lower() not in ALLOWED_TABLES:
        return 0
    df = run_query(f"SELECT COUNT(*) AS total FROM `{table.lower()}`")
    if not df.empty and "total" in df.columns:
        return int(df["total"].iloc[0])
    return 0

def format_currency(value, symbol="₹") -> str:
    """
    Formats monetary values in human-readable Indian format / abbreviations.
    """
    if value is None or pd.isna(value):
        return f"{symbol}0.00"
    try:
        num = float(value)
        abs_num = abs(num)
        sign = "-" if num < 0 else ""
        if abs_num >= 10000000:
            return f"{sign}{symbol}{abs_num / 10000000:.2f} Cr"
        elif abs_num >= 100000:
            return f"{sign}{symbol}{abs_num / 100000:.2f} L"
        elif abs_num >= 1000:
            return f"{sign}{symbol}{abs_num:,.2f}"
        else:
            return f"{sign}{symbol}{abs_num:.2f}"
    except (ValueError, TypeError):
        return str(value)

def format_number(value) -> str:
    """Formats integers with thousands separators."""
    if value is None or pd.isna(value):
        return "0"
    try:
        return f"{int(value):,}"
    except (ValueError, TypeError):
        return str(value)

def inject_custom_css():
    """
    Injects custom CSS for BankSight's modern white and blue financial theme,
    featuring real-time indicators, green for success, and red for stop/declined states.
    """
    st.markdown("""
    <style>
    /* Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        color: #0f172a;
    }

    /* Main Container Background */
    .stApp {
        background-color: #f8fafc;
    }

    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 3.5rem;
        max-width: 95%;
    }

    /* Sidebar Styling (Clean Soft Slate Blue) */
    section[data-testid="stSidebar"] {
        background-color: #f0f4f9;
        border-right: 1px solid #e2e8f0;
    }
    section[data-testid="stSidebar"] * {
        color: #1e293b;
    }

    /* Real-Time Pulse Animation */
    @keyframes pulse-live {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
        70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(22, 163, 74, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
    }
    @keyframes pulse-stop {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
        70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(220, 38, 38, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
    }

    .live-dot-success {
        display: inline-block;
        width: 10px;
        height: 10px;
        background-color: #16a34a;
        border-radius: 50%;
        animation: pulse-live 2s infinite;
        vertical-align: middle;
        margin-right: 6px;
    }
    .live-dot-stop {
        display: inline-block;
        width: 10px;
        height: 10px;
        background-color: #dc2626;
        border-radius: 50%;
        animation: pulse-stop 2s infinite;
        vertical-align: middle;
        margin-right: 6px;
    }

    /* KPI Metric Cards (Crisp White with Royal Blue Accent) */
    .kpi-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-top: 3px solid #2563eb;
        border-radius: 12px;
        padding: 1.25rem 1.1rem;
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        margin-bottom: 0.75rem;
    }
    .kpi-card:hover {
        transform: translateY(-2px);
        border-color: #93c5fd;
        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.12);
    }
    .kpi-title {
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #64748b;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        margin-bottom: 0.35rem;
    }
    .kpi-value {
        font-size: 1.7rem;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.02em;
        line-height: 1.2;
    }

    /* Status Badges: Green for Success, Red for Stop/Alert, Blue for Info */
    .kpi-badge {
        display: inline-block;
        padding: 0.22rem 0.65rem;
        border-radius: 9999px;
        font-size: 0.72rem;
        font-weight: 700;
        margin-top: 0.4rem;
        letter-spacing: 0.02em;
    }
    .badge-cyan, .badge-blue {
        background: #eff6ff;
        color: #1d4ed8;
        border: 1px solid #bfdbfe;
    }
    .badge-emerald, .badge-green, .badge-success {
        background: #f0fdf4;
        color: #15803d;
        border: 1px solid #86efac;
    }
    .badge-rose, .badge-red, .badge-stop {
        background: #fef2f2;
        color: #b91c1c;
        border: 1px solid #fca5a5;
    }
    .badge-purple {
        background: #f5f3ff;
        color: #6d28d9;
        border: 1px solid #ddd6fe;
    }

    /* Hero Section (Vibrant Banking Blue Gradient on White) */
    .hero-banner {
        background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%);
        border: 1px solid #bfdbfe;
        border-radius: 16px;
        padding: 2.2rem 2.4rem;
        margin-bottom: 1.8rem;
        box-shadow: 0 10px 25px rgba(29, 78, 216, 0.18);
        color: #ffffff;
    }
    .hero-title {
        font-size: 2.3rem;
        font-weight: 800;
        color: #ffffff;
        margin-bottom: 0.4rem;
        letter-spacing: -0.02em;
    }
    .hero-subtitle {
        color: #e0e7ff;
        font-size: 1.05rem;
        line-height: 1.55;
        max-width: 880px;
    }

    /* Section Cards (Pure White with Light Slate Borders) */
    .content-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    }

    /* Real-Time Alert Panels */
    .realtime-success-card {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        border-left: 5px solid #16a34a;
        border-radius: 10px;
        padding: 1rem 1.2rem;
        margin: 1rem 0;
    }
    .realtime-stop-card {
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-left: 5px solid #dc2626;
        border-radius: 10px;
        padding: 1rem 1.2rem;
        margin: 1rem 0;
    }

    /* Code & Query Display */
    pre, code {
        font-family: 'JetBrains Mono', monospace !important;
        background-color: #f1f5f9 !important;
        color: #0f172a !important;
    }

    /* Primary and Action Buttons */
    .stButton>button {
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.2s ease;
    }
    button[kind="primary"] {
        background-color: #2563eb !important;
        color: #ffffff !important;
        border: 1px solid #1d4ed8 !important;
    }
    button[kind="primary"]:hover {
        background-color: #1d4ed8 !important;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25) !important;
    }

    /* Tabs Styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 0.5rem;
        border-bottom: 2px solid #e2e8f0;
    }
    .stTabs [data-baseweb="tab"] {
        font-weight: 600;
        color: #64748b;
        padding: 0.6rem 1rem;
    }
    .stTabs [aria-selected="true"] {
        color: #2563eb !important;
        border-bottom-color: #2563eb !important;
    }
    </style>
    """, unsafe_allow_html=True)