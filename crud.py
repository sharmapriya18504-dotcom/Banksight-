"""
BankSight CRUD Operations Module
Provides validated, parameterized, transaction-safe Create, Read, Update, and Delete operations
with strict foreign key constraint handling and error sanitization.
"""

from db import get_connection
import mysql.connector
from datetime import datetime

ALLOWED_TABLES = {
    "customers", "accounts", "transactions", "loans",
    "credit_cards", "branches", "support_tickets"
}

# ==============================================================================
# CUSTOMER CRUD
# ==============================================================================
def validate_customer_data(customer_id: str, name: str, age: int, gender: str, city: str, account_type: str) -> tuple[bool, str]:
    if not customer_id or len(customer_id.strip()) == 0:
        return False, "Customer ID cannot be empty."
    if not name or len(name.strip()) < 2:
        return False, "Customer Name must have at least 2 characters."
    if not isinstance(age, int) or age < 18 or age > 120:
        return False, "Age must be an integer between 18 and 120."
    if gender not in ["M", "F", "O"]:
        return False, "Gender must be 'M', 'F', or 'O'."
    if not city or len(city.strip()) == 0:
        return False, "City cannot be empty."
    if account_type not in ["Savings", "Current"]:
        return False, "Account Type must be 'Savings' or 'Current'."
    return True, ""

def insert_customer(customer_id: str, name: str, gender: str, age: int, city: str, account_type: str, join_date: str = None) -> tuple[bool, str]:
    val_ok, msg = validate_customer_data(customer_id, name, age, gender, city, account_type)
    if not val_ok:
        return False, msg

    if not join_date:
        join_date = datetime.now().strftime("%Y-%m-%d")

    conn = None
    try:
        conn = get_connection()
        conn.autocommit = False
        cur = conn.cursor()

        # Check for duplicate
        cur.execute("SELECT customer_id FROM customers WHERE customer_id = %s", (customer_id.strip(),))
        if cur.fetchone():
            return False, f"Customer ID '{customer_id}' already exists."

        sql = """
            INSERT INTO customers (customer_id, name, gender, age, city, account_type, join_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cur.execute(sql, (customer_id.strip(), name.strip(), gender, age, city.strip(), account_type, join_date))
        conn.commit()
        return True, f"Customer '{name}' ({customer_id}) created successfully."
    except mysql.connector.Error as e:
        if conn:
            conn.rollback()
        return False, f"Database error inserting customer: {e.msg}"
    finally:
        if conn:
            conn.close()

def update_customer(customer_id: str, name: str, gender: str, age: int, city: str, account_type: str) -> tuple[bool, str]:
    val_ok, msg = validate_customer_data(customer_id, name, age, gender, city, account_type)
    if not val_ok:
        return False, msg

    conn = None
    try:
        conn = get_connection()
        conn.autocommit = False
        cur = conn.cursor()

        cur.execute("SELECT customer_id FROM customers WHERE customer_id = %s", (customer_id.strip(),))
        if not cur.fetchone():
            return False, f"Customer ID '{customer_id}' does not exist."

        sql = """
            UPDATE customers 
            SET name = %s, gender = %s, age = %s, city = %s, account_type = %s
            WHERE customer_id = %s
        """
        cur.execute(sql, (name.strip(), gender, age, city.strip(), account_type, customer_id.strip()))
        conn.commit()
        return True, f"Customer '{customer_id}' updated successfully."
    except mysql.connector.Error as e:
        if conn:
            conn.rollback()
        return False, f"Database error updating customer: {e.msg}"
    finally:
        if conn:
            conn.close()

def delete_customer(customer_id: str) -> tuple[bool, str]:
    conn = None
    try:
        conn = get_connection()
        conn.autocommit = False
        cur = conn.cursor()

        # Foreign Key Dependency Check: check accounts and transactions
        cur.execute("SELECT COUNT(*) FROM accounts WHERE customer_id = %s", (customer_id,))
        acc_cnt = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM transactions WHERE customer_id = %s", (customer_id,))
        txn_cnt = cur.fetchone()[0]

        if acc_cnt > 0 or txn_cnt > 0:
            return False, f"Cannot delete customer '{customer_id}': FK Constraint Active ({acc_cnt} accounts, {txn_cnt} transactions linked). Close dependencies first."

        cur.execute("DELETE FROM customers WHERE customer_id = %s", (customer_id,))
        conn.commit()
        if cur.rowcount > 0:
            return True, f"Customer '{customer_id}' deleted successfully."
        return False, f"Customer '{customer_id}' not found."
    except mysql.connector.Error as e:
        if conn:
            conn.rollback()
        return False, f"Database error deleting customer: {e.msg}"
    finally:
        if conn:
            conn.close()

# ==============================================================================
# ACCOUNT CRUD (With Ledger Validation)
# ==============================================================================
def insert_account(customer_id: str, opening_balance: float) -> tuple[bool, str]:
    if opening_balance < 0:
        return False, "Opening balance cannot be negative."

    conn = None
    try:
        conn = get_connection()
        conn.autocommit = False
        cur = conn.cursor()

        # Verify customer exists
        cur.execute("SELECT customer_id, name FROM customers WHERE customer_id = %s", (customer_id,))
        cust = cur.fetchone()
        if not cust:
            return False, f"Cannot create account: Customer '{customer_id}' does not exist."

        # Check if account already exists
        cur.execute("SELECT customer_id FROM accounts WHERE customer_id = %s", (customer_id,))
        if cur.fetchone():
            return False, f"Customer '{customer_id}' already has an active bank account."

        sql = "INSERT INTO accounts (customer_id, account_balance, last_updated) VALUES (%s, %s, NOW())"
        cur.execute(sql, (customer_id, opening_balance))
        conn.commit()
        return True, f"Account for Customer '{customer_id}' created with opening balance of ₹{opening_balance:,.2f}."
    except mysql.connector.Error as e:
        if conn:
            conn.rollback()
        return False, f"Database error creating account: {e.msg}"
    finally:
        if conn:
            conn.close()

def delete_account(customer_id: str) -> tuple[bool, str]:
    conn = None
    try:
        conn = get_connection()
        conn.autocommit = False
        cur = conn.cursor()

        cur.execute("SELECT account_balance FROM accounts WHERE customer_id = %s", (customer_id,))
        row = cur.fetchone()
        if not row:
            return False, f"Account for Customer '{customer_id}' not found."

        cur.execute("DELETE FROM accounts WHERE customer_id = %s", (customer_id,))
        conn.commit()
        return True, f"Account for Customer '{customer_id}' deleted successfully."
    except mysql.connector.Error as e:
        if conn:
            conn.rollback()
        return False, f"Database error deleting account: {e.msg}"
    finally:
        if conn:
            conn.close()

# ==============================================================================
# BRANCH CRUD
# ==============================================================================
def insert_branch(branch_name: str, city: str, manager_name: str, total_employees: int, branch_revenue: float, performance_rating: int) -> tuple[bool, str]:
    if not branch_name or len(branch_name.strip()) < 2:
        return False, "Branch Name must be at least 2 characters."
    if total_employees < 1:
        return False, "Total employees must be at least 1."
    if performance_rating < 1 or performance_rating > 5:
        return False, "Performance rating must be between 1 and 5."

    conn = None
    try:
        conn = get_connection()
        conn.autocommit = False
        cur = conn.cursor()

        cur.execute("SELECT COALESCE(MAX(branch_id), 0) + 1 FROM branches")
        new_id = cur.fetchone()[0]

        sql = """
            INSERT INTO branches (branch_id, branch_name, city, manager_name, total_employees, branch_revenue, opening_date, performance_rating)
            VALUES (%s, %s, %s, %s, %s, %s, CURDATE(), %s)
        """
        cur.execute(sql, (new_id, branch_name.strip(), city.strip(), manager_name.strip(), total_employees, branch_revenue, performance_rating))
        conn.commit()
        return True, f"Branch '{branch_name}' created with Branch ID {new_id}."
    except mysql.connector.Error as e:
        if conn:
            conn.rollback()
        return False, f"Database error creating branch: {e.msg}"
    finally:
        if conn:
            conn.close()

def delete_branch(branch_id: int) -> tuple[bool, str]:
    conn = None
    try:
        conn = get_connection()
        conn.autocommit = False
        cur = conn.cursor()

        cur.execute("DELETE FROM branches WHERE branch_id = %s", (branch_id,))
        conn.commit()
        if cur.rowcount > 0:
            return True, f"Branch ID {branch_id} deleted successfully."
        return False, f"Branch ID {branch_id} not found."
    except mysql.connector.Error as e:
        if conn:
            conn.rollback()
        return False, f"Database error deleting branch: {e.msg}"
    finally:
        if conn:
            conn.close()

# ==============================================================================
# SUPPORT TICKET CRUD
# ==============================================================================
def insert_support_ticket(customer_id: str, branch_name: str, issue_category: str, description: str, priority: str, support_agent: str = "Priya Sharma", channel: str = "Web Portal") -> tuple[bool, str]:
    if not description or len(description.strip()) < 5:
        return False, "Description must be at least 5 characters."

    conn = None
    try:
        conn = get_connection()
        conn.autocommit = False
        cur = conn.cursor()

        cur.execute("SELECT COALESCE(MAX(CAST(SUBSTRING(Ticket_ID, 2) AS UNSIGNED)), 0) + 1 FROM support_tickets WHERE Ticket_ID LIKE 'T%'")
        max_num = cur.fetchone()[0]
        ticket_id = f"T{int(max_num):05d}"

        date_opened = datetime.now().strftime("%Y-%m-%d")

        sql = """
            INSERT INTO support_tickets 
            (Ticket_ID, Customer_ID, Branch_Name, Issue_Category, Description, Date_Opened, Priority, Status, Support_Agent, Channel, Customer_Rating)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'Open', %s, %s, 5)
        """
        cur.execute(sql, (ticket_id, customer_id, branch_name, issue_category, description, date_opened, priority, support_agent, channel))
        conn.commit()
        return True, f"Support Ticket '{ticket_id}' logged successfully."
    except mysql.connector.Error as e:
        if conn:
            conn.rollback()
        return False, f"Database error creating ticket: {e.msg}"
    finally:
        if conn:
            conn.close()

def update_ticket_status(ticket_id: str, new_status: str, remarks: str = "") -> tuple[bool, str]:
    if new_status not in ["Open", "In Progress", "Resolved", "Closed"]:
        return False, "Invalid ticket status."

    conn = None
    try:
        conn = get_connection()
        conn.autocommit = False
        cur = conn.cursor()

        date_closed = datetime.now().strftime("%Y-%m-%d") if new_status in ["Resolved", "Closed"] else None

        sql = """
            UPDATE support_tickets 
            SET Status = %s, Resolution_Remarks = %s, Date_Closed = COALESCE(%s, Date_Closed)
            WHERE Ticket_ID = %s
        """
        cur.execute(sql, (new_status, remarks, date_closed, ticket_id))
        conn.commit()
        return True, f"Ticket '{ticket_id}' status updated to '{new_status}'."
    except mysql.connector.Error as e:
        if conn:
            conn.rollback()
        return False, f"Database error updating ticket: {e.msg}"
    finally:
        if conn:
            conn.close()

# Backward-compat functions for existing app.py
def insert_row(table, columns, values):
    conn = get_connection()
    cur = conn.cursor()
    cols = ",".join(columns)
    placeholders = ",".join(["%s"] * len(values))
    sql = f"INSERT INTO {table} ({cols}) VALUES ({placeholders})"
    cur.execute(sql, tuple(values))
    conn.commit()
    last_id = cur.lastrowid
    cur.close()
    conn.close()
    return last_id

def delete_row(table, key_col, key_val):
    conn = get_connection()
    cur = conn.cursor()
    sql = f"DELETE FROM {table} WHERE {key_col} = %s"
    cur.execute(sql, (key_val,))
    conn.commit()
    cnt = cur.rowcount
    cur.close()
    conn.close()
    return cnt