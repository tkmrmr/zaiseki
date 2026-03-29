import contextlib
import os

import mysql.connector


@contextlib.contextmanager
def get_db_connection():
    conn = None
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "db"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
        )
        yield conn
    finally:
        if conn is not None:
            conn.close()
