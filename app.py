# app.py
import streamlit as st
import pandas as pd
from helpers import load_table
import queries as q
import crud
import simulate

st.set_page_config(page_title="BankSight Dashboard", layout="wide")
st.title("🏦 BankSight : Transaction Intelligence Dashboard")

# ----------------------------
# CREATIVE SIDEBAR NAVIGATION
# ----------------------------
st.sidebar.title("📚 BankSight Navigation")
st.sidebar.markdown("### 👉 Go To")

menu = st.sidebar.radio(
    "",
    [
        "🏠 Introduction",
        "📄 View Tables",
        "🔍 Filter Data",
        "🛠 CRUD (Accounts/Transactions)",
        "💰 Credit/Debit Simulation",
        "📊 Analytical Insights (15)",
        "👩‍💻 About Creator"
    ]
)

# Remove emojis from logical menu switching
menu_clean = menu.replace("🏠 ","").replace("📄 ","").replace("🔍 ","").replace("🛠 ","").replace("💰 ","").replace("📊 ","") .replace("👩‍💻 ","")

# ----------------------------
# ⭐ INTRODUCTION PAGE
# ----------------------------
if menu_clean == "Introduction":
    st.header("📌 Project Overview")
    st.write("""
    *BankSight: Transaction Intelligence Dashboard*  
    A simple, interactive banking dashboard built using *Python, Streamlit, and MySQL*.

    This dashboard helps analyze:
    - Customer behaviour  
    - Account balances  
    - Loan summaries  
    - Transactions  
    - Branch performance  
    - Support ticket efficiency  
    """)

    st.header("🎯 Objectives")
    st.write("""
    - Display and explore *6 main datasets*
    - Allow *multi-level filtering*
    - Perform *CRUD (Create, Read, Update, Delete)* on accounts & transactions
    - Simulate *credit/debit banking operations*
    - Execute *15 real SQL analytical insights*
    - Provide a clean & smart dashboard for banking insights  
    """)

# ----------------------------
# VIEW TABLES
# ----------------------------
elif menu_clean == "View Tables":
    st.header("📄 View Tables")
    table = st.selectbox("Select table", 
        ["customers","accounts","transactions","loans","credit_cards","branches","support_tickets"])
    
    df = load_table(table)
    st.dataframe(df)

# ----------------------------
# FILTER DATA
# ----------------------------
elif menu_clean == "Filter Data":
    st.header("🔍 Filter Data")
    table = st.selectbox("Choose dataset", 
        ["customers","accounts","transactions","loans","credit_cards","branches","support_tickets"])
    
    df = load_table(table)

    if df.empty:
        st.warning("No data found!")
    else:
        col = st.selectbox("Column", df.columns)
        val = st.text_input("Search text")

        if val:
            filtered = df[df[col].astype(str).str.contains(val, case=False, na=False)]
            st.dataframe(filtered)
        else:
            st.dataframe(df)

# ----------------------------
# CRUD OPERATIONS
# ----------------------------
elif menu_clean == "CRUD (Accounts/Transactions)":
    st.header("🛠 CRUD Operations")

    section = st.selectbox("Select table", ["accounts", "transactions"])

    # ACCOUNT CRUD
    if section == "accounts":
        st.subheader("➕ Insert New Account")
        with st.form("add_acc"):
            cust = st.text_input("Customer ID")
            acc_type = st.text_input("Account Type")
            balance = st.number_input("Opening Balance", min_value=0.0)
            submit = st.form_submit_button("Insert")

            if submit:
                new_id = crud.insert_row("accounts", 
                        ["customer_id","account_type","account_balance"],
                        [cust, acc_type, balance])
                st.success(f"Account Created (ID: {new_id})")

        st.markdown("---")
        st.subheader("❌ Delete Account")
        acc_id = st.text_input("Account ID")
        if st.button("Delete"):
            deleted = crud.delete_row("accounts", "account_id", acc_id)
            st.success(f"Deleted Rows: {deleted}")

    # TRANSACTION CRUD
    else:
        st.subheader("➕ Insert Transaction")
        with st.form("add_txn"):
            cust = st.text_input("Customer ID")
            ttype = st.text_input("Transaction Type")
            amount = st.number_input("Amount", min_value=0.0)
            status = st.selectbox("Status", ["success", "failed", "pending"])
            branch = st.text_input("Branch ID")
            from datetime import datetime
            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            submit = st.form_submit_button("Insert")
            if submit:
                new_id = crud.insert_row(
                    "transactions",
                    ["customer_id","txn_type","amount","txn_time","status","branch_id"],
                    [cust, ttype, amount, now, status, branch]
                )
                st.success(f"Transaction Added (ID: {new_id})")

        st.markdown("---")
        st.subheader("❌ Delete Transaction")
        tid = st.text_input("Transaction ID")
        if st.button("Delete"):
            deleted = crud.delete_row("transactions", "transaction_id", tid)
            st.success(f"Deleted Rows: {deleted}")

# ----------------------------
# CREDIT-DEBIT SIMULATION
# ----------------------------
elif menu_clean == "Credit/Debit Simulation":
    st.header("💰 Credit / Debit Simulation")

    acc = st.text_input("Account ID")

    if st.button("Check Balance"):
        bal = simulate.get_balance(acc)
        st.success(f"Current balance = ₹{bal}" if bal else "Not Found")

    amt = st.number_input("Amount", min_value=0.0)
    action = st.radio("Action", ["Deposit", "Withdraw"])

    if st.button("Submit"):
        bal = simulate.get_balance(acc)
        if bal is None:
            st.error("Account not found")
        else:
            if action == "Deposit":
                simulate.set_balance(acc, bal + amt)
                st.success("Deposit Successful!")
            else:
                if bal - amt < 1000:
                    st.error("Minimum balance ₹1000 required!")
                else:
                    simulate.set_balance(acc, bal - amt)
                    st.success("Withdrawal Successful!")

# ----------------------------
# ANALYTICAL INSIGHTS
# ----------------------------
elif menu_clean == "Analytical Insights (15)":
    st.header("📊 Analytical SQL Insights")

    questions = {
        "Q1 Customers per city + avg balance": q.q1_customers_per_city_avg_balance,
        "Q2 Account type highest balance": q.q2_account_type_highest_total_balance,
        "Q3 Top 10 customers by balance": q.q3_top_10_customers_by_balance,
        "Q4 2023 accounts >100k": q.q4_customers_opened_2023_above_100k,
        "Q5 Volume by txn type": q.q5_total_volume_by_txn_type,
        "Q6 >3 failed in month": q.q6_accounts_more_than_3_failed_month,
        "Q7 Top 5 branches (6 months)": q.q7_top5_branches_last_6_months,
        "Q8 Accounts w/ >=5 high-value txns": q.q8_accounts_high_value_5plus,
        "Q9 Avg loan & interest": q.q9_avg_loan_amount_interest_by_type,
        "Q10 Multiple active loans": q.q10_customers_multiple_active_loans,
        "Q11 Top 5 outstanding loans": q.q11_top5_customers_highest_outstanding,
        "Q12 Branch highest balance": q.q12_branch_highest_total_balance,
        "Q13 Branch performance": q.q13_branch_performance_summary,
        "Q14 Longest resolution category": q.q14_issue_category_longest_resolution,
        "Q15 Top support agents": q.q15_agents_most_highrated_critical
    }

    choice = st.selectbox("Select Query", list(questions.keys()))
    df = questions[choice]()
    st.dataframe(df)

# ----------------------------
# ABOUT CREATOR (Correct)
# ----------------------------
elif menu_clean == "About Creator":
    st.header("👩‍💻 About the Creator")
    st.write("""
    *Name:* Priya Sharma  
    *Project:* BankSight – Transaction Intelligence Dashboard  
    *Skills:* Python, SQL, Streamlit, Data Analysis  
    *Contact:* priyasharma@example.com  
    """)

    st.write("---")
    st.subheader("📘 Project Purpose")
    st.write("""
    This project was built for learning *SQL, Data Analysis, Streamlit App Development*  
    using live MySQL datasets.
    """)