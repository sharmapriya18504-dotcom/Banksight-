"""
BankSight Credit/Debit Simulation Engine
Simulates real-world banking ledger operations with atomic ACID transactions,
strict balance validation, and automated transaction log generation.
"""

from db import get_connection
import mysql.connector
from datetime import datetime
import secrets

def get_eligible_accounts():
    """
    Fetches list of active accounts with associated customer profiles.
    """
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor(dictionary=True)
        sql = """
            SELECT 
                a.customer_id,
                c.name,
                c.city,
                c.account_type,
                a.account_balance,
                a.last_updated
            FROM accounts a
            JOIN customers c ON a.customer_id = c.customer_id
            ORDER BY a.account_balance DESC
        """
        cur.execute(sql)
        rows = cur.fetchall()
        import pandas as pd
        return pd.DataFrame(rows)
    except Exception as e:
        print(f"Error fetching accounts: {e}")
        import pandas as pd
        return pd.DataFrame()
    finally:
        if conn:
            conn.close()

def get_balance(customer_id: str):
    """
    Fetches current balance for a customer account.
    """
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT account_balance FROM accounts WHERE customer_id = %s", (customer_id.strip(),))
        row = cur.fetchone()
        return float(row["account_balance"]) if row else None
    except Exception as e:
        print(f"Error checking balance: {e}")
        return None
    finally:
        if conn:
            conn.close()

def set_balance(customer_id: str, new_balance: float):
    """
    Legacy helper: updates balance directly with timestamp.
    """
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE accounts SET account_balance = %s, last_updated = NOW() WHERE customer_id = %s",
            (new_balance, customer_id.strip())
        )
        conn.commit()
        return True
    except Exception as e:
        print(f"Error setting balance: {e}")
        return False
    finally:
        if conn:
            conn.close()

def execute_simulation_transaction(customer_id: str, action: str, amount: float) -> dict:
    """
    Atomically updates account balance and creates a corresponding transaction entry.
    Rolls back both operations on any error or insufficient balance.
    
    Returns:
        dict: {
            "success": bool,
            "message": str,
            "txn_id": str or None,
            "customer_id": str,
            "action": str,
            "amount": float,
            "previous_balance": float or None,
            "new_balance": float or None,
            "timestamp": str
        }
    """
    result = {
        "success": False,
        "message": "",
        "txn_id": None,
        "customer_id": customer_id,
        "action": action,
        "amount": amount,
        "previous_balance": None,
        "new_balance": None,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    # 1. Input Validation
    if not customer_id or len(customer_id.strip()) == 0:
        result["message"] = "Invalid Account: Customer ID is required."
        return result

    if amount is None or amount <= 0:
        result["message"] = "Invalid Transaction: Amount must be greater than ₹0.00."
        return result

    if amount > 10000000:
        result["message"] = "Security Alert: Single simulation transaction exceeds regulatory limit of ₹1 Crore."
        return result

    action_norm = action.strip().capitalize()
    if action_norm not in ["Deposit", "Withdrawal"]:
        result["message"] = f"Invalid Action: '{action}'. Must be 'Deposit' or 'Withdrawal'."
        return result

    conn = None
    try:
        conn = get_connection()
        conn.autocommit = False
        cur = conn.cursor(dictionary=True)

        # 2. Lock the account row for update (prevents race conditions)
        cur.execute("SELECT account_balance FROM accounts WHERE customer_id = %s FOR UPDATE", (customer_id.strip(),))
        acc_row = cur.fetchone()

        if not acc_row:
            conn.rollback()
            result["message"] = f"Account not found for Customer ID '{customer_id}'."
            return result

        current_balance = float(acc_row["account_balance"])
        result["previous_balance"] = current_balance

        # 3. Check business rules
        MINIMUM_BALANCE = 1000.0
        if action_norm == "Deposit":
            new_balance = current_balance + float(amount)
            txn_type = "deposit"
        else:  # Withdrawal
            if current_balance < float(amount):
                conn.rollback()
                result["message"] = f"Transaction Declined: Insufficient balance. Available: ₹{current_balance:,.2f}, Requested: ₹{amount:,.2f}."
                return result
            if (current_balance - float(amount)) < MINIMUM_BALANCE:
                conn.rollback()
                remaining = current_balance - float(amount)
                result["message"] = f"Transaction Declined: Enforcing minimum balance rule. Account balance cannot drop below ₹1,000.00 (Available: ₹{current_balance:,.2f}, Requested: ₹{amount:,.2f}, Remaining would be: ₹{remaining:,.2f})."
                return result
            new_balance = current_balance - float(amount)
            txn_type = "withdrawal"

        result["new_balance"] = new_balance

        # 4. Generate unique transaction identifier (TXN + timestamp + 4 random hex digits <= 30 chars)
        now_ts = datetime.now().strftime("%Y%m%d%H%M%S")
        rand_suffix = secrets.token_hex(2).upper()
        txn_id = f"TXN{now_ts}{rand_suffix}"
        result["txn_id"] = txn_id

        # 5. Atomically update account balance
        update_sql = """
            UPDATE accounts 
            SET account_balance = %s, last_updated = NOW() 
            WHERE customer_id = %s
        """
        cur.execute(update_sql, (new_balance, customer_id.strip()))

        # 6. Atomically insert transaction record into transactions table
        insert_sql = """
            INSERT INTO transactions (txn_id, customer_id, txn_type, amount, txn_time, status)
            VALUES (%s, %s, %s, %s, NOW(), 'success')
        """
        cur.execute(insert_sql, (txn_id, customer_id.strip(), txn_type, float(amount)))

        # 7. Commit both operations atomically
        conn.commit()
        result["success"] = True
        result["message"] = f"{action_norm} of ₹{amount:,.2f} processed successfully! New Balance: ₹{new_balance:,.2f}."
        return result

    except mysql.connector.Error as e:
        if conn:
            try:
                conn.rollback()
            except Exception:
                pass
        result["message"] = f"Database operation failed and was rolled back: {e.msg}"
        return result
    except Exception as e:
        if conn:
            try:
                conn.rollback()
            except Exception:
                pass
        result["message"] = f"Unexpected error during transaction: {str(e)}"
        return result
    finally:
        if conn:
            try:
                conn.close()
            except Exception:
                pass

def get_account_recent_transactions(customer_id: str, limit: int = 5):
    """
    Fetches the most recent transactions for a customer.
    """
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            SELECT txn_id, txn_type, amount, txn_time, status 
            FROM transactions 
            WHERE customer_id = %s 
            ORDER BY txn_time DESC 
            LIMIT %s
        """, (customer_id.strip(), limit))
        rows = cur.fetchall()
        import pandas as pd
        return pd.DataFrame(rows)
    except Exception as e:
        print(f"Error fetching recent txns: {e}")
        import pandas as pd
        return pd.DataFrame()
    finally:
        if conn:
            conn.close()