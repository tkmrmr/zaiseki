#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys

import mysql.connector
from common.get_db_connection import get_db_connection
from common.print_json import print_json

print("Content-Type: application/json; charset=utf-8")
print()

try:
    length = int(os.environ.get("CONTENT_LENGTH", 0))
    body = sys.stdin.read(length) if length > 0 else ""
    data = json.loads(body)

    try:
        seat_id = int(data.get("seat_id"))
        if seat_id <= 0:
            raise ValueError
    except (TypeError, ValueError):
        print_json({"ok": False, "error": "Invalid seat_id"})
        sys.exit(0)

    student_name = (
        data.get("student_name", "").strip()
        if isinstance(data.get("student_name"), str)
        else ""
    )
    if not student_name:
        print_json({"ok": False, "error": "Invalid student_name"})
        sys.exit(0)

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT student_id FROM students WHERE name = %s", (student_name,)
            )
            result = cur.fetchone()
            if not result:
                print_json({"ok": False, "error": "Student not found"})
                sys.exit(0)
            student_id = result[0]

            cur.execute("DELETE FROM presence_status WHERE seat_id = %s", (seat_id,))
            cur.execute(
                "DELETE FROM presence_status WHERE student_id = %s", (student_id,)
            )
            cur.execute(
                "INSERT INTO presence_status (student_id, seat_id, status) VALUES (%s, %s, 'absent')",
                (student_id, seat_id),
            )
            conn.commit()

    print_json({"ok": True})

except json.JSONDecodeError:
    print_json({"ok": False, "error": "Invalid JSON"})

except mysql.connector.Error as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Database error"})

except Exception as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Internal error"})
