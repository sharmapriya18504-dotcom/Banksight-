"""
BankSight - Working Enterprise CRUD Operations
Page 4: Transaction-safe, validated Create, Read, Update, and Delete operations with FK integrity.
"""

import streamlit as st
import pandas as pd
from helpers import inject_custom_css, run_query, format_currency
from components.sidebar import render_sidebar
import crud

st.set_page_config(
    page_title="CRUD Operations | BankSight",
    page_icon="🛠",
    layout="wide"
)

inject_custom_css()
render_sidebar()

st.markdown("""
<div style="margin-bottom: 1.2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;">
    <h1 style="font-size: 2rem; font-weight: 800; margin: 0; color: #1e3a8a;">
        Bank Data Management (Add, Edit & Delete)
    </h1>
    <p style="color: #64748b; margin: 0.3rem 0 0 0; font-size: 0.95rem;">
        Easily register new customers, update bank records, open accounts, and log support tickets with database safety protection.
    </p>
</div>

<!-- 💡 3-Step Simple How-To-Use Guide -->
<div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.9rem 1.4rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.2rem; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
    <div style="display: flex; align-items: center; gap: 0.85rem;">
        <div style="background: #eff6ff; color: #1d4ed8; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #bfdbfe;">1</div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 1: Choose Bank Section</strong>
            <span style="color: #64748b; font-size: 0.76rem;">Pick Customers, Accounts, Branches, or Support Tickets above.</span>
        </div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.85rem;">
        <div style="background: #eff6ff; color: #1d4ed8; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #bfdbfe;">2</div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 2: Fill the Simple Form</strong>
            <span style="color: #64748b; font-size: 0.76rem;">Type in customer details or select an existing record to edit.</span>
        </div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.85rem;">
        <div style="background: #f0fdf4; color: #15803d; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; border: 2px solid #86efac;">3</div>
        <div>
            <strong style="color: #0f172a; font-size: 0.86rem; display: block;">Step 3: Click Save</strong>
            <span style="color: #64748b; font-size: 0.76rem;">Records are immediately verified and saved directly into MySQL.</span>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Navigation Tabs
tab_cust, tab_acc, tab_branch, tab_ticket = st.tabs([
    "👥 Customer Management",
    "🏦 Accounts Ledger",
    "🏢 Branch Network",
    "🎫 Support Inquiries"
])

# ==============================================================================
# TAB 1: CUSTOMER MANAGEMENT
# ==============================================================================
with tab_cust:
    st.subheader("Customer Profiles (Create, Update, Delete)")

    c_action = st.radio("Choose Customer Action", ["➕ Add New Customer", "✏️ Edit Customer Profile", "❌ Delete Customer"], horizontal=True)

    if c_action == "➕ Add New Customer":
        st.markdown('<div class="content-card">', unsafe_allow_html=True)
        st.markdown("##### New Customer Registration")
        with st.form("form_add_customer", clear_on_submit=False):
            col1, col2 = st.columns(2)
            with col1:
                # Suggest next customer ID
                max_cust_df = run_query("SELECT COALESCE(MAX(CAST(SUBSTRING(customer_id, 2) AS UNSIGNED)), 0) + 1 AS next_id FROM customers WHERE customer_id LIKE 'C%'")
                next_cid = f"C{int(max_cust_df['next_id'].iloc[0]):04d}" if not max_cust_df.empty else "C0501"
                c_id = st.text_input("Customer ID", value=next_cid, help="Unique identifier format: C0001")
                c_name = st.text_input("Full Name", placeholder="e.g. Aditi Sharma")
                c_gender = st.selectbox("Gender", ["F", "M", "O"])
            with col2:
                c_age = st.number_input("Age", min_value=18, max_value=120, value=28)
                c_city = st.text_input("City", placeholder="e.g. Mumbai")
                c_acctype = st.selectbox("Account Classification", ["Savings", "Current"])

            submitted = st.form_submit_button("Register Customer", use_container_width=True)
            if submitted:
                success, msg = crud.insert_customer(c_id, c_name, c_gender, int(c_age), c_city, c_acctype)
                if success:
                    st.success(msg)
                    st.rerun()
                else:
                    st.error(msg)
        st.markdown('</div>', unsafe_allow_html=True)

    elif c_action == "✏️ Edit Customer Profile":
        st.markdown('<div class="content-card">', unsafe_allow_html=True)
        st.markdown("##### Update Customer Information")
        cust_list_df = run_query("SELECT customer_id, name, city FROM customers ORDER BY customer_id DESC LIMIT 200")
        if not cust_list_df.empty:
            cust_options = {f"{r['customer_id']} - {r['name']} ({r['city']})": r['customer_id'] for _, r in cust_list_df.iterrows()}
            selected_label = st.selectbox("Select Customer to Edit", list(cust_options.keys()))
            sel_cid = cust_options[selected_label]

            # Fetch existing data
            curr_data = run_query("SELECT * FROM customers WHERE customer_id = %s", (sel_cid,))
            if not curr_data.empty:
                r = curr_data.iloc[0]
                with st.form("form_edit_customer"):
                    col1, col2 = st.columns(2)
                    with col1:
                        new_name = st.text_input("Full Name", value=r["name"])
                        new_gender = st.selectbox("Gender", ["F", "M", "O"], index=["F", "M", "O"].index(r["gender"]) if r["gender"] in ["F", "M", "O"] else 0)
                        new_age = st.number_input("Age", min_value=18, max_value=120, value=int(r["age"]) if pd.notna(r["age"]) else 30)
                    with col2:
                        new_city = st.text_input("City", value=r["city"])
                        new_acctype = st.selectbox("Account Type", ["Savings", "Current"], index=0 if r["account_type"] == "Savings" else 1)

                    upd_submitted = st.form_submit_button("Save Changes", use_container_width=True)
                    if upd_submitted:
                        success, msg = crud.update_customer(sel_cid, new_name, new_gender, int(new_age), new_city, new_acctype)
                        if success:
                            st.success(msg)
                            st.rerun()
                        else:
                            st.error(msg)
        st.markdown('</div>', unsafe_allow_html=True)

    else:  # Delete Customer
        st.markdown('<div class="content-card">', unsafe_allow_html=True)
        st.markdown("##### Remove Customer Record")
        st.warning("⚠️ Deletion respects Foreign Key constraints. Customers with existing accounts or transactions cannot be deleted directly without closing dependencies.")

        del_cid = st.text_input("Enter Customer ID to Delete", placeholder="e.g. C0501")
        confirm_del = st.checkbox("I confirm that this customer record should be permanently removed.")

        if st.button("Execute Deletion", type="primary"):
            if not confirm_del:
                st.error("Please confirm deletion by clicking the confirmation checkbox.")
            else:
                success, msg = crud.delete_customer(del_cid.strip())
                if success:
                    st.success(msg)
                    st.rerun()
                else:
                    st.error(msg)
        st.markdown('</div>', unsafe_allow_html=True)

    # Preview Recent Customers
    st.markdown("###### Recently Added / Modified Customers")
    recent_custs = run_query("SELECT customer_id, name, gender, age, city, account_type, join_date FROM customers ORDER BY join_date DESC, customer_id DESC LIMIT 8")
    st.dataframe(recent_custs, use_container_width=True, hide_index=True)


# ==============================================================================
# TAB 2: ACCOUNTS LEDGER
# ==============================================================================
with tab_acc:
    st.subheader("Bank Accounts Management")
    st.markdown("""
    <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 8px; padding: 0.85rem 1rem; margin-bottom: 1rem; font-size: 0.85rem; color: #1e3a8a;">
        ℹ️ In the BankSight ledger architecture, accounts reference a verified <code>customer_id</code>. Financial balances must be updated via the audited <a href="/Credit_Debit_Simulation" style="color: #2563eb; font-weight: 700;">Credit/Debit Simulation</a> module to preserve transaction trail integrity.
    </div>
    """, unsafe_allow_html=True)

    acc_action = st.radio("Choose Account Action", ["➕ Open New Account", "🔍 View Account Ledger", "❌ Close Account"], horizontal=True)

    if acc_action == "➕ Open New Account":
        st.markdown('<div class="content-card">', unsafe_allow_html=True)
        st.markdown("##### Open Account for Unassigned Customer")
        # Find customers without accounts
        unlinked_custs = run_query("""
            SELECT c.customer_id, c.name, c.city 
            FROM customers c 
            LEFT JOIN accounts a ON c.customer_id = a.customer_id 
            WHERE a.customer_id IS NULL
            LIMIT 100
        """)

        if not unlinked_custs.empty:
            cust_dict = {f"{r['customer_id']} - {r['name']} ({r['city']})": r['customer_id'] for _, r in unlinked_custs.iterrows()}
            chosen_cust = st.selectbox("Select Eligible Customer", list(cust_dict.keys()))
            chosen_cid = cust_dict[chosen_cust]

            opening_bal = st.number_input("Opening Balance (₹)", min_value=0.0, value=5000.0, step=500.0)

            if st.button("Open Account", use_container_width=True):
                success, msg = crud.insert_account(chosen_cid, float(opening_bal))
                if success:
                    st.success(msg)
                    st.rerun()
                else:
                    st.error(msg)
        else:
            st.info("All registered customers currently hold active deposit accounts.")
        st.markdown('</div>', unsafe_allow_html=True)

    elif acc_action == "🔍 View Account Ledger":
        st.markdown('<div class="content-card">', unsafe_allow_html=True)
        search_acc_cid = st.text_input("Enter Customer ID to Inspect Account", placeholder="e.g. C0003")
        if search_acc_cid:
            acc_details = run_query("""
                SELECT a.customer_id, c.name, c.city, c.account_type, a.account_balance, a.last_updated
                FROM accounts a
                JOIN customers c ON a.customer_id = c.customer_id
                WHERE a.customer_id = %s
            """, (search_acc_cid.strip(),))
            if not acc_details.empty:
                r = acc_details.iloc[0]
                m1, m2, m3 = st.columns(3)
                m1.metric("Account Holder", r["name"])
                m2.metric("Current Balance", format_currency(r["account_balance"]))
                m3.metric("Last Activity", str(r["last_updated"]))
            else:
                st.warning(f"No account found for Customer ID '{search_acc_cid}'.")
        st.markdown('</div>', unsafe_allow_html=True)

    else:
        st.markdown('<div class="content-card">', unsafe_allow_html=True)
        st.markdown("##### Close Account")
        close_cid = st.text_input("Enter Customer ID of Account to Close")
        confirm_close = st.checkbox("I confirm this account has zero balance or customer requested immediate closure.")
        if st.button("Close Account", type="primary"):
            if not confirm_close:
                st.error("Please confirm closure.")
            else:
                success, msg = crud.delete_account(close_cid.strip())
                if success:
                    st.success(msg)
                    st.rerun()
                else:
                    st.error(msg)
        st.markdown('</div>', unsafe_allow_html=True)


# ==============================================================================
# TAB 3: BRANCH NETWORK
# ==============================================================================
with tab_branch:
    st.subheader("Branch Network Directory")

    b_act = st.radio("Branch Action", ["➕ Add Branch", "❌ Delete Branch"], horizontal=True)

    if b_act == "➕ Add Branch":
        st.markdown('<div class="content-card">', unsafe_allow_html=True)
        with st.form("form_add_branch"):
            col1, col2 = st.columns(2)
            with col1:
                b_name = st.text_input("Branch Name", placeholder="e.g. Marine Drive Financial Branch")
                b_city = st.text_input("City", placeholder="e.g. Mumbai")
                b_mgr = st.text_input("Branch Manager Name", placeholder="e.g. Vikram Singhania")
            with col2:
                b_emp = st.number_input("Total Staff / Employees", min_value=1, max_value=1000, value=25)
                b_rev = st.number_input("Annual Branch Revenue (₹)", min_value=0.0, value=5000000.0, step=100000.0)
                b_rating = st.slider("Initial Performance Rating (1-5)", min_value=1, max_value=5, value=4)

            b_sub = st.form_submit_button("Register Branch", use_container_width=True)
            if b_sub:
                success, msg = crud.insert_branch(b_name, b_city, b_mgr, int(b_emp), float(b_rev), int(b_rating))
                if success:
                    st.success(msg)
                    st.rerun()
                else:
                    st.error(msg)
        st.markdown('</div>', unsafe_allow_html=True)

    else:
        st.markdown('<div class="content-card">', unsafe_allow_html=True)
        del_bid = st.number_input("Branch ID to Remove", min_value=1, step=1)
        if st.button("Delete Branch", type="primary"):
            success, msg = crud.delete_branch(int(del_bid))
            if success:
                st.success(msg)
                st.rerun()
            else:
                st.error(msg)
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("###### Top Branches Directory")
    br_df = run_query("SELECT branch_id, branch_name, city, manager_name, total_employees, branch_revenue, performance_rating FROM branches ORDER BY branch_id DESC LIMIT 8")
    st.dataframe(br_df, use_container_width=True, hide_index=True)


# ==============================================================================
# TAB 4: SUPPORT INQUIRIES
# ==============================================================================
with tab_ticket:
    st.subheader("Support Tickets & Inquiries")

    t_act = st.radio("Ticket Action", ["🎫 Log Support Ticket", "🔄 Update Ticket Status"], horizontal=True)

    if t_act == "🎫 Log Support Ticket":
        st.markdown('<div class="content-card">', unsafe_allow_html=True)
        with st.form("form_add_ticket"):
            tc1, tc2 = st.columns(2)
            with tc1:
                t_cid = st.text_input("Customer ID", value="C0003")
                t_branch = st.text_input("Branch Name", value="Wang, Mcdonald and Church Branch")
                t_cat = st.selectbox("Issue Category", [
                    "Card Replacement", "Loan Payment Delay", "Interest Rate Dispute",
                    "NetBanking Access", "Unauthorized Transaction Alert", "Account Statement Request"
                ])
            with tc2:
                t_priority = st.selectbox("Priority", ["Low", "Medium", "High", "Critical"])
                t_agent = st.text_input("Assigned Agent", value="Priya Sharma")
                t_channel = st.selectbox("Channel", ["Web Portal", "Mobile App", "In-person", "Phone", "Email"])

            t_desc = st.text_area("Issue Description", placeholder="Customer reported unexpected debit alert...")
            t_sub = st.form_submit_button("Submit Ticket", use_container_width=True)
            if t_sub:
                success, msg = crud.insert_support_ticket(t_cid, t_branch, t_cat, t_desc, t_priority, t_agent, t_channel)
                if success:
                    st.success(msg)
                    st.rerun()
                else:
                    st.error(msg)
        st.markdown('</div>', unsafe_allow_html=True)

    else:
        st.markdown('<div class="content-card">', unsafe_allow_html=True)
        upd_tid = st.text_input("Ticket ID (e.g. T00001)")
        upd_status = st.selectbox("New Status", ["Open", "In Progress", "Resolved", "Closed"])
        upd_remarks = st.text_area("Resolution Remarks / Notes", placeholder="Verified transaction and issued replacement card.")

        if st.button("Update Ticket", use_container_width=True):
            if not upd_tid:
                st.error("Please provide Ticket ID.")
            else:
                success, msg = crud.update_ticket_status(upd_tid.strip(), upd_status, upd_remarks)
                if success:
                    st.success(msg)
                    st.rerun()
                else:
                    st.error(msg)
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("###### Recent Support Tickets")
    st_df = run_query("SELECT Ticket_ID, Customer_ID, Branch_Name, Issue_Category, Priority, Status, Date_Opened, Support_Agent FROM support_tickets ORDER BY Ticket_ID DESC LIMIT 8")
    st.dataframe(st_df, use_container_width=True, hide_index=True)
