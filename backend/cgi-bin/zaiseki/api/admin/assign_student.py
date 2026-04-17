#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))
import pymysql
from common import (
    AssignStudentRequest,
    get_db_connection,
    parse_positive_int,
    read_json_body,
    send_json,
)

try:
    payload = read_json_body()
    try:
        data = AssignStudentRequest(**payload)
    except TypeError:
        send_json({"ok": False, "error": "Invalid request"})
        sys.exit(0)

    seat_id = parse_positive_int(data.seat_id, "seat_id")
    student_id = parse_positive_int(data.student_id, "student_id")

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
