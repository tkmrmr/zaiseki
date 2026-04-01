#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))
import pymysql
from common import get_db_connection, print_json

print("Content-Type: application/json; charset=utf-8")
print()

QUERY = """
    SELECT
        seats.seat_id, 
        seats.seat_number, 
        presence_status.status, 
        presence_status.updated_at
    FROM seats
    LEFT JOIN presence_status
        ON presence_status.seat_id = seats.seat_id
    ORDER BY seats.seat_id
    ;
"""

try:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(QUERY)

            seats = []
            for seat_id, seat_number, status, updated_at in cur:
                if status is None:
                    status = "vacant"
                seats.append(
                    {
                        "id": seat_id,
                        "code": seat_number,
                        "status": status,
                        "updated_at": updated_at.isoformat() if updated_at else None,
                    }
                )

    print_json({"ok": True, "seats": seats})

except pymysql.Error as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Database error"})

except Exception as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Internal error"})
