"""
BankSight Automated Test Suite: Analytical SQL Queries
Tests database connectivity, table availability, and execution of all 15 analytical queries.
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import unittest
import pandas as pd
from db import check_db_connection, get_connection
import queries as q

class TestBankSightQueries(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.conn_ok, cls.msg, cls.diag = check_db_connection()

    def test_01_database_connection(self):
        """Verify database connectivity and health."""
        self.assertTrue(self.conn_ok, f"Database connection failed: {self.msg}")
        self.assertGreaterEqual(self.diag.get("tables_count", 0), 7, "Expected at least 7 database tables.")

    def test_02_required_tables_exist(self):
        """Verify all 7 core banking tables exist in schema."""
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SHOW TABLES;")
        tables = [r[0].lower() for r in cur.fetchall()]
        cur.close()
        conn.close()

        required = {"customers", "accounts", "transactions", "loans", "credit_cards", "branches", "support_tickets"}
        for tbl in required:
            self.assertIn(tbl, tables, f"Required table '{tbl}' not found in database.")

    def test_03_catalog_has_15_queries(self):
        """Verify the catalog contains exactly 15 analytical insights."""
        self.assertEqual(len(q.INSIGHTS_CATALOG), 15, "Expected 15 queries in INSIGHTS_CATALOG.")

    def test_04_execute_all_15_queries(self):
        """Execute every query in the catalog and verify DataFrame output and columns."""
        for qid, item in q.INSIGHTS_CATALOG.items():
            func = item["func"]
            try:
                df = func()
                self.assertIsInstance(df, pd.DataFrame, f"Query {qid} ({item['title']}) did not return a DataFrame.")
                self.assertFalse(df.empty, f"Query {qid} ({item['title']}) returned an empty DataFrame.")
                self.assertGreater(len(df.columns), 0, f"Query {qid} has zero columns.")
            except Exception as e:
                self.fail(f"Query {qid} ({item['title']}) failed with exception: {e}")

if __name__ == "__main__":
    unittest.main()
