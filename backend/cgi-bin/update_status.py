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

    seat_id = data.get("seat_id")
    raw_status = data.get("status")

    if not seat_id or not isinstance(raw_status, str) or not raw_status.strip():
        print_json({"ok": False, "error": "seat_id/status is required"})
        sys.exit(0)

    status = raw_status.strip()

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE presence_status SET status = %s WHERE seat_id = %s",
                (status, seat_id),
            )
            conn.commit()

    print_json({"ok": True})

except mysql.connector.Error as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Database error"})

except Exception as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Internal error"})
