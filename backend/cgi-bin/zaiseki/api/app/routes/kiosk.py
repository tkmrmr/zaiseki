from flask import Blueprint, request
from werkzeug.exceptions import BadRequest

from ..schemas import NewStatusRequest
from ..services import list_full_status, update_seat_status
from ..utils import (
    is_valid_positive_int,
    parse_request,
)

ALLOWED_STATUS = {"present", "absent"}


bp = Blueprint("kiosk", __name__, url_prefix="/kiosk")


@bp.get("/get_status")
def get_status() -> dict:
    seats = list_full_status()
    return {"ok": True, "seats": seats}


@bp.patch("/update_status/<int:seat_id>")
def update_status(seat_id: int) -> dict | tuple[dict, int]:
    if not is_valid_positive_int(seat_id):
        return {"ok": False, "error": "Invalid seat_id"}, 400

    try:
        raw_data = request.get_json()
    except BadRequest:
        return {"ok": False, "error": "Invalid JSON"}, 400

    data = parse_request(raw_data, NewStatusRequest)
    if data is None:
        return {"ok": False, "error": "Invalid request payload"}, 400

    new_status = data.new_status
    if new_status not in ALLOWED_STATUS:
        return {"ok": False, "error": "Invalid status"}, 400

    result = update_seat_status(seat_id, new_status)
    if not result.ok:
        return {
            "ok": False,
            "error": result.error,
        }, 404

    return {"ok": True}
