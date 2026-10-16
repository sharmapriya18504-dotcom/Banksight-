"""
BankSight - Financial Ledger Simulation
Page 5: Atomic Credit/Debit banking operations with ACID compliance, validation, and transaction logs.
"""

import streamlit as st
import pandas as pd
from helpers import inject_custom_css, format_currency
from components.sidebar import render_sidebar
import simulate

st.set_page_config(
    page_title="Ledger Simulation | BankSight",
    page_icon="💰",
    layout="wide"
)

inject_custom_css()
render_sidebar()

# Disclaimer Header
st.markdown("""
<div style="background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 1.2rem; margin-bottom: 1rem; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.05);">
    <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                <span class="live-dot-success"></span>
                <span class="kpi-badge badge-blue" style="font-size: 0.75rem;">LIVE BANK SIMULATOR</span>
            </div>
            <h2 style="font-size: 1.5rem; font-weight: 800; margin: 0.2rem 0; color: #0f172a;">
                Money Transfer Simulator (Deposit & Withdraw)
            </h2>
            <p style="color: #475569; font-size: 0.88rem; margin: 0;">
                Test live money transactions. Balance updates in real time with an automatic minimum ₹1,000 balance safety check.
            </p>
        </div>
        <div style="text-align: right; background: #ffffff; padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
            <div style="font-size: 0.72rem; color: #64748b; text-transform: uppercase;">Simulation Mode</div>
            <div style="font-size: 0.9rem; font-weight: 700; color: #16a34a;"><span class="live-dot-success"></span>SAFE SANDBOX</div>
        </div>
    </div>
</div>

<!-- 💡 3-Step Simple How-To-Use Guide -->
<div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.9rem 1.4rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
    <div style="display: flex; align-items: center; gap: 0.8rem;">
        <div style="background: #eff6ff; color: #1d4ed8; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #bfdbfe;">
            1
        </div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 1: Choose Account</strong>
            <span style="color: #64748b; font-size: 0.76rem;">Select any customer account from dropdown.</span>
        </div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.8rem;">
        <div style="background: #eff6ff; color: #1d4ed8; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #bfdbfe;">
            2
        </div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 2: Choose Operation</strong>
            <span style="color: #64748b; font-size: 0.76rem;">Select Deposit (+) or Withdraw (-) & enter amount.</span>
        </div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.8rem;">
        <div style="background: #f0fdf4; color: #15803d; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #86efac;">
            3
        </div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 3: Click Execute</strong>
            <span style="color: #64748b; font-size: 0.76rem;">Watch balance & passbook update instantly!</span>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Fetch Eligible Accounts
accounts_df = simulate.get_eligible_accounts()

if accounts_df.empty:
    st.error("No active accounts found in database.")
    st.stop()

# Layout: Simulation Controls (Left) & Real-Time Audit Feed (Right)
col_sim, col_audit = st.columns([1.1, 0.9])

with col_sim:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    st.markdown("### 🏦 Transaction Terminal")

    # Account Selector
    acc_options = {
        f"{r['customer_id']} — {r['name']} ({r['city']}) | Balance: {format_currency(r['account_balance'])}": r['customer_id']
        for _, r in accounts_df.iterrows()
    }
    selected_label = st.selectbox("Select Account", list(acc_options.keys()))
    selected_cid = acc_options[selected_label]

    # Fetch live balance
    current_bal = simulate.get_balance(selected_cid)
    if current_bal is None:
        current_bal = 0.0

    # Display Current Balance
    st.markdown(f"""
    <div style="background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 1.1rem; margin: 1rem 0; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.06);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.75rem; color: #1e40af; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Current Available Balance</div>
            <span style="font-size: 0.75rem; color: #16a34a; font-weight: 600;"><span class="live-dot-success"></span>Real-Time Verified</span>
        </div>
        <div style="font-size: 2.2rem; font-weight: 800; color: #1d4ed8; margin: 0.2rem 0;">
            {format_currency(current_bal)}
        </div>
        <div style="font-size: 0.75rem; color: #64748b;">Account ID: <code style="color: #1e40af; background: #e0e7ff; padding: 2px 6px; border-radius: 4px;">{selected_cid}</code> &bull; Ledger State: <strong style="color: #16a34a;">Synchronized</strong></div>
    </div>
    """, unsafe_allow_html=True)

    # Action Choice
    action = st.radio(
        "Transaction Type",
        ["Deposit", "Withdrawal"],
        horizontal=True,
        help="Deposit credits funds to account. Withdrawal debits funds and requires sufficient balance."
    )

    # Quick Amount Buttons
    st.markdown("<div style='font-size: 0.72rem; color: #64748b; margin-bottom: 0.3rem;'>Quick Amount Shortcuts</div>", unsafe_allow_html=True)
    q1, q2, q3, q4 = st.columns(4)
    if q1.button("+₹1,000", use_container_width=True):
        st.session_state["sim_amt"] = 1000.0
        st.rerun()
    if q2.button("+₹5,000", use_container_width=True):
        st.session_state["sim_amt"] = 5000.0
        st.rerun()
    if q3.button("+₹25,000", use_container_width=True):
        st.session_state["sim_amt"] = 25000.0
        st.rerun()
    if q4.button("+₹50,000", use_container_width=True):
        st.session_state["sim_amt"] = 50000.0
        st.rerun()

    current_sim_val = float(st.session_state.get("sim_amt", 5000.0))

    # Amount Input
    amount_input = st.number_input(
        "Transaction Amount (₹)",
        min_value=1.0,
        max_value=5000000.0,
        value=current_sim_val,
        step=500.0,
        help="Enter the transaction amount. Note: System enforces mandatory ₹1,000 minimum account balance rule."
    )

    # Projected Balance Calculation & Green/Red Indicators
    MIN_BALANCE = 1000.0
    if action == "Deposit":
        projected_bal = current_bal + amount_input
        valid_operation = True
        proj_status = "Deposit Allowed"
        card_class = "realtime-success-card"
        dot_class = "live-dot-success"
        headline_color = "#15803d"
        headline_text = "READY: Deposit Transaction Permitted"
    else:
        projected_bal = current_bal - amount_input
        if projected_bal < 0:
            valid_operation = False
            proj_status = "Declined — Insufficient Funds"
            card_class = "realtime-stop-card"
            dot_class = "live-dot-stop"
            headline_color = "#b91c1c"
            headline_text = "STOP — DECLINED: Overdraft Exceeded"
        elif projected_bal < MIN_BALANCE:
            valid_operation = False
            proj_status = "Declined — Violates ₹1,000 Minimum Balance Rule"
            card_class = "realtime-stop-card"
            dot_class = "live-dot-stop"
            headline_color = "#b91c1c"
            headline_text = "STOP — DECLINED: Retained Balance Under ₹1,000"
        else:
            valid_operation = True
            proj_status = "Withdrawal Allowed (≥ ₹1,000 Retained)"
            card_class = "realtime-success-card"
            dot_class = "live-dot-success"
            headline_color = "#15803d"
            headline_text = "READY: Withdrawal Permitted"

    # Real-Time Projected Balance Status Banner
    st.markdown(f"""
    <div class="{card_class}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <div style="display: flex; align-items: center;">
                <span class="{dot_class}"></span>
                <strong style="color: {headline_color}; font-size: 0.88rem;">{headline_text}</strong>
            </div>
            <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">{proj_status}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; color: #334155;">Projected Balance: <strong style="color: {headline_color}; font-size: 1.15rem;">{format_currency(projected_bal)}</strong></span>
            <span style="font-size: 0.72rem; color: #64748b;">Regulatory Reserve: ₹1,000</span>
        </div>
    </div>
    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.8rem;">
        🛡️ <strong>Regulatory Guardrail:</strong> Strict minimum balance of ₹1,000.00 is enforced by the ACID ledger engine.
    </div>
    """, unsafe_allow_html=True)

    # Submit Button
    submit_btn = st.button(f"⚡ Execute {action} of {format_currency(amount_input)}", type="primary", use_container_width=True)

    if submit_btn:
        with st.spinner("Processing atomic banking transaction..."):
            result = simulate.execute_simulation_transaction(selected_cid, action, amount_input)

        if result["success"]:
            st.balloons()
            st.markdown(f"""
            <div class="realtime-success-card" style="margin-top: 1rem; padding: 1.2rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="live-dot-success"></span>
                        <strong style="color: #15803d; font-size: 1.05rem;">TRANSACTION COMMITTED (SUCCESS)</strong>
                    </div>
                    <span style="font-family: monospace; font-size: 0.78rem; color: #1d4ed8; font-weight: 700; background: #eff6ff; padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid #bfdbfe;">{result['txn_id']}</span>
                </div>
                <div style="font-size: 0.85rem; color: #1e293b; line-height: 1.6;">
                    <div><strong>Customer ID:</strong> {result['customer_id']}</div>
                    <div><strong>Action:</strong> <span class="kpi-badge badge-green">{result['action']} of {format_currency(result['amount'])}</span></div>
                    <div><strong>Opening Balance:</strong> {format_currency(result['previous_balance'])}</div>
                    <div><strong>Closing Balance:</strong> <span style="color: #15803d; font-weight: 800; font-size: 1.05rem;">{format_currency(result['new_balance'])}</span></div>
                    <div><strong>Timestamp:</strong> {result['timestamp']}</div>
                    <div><strong>ACID Status:</strong> <span style="color: #15803d; font-weight: 700;">Committed to MySQL Ledger (Zero Drift)</span></div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            st.rerun()
        else:
            st.markdown(f"""
            <div class="realtime-stop-card" style="margin-top: 1rem; padding: 1.2rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                    <span class="live-dot-stop"></span>
                    <strong style="color: #b91c1c; font-size: 1.05rem;">TRANSACTION STOPPED & ROLLED BACK</strong>
                </div>
                <div style="font-size: 0.88rem; color: #7f1d1d; font-weight: 600; margin: 0.3rem 0;">
                    {result['message']}
                </div>
                <div style="font-size: 0.75rem; color: #991b1b; margin-top: 0.4rem;">
                    🛡️ Database state was completely rolled back. Zero financial discrepancy recorded.
                </div>
            </div>
            """, unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)

with col_audit:
    st.markdown('<div class="content-card">', unsafe_allow_html=True)
    st.markdown(f"### 📋 Audit Trail: `{selected_cid}`")
    st.markdown(f"<p style='color: #64748b; font-size: 0.85rem;'>Real-time ledger entries for account <strong>{selected_cid}</strong>.</p>", unsafe_allow_html=True)

    recent_txns = simulate.get_account_recent_transactions(selected_cid, limit=10)

    if not recent_txns.empty:
        # Format amount and badges
        recent_txns["Formatted Amount"] = recent_txns["amount"].apply(lambda v: format_currency(v))
        st.dataframe(
            recent_txns[["txn_id", "txn_type", "Formatted Amount", "txn_time", "status"]],
            use_container_width=True,
            hide_index=True
        )
    else:
        st.info("No prior transaction entries for this account.")

    st.markdown("<br>", unsafe_allow_html=True)

    # Technical Details Card
    st.markdown("""
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; font-size: 0.8rem; color: #475569;">
        <strong style="color: #1e3a8a; font-size: 0.85rem;">🛡️ How BankSight ACID Safety Works:</strong>
        <ol style="margin: 0.4rem 0 0 1.2rem; padding: 0; line-height: 1.6;">
            <li><code>SELECT ... FOR UPDATE</code> locks the row, preventing concurrent balance race conditions.</li>
            <li>Validates that balance covers debit amount without violating ₹1,000 minimum reserve.</li>
            <li>Generates cryptographic transaction identifier (<code>TXN...</code>).</li>
            <li>Executes atomic update to <code>accounts</code> table and inserts entry in <code>transactions</code>.</li>
            <li>Calls <code>conn.commit()</code> on success or <code>conn.rollback()</code> on any rule breach.</li>
        </ol>
    </div>
    """, unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
