# simulate.py
from db import get_connection

def get_balance(account_id):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT account_balance FROM accounts WHERE account_id = %s", (account_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row['account_balance'] if row else None

def set_balance(account_id, new_balance):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE accounts SET account_balance = %s, last_updated = NOW() WHERE account_id = %s",
                (new_balance, account_id))
    conn.commit()
    cur.close()
    conn.close()
    return True