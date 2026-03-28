#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys
from datetime import datetime, timezone

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

    updated_at = datetime.now(timezone.utc).isoformat()

    query = """
    SELECT
        COALESCE(SUM(status = 'present'), 0) AS present_count,
        COALESCE(SUM(status = 'absent'), 0) AS absent_count,
        COALESCE(SUM(status IS NULL), 0) AS null_count,
        COUNT(seats.seat_id) AS total_seats
    FROM seats
    LEFT JOIN presence_status
        ON presence_status.seat_id = seats.seat_id
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

    print(json.dumps({"ok": True, "summary": summary, "updated_at": updated_at}, ensure_ascii=False))

except mysql.connector.Error as e:
    print(e, file=sys.stderr)
    print(json.dumps({"ok": False, "error": "Database error"}, ensure_ascii=False))

except Exception as e:
    print(e, file=sys.stderr)
    print(json.dumps({"ok": False, "error": "Internal error"}, ensure_ascii=False))

finally:
    if conn is not None:
        conn.close()
