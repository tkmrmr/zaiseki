#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))
import pymysql
from common import send_json
from services import list_public_status

try:
    seats = list_public_status()
    send_json(
        {
            "ok": True,
            "seats": [
                {
                    "id": s.id,
                    "code": s.code,
                    "status": s.status,
                    "updated_at": s.updated_at,
                }
                for s in seats
            ],
        }
    )

except pymysql.Error as e:
    print(e, file=sys.stderr)
    send_json({"ok": False, "error": "Database error"})

except Exception as e:
    print(e, file=sys.stderr)
    send_json({"ok": False, "error": "Internal error"})
