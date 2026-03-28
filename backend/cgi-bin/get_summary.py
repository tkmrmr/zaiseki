#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys

import mysql.connector

print("Content-Type: application/json; charset=utf-8")
print()

conn = None
try:
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
    )
    cur = conn.cursor(dictionary=True)

    query = """
    SELECT
        SUM(status = 'present') AS present_count,
        SUM(status = 'absent') AS absent_count,
        SUM(status IS NULL) AS null_count,
        COUNT(seats.seat_id) AS total_seats
    FROM seats
    LEFT JOIN presence_status
        ON presence_status.seat_id = seats.seat_id
    LEFT JOIN students
        ON students.student_id = presence_status.student_id
    ;
    """

    cur.execute(query)
    row = cur.fetchone()

    summary = {
        "present_count": int(row["present_count"]),
        "absent_count": int(row["absent_count"]),
        "null_count": int(row["null_count"]),
        "total_seats": int(row["total_seats"]),
    }

    print(json.dumps({"ok": True, "summary": summary}, ensure_ascii=False))

except mysql.connector.Error as e:
    print(e, file=sys.stderr)
    print(json.dumps({"ok": False, "error": "Database error"}, ensure_ascii=False))

except Exception as e:
    print(e, file=sys.stderr)
    print(json.dumps({"ok": False, "error": "Internal error"}, ensure_ascii=False))

finally:
    if conn is not None:
        conn.close()
