#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))
import pymysql
from common import get_db_connection, print_json, sent_message

print("Content-Type: application/json; charset=utf-8")
print()

ALLOWED_STATUS = {"present", "absent"}

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

    new_status = (
        data.get("new_status", "").strip()
        if isinstance(data.get("new_status"), str)
        else ""
    )
    if not new_status or new_status not in ALLOWED_STATUS:
        print_json({"ok": False, "error": "Invalid new_status"})
        sys.exit(0)

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE presence_status SET status = %s WHERE seat_id = %s",
                (new_status, seat_id),
            )
            conn.commit()

    if new_status == "present":
        sent_message("おはよう")

    print_json({"ok": True})

except json.JSONDecodeError:
    print_json({"ok": False, "error": "Invalid JSON"})

except pymysql.Error as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Database error"})

except Exception as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Internal error"})
