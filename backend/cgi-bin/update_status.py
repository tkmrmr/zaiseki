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
    length = int(os.environ.get("CONTENT_LENGTH", 0))
    body = sys.stdin.read(length) if length > 0 else ""
    data = json.loads(body)

    seat_id = data.get("seat_id")
    status = data.get("status").strip()

    if not seat_id or not status:
        raise ValueError("seat_id/status is required")

    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
    )
    cur = conn.cursor()
    cur.execute(
        "UPDATE presence_status SET status = %s WHERE seat_id = %s", (status, seat_id)
    )
    conn.commit()

    print(json.dumps({"ok": True}, ensure_ascii=False))

except mysql.connector.Error as e:
    print(e, file=sys.stderr)
    print(json.dumps({"ok": False, "error": "Database error"}, ensure_ascii=False))

except Exception as e:
    print(e, file=sys.stderr)
    print(json.dumps({"ok": False, "error": "Internal error"}, ensure_ascii=False))

finally:
    if conn is not None:
        conn.close()
