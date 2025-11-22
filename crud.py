# crud.py
from db import get_connection

def insert_row(table, columns, values):
    conn = get_connection()
    cur = conn.cursor()
    cols = ",".join(columns)
    placeholders = ",".join(["%s"] * len(values))
    sql = f"INSERT INTO {table} ({cols}) VALUES ({placeholders})"
    cur.execute(sql, tuple(values))
    conn.commit()
    cur.close()
    conn.close()
    return cur.lastrowid

def update_row(table, key_col, key_val, updates: dict):
    conn = get_connection()
    cur = conn.cursor()
    set_clause = ", ".join([f"{k}=%s" for k in updates.keys()])
    sql = f"UPDATE {table} SET {set_clause} WHERE {key_col} = %s"
    params = list(updates.values()) + [key_val]
    cur.execute(sql, tuple(params))
    conn.commit()
    cur.close()
    conn.close()
    return cur.rowcount

def delete_row(table, key_col, key_val):
    conn = get_connection()
    cur = conn.cursor()
    sql = f"DELETE FROM {table} WHERE {key_col} = %s"
    cur.execute(sql, (key_val,))
    conn.commit()
    cur.close()
    conn.close()
    return cur.rowcount