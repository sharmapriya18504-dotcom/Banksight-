# helpers.py
from db import get_connection
import pandas as pd

def load_table(table):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(f"SELECT * FROM `{table}`")
    rows = cur.fetchall()
    conn.close()
    return pd.DataFrame(rows)

def run_query(sql):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(sql)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return pd.DataFrame(rows)