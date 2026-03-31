#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys

import mysql.connector
from common.get_db_connection import get_db_connection
from common.print_json import print_json

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

except mysql.connector.Error as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Database error"})

except Exception as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Internal error"})
