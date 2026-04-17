#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
from dataclasses import asdict

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))
import pymysql
from common import send_json
from services import list_full_status

try:
    seats = list_full_status()
    send_json({"ok": True, "seats": [asdict(s) for s in seats]})

except pymysql.Error as e:
    print(e, file=sys.stderr)
    send_json({"ok": False, "error": "Database error"})

except Exception as e:
    print(e, file=sys.stderr)
    send_json({"ok": False, "error": "Internal error"})
