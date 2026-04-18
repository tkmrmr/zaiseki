import sys
from dataclasses import asdict

import pymysql
from common import (
    AssignStudentRequest,
    is_valid_positive_int,
    parse_request,
)
from flask import Blueprint, request
from services import (
    assign_student_to_seat,
    list_full_status,
    list_students,
    unassign_student_from_seat,
)
from werkzeug.exceptions import BadRequest, HTTPException
from werkzeug.sansio.response import Response

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

    is_assigned = assign_student_to_seat(student_id, seat_id)
    if not is_assigned:
        return {"ok": False, "error": "Student not found"}, 404

    return {"ok": True}


@bp.delete("/unassign_student/<int:seat_id>")
def unassign_student(seat_id: int) -> dict | tuple[dict, int]:
    if not is_valid_positive_int(seat_id):
        return {"ok": False, "error": "Invalid seat_id"}, 400

    unassign_student_from_seat(seat_id)

    return {"ok": True}


@bp.errorhandler(pymysql.Error)
def handle_db_error(error: Exception) -> tuple[dict, int]:
    print(error, file=sys.stderr)
    return {"ok": False, "error": "Database error"}, 500


@bp.errorhandler(Exception)
def handle_internal_error(error: Exception) -> Response | tuple[dict, int]:
    if isinstance(error, HTTPException):
        return error.get_response()
    print(error, file=sys.stderr)
    return {"ok": False, "error": "Internal error"}, 500
