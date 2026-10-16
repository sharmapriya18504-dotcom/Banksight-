"""
Database connection manager for BankSight.
Supports environment variables (.env), Streamlit secrets, and connection health diagnostics.
"""

import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

# Load local environment variables from .env if present
load_dotenv()

def get_db_config():
    """
    Retrieve database configuration safely.
    Priority:
    1. Streamlit secrets (st.secrets["mysql"] or st.secrets)
    2. Environment variables (.env or system env)
    3. Safe local defaults
    """
    config = {
        "host": "localhost",
        "port": 3307,
        "user": "root",
        "password": "Priya@123",
        "database": "banksight",
        "connect_timeout": 5
    }

    # Attempt to read from Streamlit secrets if running inside Streamlit
    try:
        import streamlit as st
        if hasattr(st, "secrets") and "mysql" in st.secrets:
            secrets_mysql = st.secrets["mysql"]
            config["host"] = secrets_mysql.get("host", config["host"])
            config["port"] = int(secrets_mysql.get("port", config["port"]))
            config["user"] = secrets_mysql.get("user", config["user"])
            config["password"] = secrets_mysql.get("password", config["password"])
            config["database"] = secrets_mysql.get("database", config["database"])
            return config
        elif hasattr(st, "secrets") and "DB_HOST" in st.secrets:
            config["host"] = st.secrets.get("DB_HOST", config["host"])
            config["port"] = int(st.secrets.get("DB_PORT", config["port"]))
            config["user"] = st.secrets.get("DB_USER", config["user"])
            config["password"] = st.secrets.get("DB_PASSWORD", config["password"])
            config["database"] = st.secrets.get("DB_NAME", config["database"])
            return config
    except Exception:
        pass

    # Read from environment variables
    config["host"] = os.getenv("DB_HOST", config["host"])
    config["port"] = int(os.getenv("DB_PORT", config["port"]))
    config["user"] = os.getenv("DB_USER", config["user"])
    config["password"] = os.getenv("DB_PASSWORD", config["password"])
    config["database"] = os.getenv("DB_NAME", config["database"])

    return config

def get_connection():
    """
    Establish and return a MySQL connection.
    Raises mysql.connector.Error on failure.
    """
    cfg = get_db_config()
    return mysql.connector.connect(
        host=cfg["host"],
        port=cfg["port"],
        user=cfg["user"],
        password=cfg["password"],
        database=cfg["database"],
        connect_timeout=cfg["connect_timeout"]
    )

def check_db_connection():
    """
    Check database connectivity and return diagnostic information.
    Returns:
        (is_connected: bool, message: str, details: dict)
    """
    cfg = get_db_config()
    masked_cfg = {
        "host": cfg["host"],
        "port": cfg["port"],
        "user": cfg["user"],
        "database": cfg["database"],
        "password_configured": bool(cfg["password"])
    }

    try:
        conn = get_connection()
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("SELECT VERSION(), DATABASE();")
            version, db_name = cursor.fetchone()
            
            cursor.execute("SHOW TABLES;")
            tables = [r[0] for r in cursor.fetchall()]
            
            cursor.close()
            conn.close()
            
            return True, "Database connected successfully.", {
                "version": version,
                "database": db_name,
                "tables_count": len(tables),
                "tables": tables,
                "config": masked_cfg
            }
    except Error as e:
        error_msg = f"Database connection error (Code {e.errno}): {e.msg}"
        return False, error_msg, {"config": masked_cfg, "error_code": e.errno}
    except Exception as e:
        return False, f"Unexpected connection error: {str(e)}", {"config": masked_cfg}