# Banksight
📊 BankSight: Transaction Intelligence Dashboard

A complete Bank Transaction Intelligence Dashboard built using Python, Streamlit, and MySQL, designed to analyze customer behavior, transaction patterns, loan insights, branch performance, and support ticket efficiency using 15 advanced SQL analytical queries.


---

🚀 Project Overview

BankSight is an end-to-end data intelligence dashboard that helps banks gain insights into:

Customer demographics & balances

High-value & failed transactions

Loan performance

Branch revenue & total transaction volume

Support ticket analysis

Agent performance


This project provides a complete real-world banking analytics system connecting MySQL + Streamlit + Python.


---

🎯 Objectives

✔ Build a real-time analytics dashboard
✔ Perform advanced SQL analysis on banking datasets
✔ Visualize customer & account behavior
✔ Identify top-performing branches
✔ Analyze loan & credit card insights
✔ Track support ticket resolution and agent efficiency
✔ Provide business-ready insights for decision making


---

🛠 Tech Stack

Component	Technology

Frontend UI	Streamlit
Backend	Python
Database	MySQL
Data Processing	Pandas
Visualization	Streamlit Charts
Version Control	Git + GitHub



---

🗂 Project Structure

Banksight/
│── app.py                # Main Streamlit dashboard
│── queries.py            # All SQL queries (Q1–Q15)
│── db.py                 # Database connection
│── crud.py               # Create, Read, Update, Delete functions
│── helpers.py            # Utility functions
│── simulate.py           # Data simulation (if used)
│── README.md             # Documentation
│── .gitignore            # Ignored files


---

📘 Features Covered (15 SQL Insights)

1. Customer & Account Insights

Q1: Customer count per city + avg balance

Q2: Highest total balance by account type

Q3: Top 10 richest customers

Q4: 2023 new accounts with high balance


2. Transaction Behavior

Q5: Total transaction volume by type

Q6: Accounts with >3 failed transactions in one month

Q7: Top 5 branches by last 6 months txn volume

Q8: High-value transactions (>2,00,000)


3. Loan Insights

Q9: Avg loan amount + interest by type

Q10: Customers with multiple active loans

Q11: Top 5 customers with highest outstanding loans


4. Branch Performance

Q12: Highest total account balance

Q13: Branch performance summary (customers, loans, txn volume)


5. Support Tickets & Customer Experience

Q14: Longest average resolution time by issue category

Q15: Agents resolving most critical high-rated tickets



---

📸 Dashboard Preview

👉 Add screenshots of your dashboard here
(You can upload images in GitHub → click README.md → edit → upload)


---

🔧 How to Run This Project

1️⃣ Clone the Repository

git clone https://github.com/sharmapriya18504-dotcom/Banksight
cd Banksight

2️⃣ Install Dependencies

pip install -r requirements.txt

3️⃣ Update MySQL Credentials

Open db.py and update:

host="localhost"
user="root"
password="YOUR_PASSWORD"
database="banksight"

4️⃣ Run the Dashboard

streamlit run app.py


---

🧠 Key Learnings

Real-world MySQL analytical querying

Full data pipeline integration

Creating dashboards with Streamlit

Building CRUD operations

Structuring real software projects

Publishing project on GitHub



---

👩‍💻 Author

Priya Sharma
📧 sharmapriya18504-dotcom
💼 Aspiring Data Analyst / Python Developer
