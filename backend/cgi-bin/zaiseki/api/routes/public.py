import os
import sys

from flask import Blueprint, Response
from werkzeug.exceptions import HTTPException

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))
import pymysql
from services import list_public_status

bp = Blueprint("public", __name__)


@bp.get("/get_status")
def get_status() -> dict:
    seats = list_public_status()
    return {
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
