#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))
import pymysql
from common import AssignStudentRequest, get_db_connection, read_json_body, send_json

try:
    payload = read_json_body()
    try:
        data = AssignStudentRequest(**payload)
    except TypeError:
        send_json({"ok": False, "error": "Invalid request"})
        sys.exit(0)

    try:
        seat_id = int(data.seat_id)
        if seat_id <= 0:
            raise ValueError
    except (TypeError, ValueError):
        send_json({"ok": False, "error": "Invalid seat_id"})
        sys.exit(0)

    try:
        student_id = int(data.student_id)
        if student_id <= 0:
            raise ValueError
    except (TypeError, ValueError):
        send_json({"ok": False, "error": "Invalid student_id"})
        sys.exit(0)

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT student_id FROM students WHERE student_id = %s", (student_id,)
            )
            result = cur.fetchone()
            if not result:
                send_json({"ok": False, "error": "Student not found"})
                sys.exit(0)

            cur.execute("DELETE FROM presence_status WHERE seat_id = %s", (seat_id,))
            cur.execute(
                "DELETE FROM presence_status WHERE student_id = %s", (student_id,)
            )
            cur.execute(
                "INSERT INTO presence_status (student_id, seat_id, status) VALUES (%s, %s, 'absent')",
                (student_id, seat_id),
            )
            conn.commit()

    send_json({"ok": True})

except json.JSONDecodeError:
    send_json({"ok": False, "error": "Invalid JSON"})

except pymysql.Error as e:
    print(e, file=sys.stderr)
    send_json({"ok": False, "error": "Database error"})

except Exception as e:
    print(e, file=sys.stderr)
    send_json({"ok": False, "error": "Internal error"})
