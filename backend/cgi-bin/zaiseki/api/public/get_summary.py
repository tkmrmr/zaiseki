#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
from datetime import datetime, timezone

sys.path.append(os.pardir)
import pymysql
import pymysql.cursors
from common import get_db_connection, print_json

print("Content-Type: application/json; charset=utf-8")
print()

QUERY = """
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

try:
    with get_db_connection() as conn:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            updated_at = datetime.now(timezone.utc).isoformat()
            cur.execute(QUERY)
            row = cur.fetchone()

    summary = {
        "present_count": int(row["present_count"]),
        "absent_count": int(row["absent_count"]),
        "null_count": int(row["null_count"]),
        "total_seats": int(row["total_seats"]),
    }

    print_json({"ok": True, "summary": summary, "updated_at": updated_at})

except pymysql.Error as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Database error"})

except Exception as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Internal error"})
