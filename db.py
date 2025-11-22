import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Priya@123",   
        database="banksight",
        port=3307        
    )