"""
BankSight KPI Cards Component
Renders responsive, glassmorphic metric cards tailored for banking executives.
"""

import streamlit as st
from helpers import format_currency, format_number

def render_kpi_card(title: str, value: str, badge_text: str = None, badge_type: str = "cyan", icon: str = "📊", subtext: str = None):
    """
    Renders an individual KPI card with white background, blue accent, and real-time pulse dots.
    badge_type options: 'cyan', 'emerald', 'rose', 'purple'
    """
    live_dot = ""
    if badge_type in ["emerald", "green"]:
        live_dot = '<span class="live-dot-success"></span>'
    elif badge_type in ["rose", "red"]:
        live_dot = '<span class="live-dot-stop"></span>'

    badge_html = f'<span class="kpi-badge badge-{badge_type}">{live_dot}{badge_text}</span>' if badge_text else ''
    subtext_html = f'<div style="font-size: 0.72rem; color: #64748b; margin-top: 0.35rem; font-weight: 500;">{subtext}</div>' if subtext else ''

    html = f"""
    <div class="kpi-card">
        <div class="kpi-title">
            <span>{icon}</span> {title}
        </div>
        <div class="kpi-value">{value}</div>
        <div>{badge_html}</div>
        {subtext_html}
    </div>
    """
    st.markdown(html, unsafe_allow_html=True)

def render_overview_kpis(metrics: dict):
    """
    Renders the 8 mandatory KPI cards in an organized 4x2 executive layout.
    """
    row1_c1, row1_c2, row1_c3, row1_c4 = st.columns(4)
    with row1_c1:
        render_kpi_card(
            title="Total Customers",
            value=format_number(metrics.get("total_customers", 0)),
            badge_text="Verified KYC",
            badge_type="cyan",
            icon="👥",
            subtext="Primary client ledger base"
        )
    with row1_c2:
        render_kpi_card(
            title="Total Accounts",
            value=format_number(metrics.get("total_accounts", 0)),
            badge_text="Deposit Accounts",
            badge_type="emerald",
            icon="🏦",
            subtext="Savings & Current accounts"
        )
    with row1_c3:
        render_kpi_card(
            title="Total Transactions",
            value=format_number(metrics.get("total_transactions", 0)),
            badge_text="Processed",
            badge_type="purple",
            icon="⚡",
            subtext="Throughput audit count"
        )
    with row1_c4:
        render_kpi_card(
            title="Total Txn Volume",
            value=format_currency(metrics.get("total_txn_amount", 0)),
            badge_text="Gross Inflows/Outflows",
            badge_type="cyan",
            icon="💰",
            subtext="Aggregated ledger turnover"
        )

    row2_c1, row2_c2, row2_c3, row2_c4 = st.columns(4)
    with row2_c1:
        render_kpi_card(
            title="Total Loans",
            value=format_number(metrics.get("total_loans", 0)),
            badge_text="Credit Facilities",
            badge_type="emerald",
            icon="📑",
            subtext="Active, closed & approved loans"
        )
    with row2_c2:
        render_kpi_card(
            title="Total Credit Cards",
            value=format_number(metrics.get("total_credit_cards", 0)),
            badge_text="Issued Cards",
            badge_type="purple",
            icon="💳",
            subtext="Visa, RuPay, Amex, MC"
        )
    with row2_c3:
        failed_cnt = metrics.get("failed_transactions", 0)
        total_txns = max(metrics.get("total_transactions", 1), 1)
        fail_pct = (failed_cnt / total_txns) * 100
        render_kpi_card(
            title="Failed Transactions",
            value=format_number(failed_cnt),
            badge_text=f"{fail_pct:.1f}% Failure Rate",
            badge_type="rose",
            icon="⚠️",
            subtext="Blocked, fraud & debit failures"
        )
    with row2_c4:
        render_kpi_card(
            title="Support Tickets",
            value=format_number(metrics.get("total_support_tickets", 0)),
            badge_text="CRM Inquiries",
            badge_type="cyan",
            icon="🎫",
            subtext="Customer inquiries logged"
        )
