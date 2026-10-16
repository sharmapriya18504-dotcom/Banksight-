"""
BankSight Automated Test Suite: Validation & Simulation Rules
Tests input validation, ACID transaction atomicity, ledger rules, and foreign key safeguards.
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import unittest
from crud import validate_customer_data, delete_customer
from simulate import execute_simulation_transaction, get_balance, get_eligible_accounts
from helpers import format_currency, format_number

class TestBankSightValidation(unittest.TestCase):

    def test_01_customer_validation_rules(self):
        """Test customer input validation boundary rules."""
        # Valid input
        ok, msg = validate_customer_data("C9999", "Test User", 30, "M", "Delhi", "Savings")
        self.assertTrue(ok, f"Expected valid customer to pass: {msg}")

        # Empty ID
        ok, msg = validate_customer_data("", "Test User", 30, "M", "Delhi", "Savings")
        self.assertFalse(ok)
        self.assertIn("Customer ID", msg)

        # Underage
        ok, msg = validate_customer_data("C9999", "Test User", 16, "M", "Delhi", "Savings")
        self.assertFalse(ok)
        self.assertIn("Age", msg)

        # Invalid Gender
        ok, msg = validate_customer_data("C9999", "Test User", 30, "X", "Delhi", "Savings")
        self.assertFalse(ok)
        self.assertIn("Gender", msg)

        # Invalid Account Type
        ok, msg = validate_customer_data("C9999", "Test User", 30, "M", "Delhi", "Crypto")
        self.assertFalse(ok)
        self.assertIn("Account Type", msg)

    def test_02_simulation_input_validation(self):
        """Test simulation rejects invalid transaction amounts or actions."""
        res_zero = execute_simulation_transaction("C0003", "Deposit", 0.0)
        self.assertFalse(res_zero["success"])
        self.assertIn("greater than", res_zero["message"])

        res_neg = execute_simulation_transaction("C0003", "Deposit", -50.0)
        self.assertFalse(res_neg["success"])

        res_act = execute_simulation_transaction("C0003", "TransferDirect", 100.0)
        self.assertFalse(res_act["success"])
        self.assertIn("Invalid Action", res_act["message"])

    def test_03_simulation_insufficient_balance_rollback(self):
        """Test that attempting to withdraw more than available balance is declined without changing balance."""
        accounts = get_eligible_accounts()
        self.assertFalse(accounts.empty, "Eligible accounts must not be empty.")
        cust_id = accounts.iloc[0]["customer_id"]
        start_bal = get_balance(cust_id)

        # Attempt massive overdraft
        overdraft_amt = start_bal + 5000000.0
        res = execute_simulation_transaction(cust_id, "Withdrawal", overdraft_amt)
        self.assertFalse(res["success"], "Overdraft transaction should have been declined.")
        self.assertIn("Insufficient balance", res["message"])

        # Verify balance unchanged
        end_bal = get_balance(cust_id)
        self.assertAlmostEqual(start_bal, end_bal, places=2, msg="Account balance must remain unchanged after declined withdrawal.")

    def test_04_simulation_deposit_and_withdrawal_cycle(self):
        """Test atomic deposit and subsequent withdrawal with ledger audit."""
        accounts = get_eligible_accounts()
        cust_id = accounts.iloc[0]["customer_id"]
        start_bal = get_balance(cust_id)

        test_amt = 250.0

        # Step 1: Deposit
        dep_res = execute_simulation_transaction(cust_id, "Deposit", test_amt)
        self.assertTrue(dep_res["success"], f"Deposit failed: {dep_res['message']}")
        self.assertIsNotNone(dep_res["txn_id"])
        self.assertAlmostEqual(dep_res["new_balance"], start_bal + test_amt, places=2)

        # Step 2: Withdrawal to restore original balance
        with_res = execute_simulation_transaction(cust_id, "Withdrawal", test_amt)
        self.assertTrue(with_res["success"], f"Withdrawal failed: {with_res['message']}")
        self.assertAlmostEqual(with_res["new_balance"], start_bal, places=2)

    def test_05_formatters(self):
        """Test currency and number formatting helpers."""
        self.assertEqual(format_number(1234567), "1,234,567")
        self.assertEqual(format_number(None), "0")
        self.assertIn("Cr", format_currency(15000000))
        self.assertIn("L", format_currency(350000))
        self.assertEqual(format_currency(None), "₹0.00")

    def test_06_fk_delete_protection(self):
        """Verify that attempting to delete an active customer with linked accounts is blocked."""
        del_ok, del_msg = delete_customer("C0003")
        self.assertFalse(del_ok, "Active customer with accounts must not be deleted directly.")
        self.assertIn("FK Constraint", del_msg)

    def test_07_simulation_minimum_balance_rule(self):
        """Verify that withdrawal leaving less than ₹1,000 is rejected and balance is preserved."""
        accounts = get_eligible_accounts()
        cust_id = accounts.iloc[0]["customer_id"]
        start_bal = get_balance(cust_id)

        # Attempt withdrawal that leaves less than 1000 (e.g. leaves 500)
        violating_withdrawal = start_bal - 500.0
        if violating_withdrawal > 0:
            res = execute_simulation_transaction(cust_id, "Withdrawal", violating_withdrawal)
            self.assertFalse(res["success"], "Withdrawal violating ₹1,000 minimum balance should fail.")
            self.assertIn("minimum balance", res["message"].lower())
            
            # Verify balance is preserved
            current_bal = get_balance(cust_id)
            self.assertAlmostEqual(start_bal, current_bal, places=2)

if __name__ == "__main__":
    unittest.main()
