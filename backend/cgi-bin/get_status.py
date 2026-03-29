#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import sys

import mysql.connector
from common.get_db_connection import get_db_connection

print("Content-Type: application/json; charset=utf-8")
print()

QUERY = """
    SELECT
        seats.seat_id, 
        seats.seat_number, 
        students.name, 
        students.grade, 
        presence_status.status, 
        presence_status.updated_at
    FROM seats
    LEFT JOIN presence_status
        ON presence_status.seat_id = seats.seat_id
    LEFT JOIN students
        ON students.student_id = presence_status.student_id
    ORDER BY seats.seat_id
    ;
"""

try:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(QUERY)

            seats = []
            for seat_id, seat_number, name, grade, status, updated_at in cur:
                if status is None:
                    status = "vacant"
                seats.append(
                    {
                        "id": seat_id,
                        "code": seat_number,
                        "familyName": name,
                        "grade": grade,
                        "status": status,
                        # "updated_at": updated_at.isoformat() if updated_at else None,
                    }
                )

    print(json.dumps({"ok": True, "seats": seats}, ensure_ascii=False))

except mysql.connector.Error as e:
    print(e, file=sys.stderr)
    print(json.dumps({"ok": False, "error": "Database error"}, ensure_ascii=False))

except Exception as e:
    print(e, file=sys.stderr)
    print(json.dumps({"ok": False, "error": "Internal error"}, ensure_ascii=False))
