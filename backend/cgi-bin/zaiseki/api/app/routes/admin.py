from dataclasses import asdict

from flask import Blueprint, request
from werkzeug.exceptions import BadRequest, NotFound

from ..schemas import AssignStudentRequest
from ..services import (
    assign_student_to_seat,
    list_full_status,
    list_students,
    unassign_student_from_seat,
)
from ..utils import (
    is_valid_positive_int,
    parse_request,
)

bp = Blueprint("admin", __name__, url_prefix="/admin")


@bp.get("/get_status")
def get_status() -> dict:
    seats = list_full_status()
    return {"ok": True, "seats": [asdict(s) for s in seats]}


@bp.get("/get_students")
def get_students() -> dict:
    students = list_students()
    return {"ok": True, "students": [asdict(s) for s in students]}


@bp.post("/assign_student")
def assign_student() -> dict | tuple[dict, int]:
    try:
        raw_data = request.get_json()
    except BadRequest:
        return {"ok": False, "error": "Invalid JSON"}, 400

    data = parse_request(raw_data, AssignStudentRequest)
    if data is None:
        return {"ok": False, "error": "Invalid request payload"}, 400

    seat_id = data.seat_id
    student_id = data.student_id
    if not is_valid_positive_int(seat_id):
        return {"ok": False, "error": "Invalid seat_id"}, 400
    if not is_valid_positive_int(student_id):
        return {"ok": False, "error": "Invalid student_id"}, 400

    try:
        assign_student_to_seat(student_id, seat_id)
        return {"ok": True}
    except NotFound as e:
        return {"ok": False, "error": str(e)}, 404


@bp.delete("/unassign_student/<int:seat_id>")
def unassign_student(seat_id: int) -> dict | tuple[dict, int]:
    if not is_valid_positive_int(seat_id):
        return {"ok": False, "error": "Invalid seat_id"}, 400
    unassign_student_from_seat(seat_id)

    return {"ok": True}
