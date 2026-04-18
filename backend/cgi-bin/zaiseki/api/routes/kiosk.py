import datetime
import os
import random
import sys
from dataclasses import asdict

from flask import Blueprint, request
from werkzeug.exceptions import BadRequest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))
import pymysql
from common import (
    NewStatusRequest,
    parse_request,
    send_message,
)
from services import list_full_status, update_seat_status

ALLOWED_STATUS = {"present", "absent"}
GREETINGS = {
    "morning": ["おはよう", "おはよ", "やあ"],
    "afternoon": ["こんにちは", "やあ", "どうも"],
    "evening": ["こんばんは", "おつかれ", "どうも"],
}

bp = Blueprint("kiosk", __name__, url_prefix="/kiosk")


@bp.get("/get_status")
def get_status() -> dict:
    seats = list_full_status()
    return {"ok": True, "seats": [asdict(s) for s in seats]}


@bp.put("/update_status")
def update_status() -> dict | tuple[dict, int]:
    try:
        raw_data = request.get_json()
    except BadRequest:
        return {"ok": False, "error": "Invalid JSON"}, 400

    data = parse_request(raw_data, NewStatusRequest)
    if data is None:
        return {"ok": False, "error": "Invalid request payload"}, 400

    seat_id = data.seat_id
    new_status = data.new_status
    if not isinstance(seat_id, int) or seat_id <= 0:
        return {"ok": False, "error": "Invalid seat_id"}, 400
    if new_status not in ALLOWED_STATUS:
        return {"ok": False, "error": "Invalid status"}, 400

    is_updated = update_seat_status(seat_id, new_status)
    if not is_updated:
        return {"ok": False, "error": "Failed to update status"}, 500

    dt_now = datetime.datetime.now()
    if 5 <= dt_now.hour < 12:
        greeting = random.choice(GREETINGS["morning"])
    elif 12 <= dt_now.hour < 18:
        greeting = random.choice(GREETINGS["afternoon"])
    else:
        greeting = random.choice(GREETINGS["evening"])

    # BOCCOに挨拶を送る
    if new_status == "present":
        send_message(greeting)

    return {"ok": True}


@bp.errorhandler(pymysql.Error)
def handle_db_error(error: Exception) -> tuple[dict, int]:
    print(error, file=sys.stderr)
    return {"ok": False, "error": "Database error"}, 500


@bp.errorhandler(Exception)
def handle_internal_error(error: Exception) -> tuple[dict, int]:
    print(error, file=sys.stderr)
    return {"ok": False, "error": "Internal error"}, 500
