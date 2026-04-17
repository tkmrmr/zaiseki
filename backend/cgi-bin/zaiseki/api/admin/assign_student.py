#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))
import pymysql
from common import (
    AssignStudentRequest,
    parse_positive_int,
    read_json_body,
    send_json,
)
from services import assign_student_to_seat

try:
    try:
        data = read_json_body(AssignStudentRequest)
    except TypeError:
        send_json({"ok": False, "error": "Invalid request"})
        sys.exit(0)

    seat_id = parse_positive_int(data.seat_id, "seat_id")
    student_id = parse_positive_int(data.student_id, "student_id")

    assign_student_to_seat(student_id, seat_id)

    send_json({"ok": True})

except json.JSONDecodeError:
    send_json({"ok": False, "error": "Invalid JSON"})

except pymysql.Error as e:
    print(e, file=sys.stderr)
    send_json({"ok": False, "error": "Database error"})

except Exception as e:
    print(e, file=sys.stderr)
    send_json({"ok": False, "error": "Internal error"})
