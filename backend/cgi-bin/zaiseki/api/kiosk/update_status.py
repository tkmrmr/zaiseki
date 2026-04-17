#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import datetime
import json
import os
import random
import sys
from typing import cast

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))
import pymysql
from common import (
    NewStatusRequest,
    SeatStatusWithoutVacant,
    parse_positive_int,
    read_json_body,
    send_json,
    send_message,
)
from services import update_status

ALLOWED_STATUS = {"present", "absent"}
GREETINGS = {
    "morning": ["おはよう", "おはよ", "やあ"],
    "afternoon": ["こんにちは", "やあ", "どうも"],
    "evening": ["こんばんは", "おつかれ", "どうも"],
}

dt_now = datetime.datetime.now()
if 5 <= dt_now.hour < 12:
    greeting = random.choice(GREETINGS["morning"])
elif 12 <= dt_now.hour < 18:
    greeting = random.choice(GREETINGS["afternoon"])
else:
    greeting = random.choice(GREETINGS["evening"])

try:
    try:
        data = read_json_body(NewStatusRequest)
    except TypeError:
        send_json({"ok": False, "error": "Invalid request payload"})
        sys.exit(0)

    seat_id = parse_positive_int(data.seat_id, "seat_id")

    raw_new_status = data.new_status
    if not isinstance(raw_new_status, str):
        send_json({"ok": False, "error": "Invalid new_status"})
        sys.exit(0)

    new_status = raw_new_status.strip()
    if not new_status or new_status not in ALLOWED_STATUS:
        send_json({"ok": False, "error": "Invalid new_status"})
        sys.exit(0)

    update_status(seat_id, cast(SeatStatusWithoutVacant, new_status))

    if new_status == "present":
        try:
            send_message(greeting)
        except Exception as e:
            print(e, file=sys.stderr)

    send_json({"ok": True})

except json.JSONDecodeError:
    send_json({"ok": False, "error": "Invalid JSON"})

except pymysql.Error as e:
    print(e, file=sys.stderr)
    send_json({"ok": False, "error": "Database error"})

except Exception as e:
    print(e, file=sys.stderr)
    send_json({"ok": False, "error": "Internal error"})
