import os
import sys

from flask import Blueprint, jsonify

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))
import pymysql
from services import list_public_status

bp = Blueprint("public", __name__, url_prefix="/public")


@bp.get("/get_status")
def get_status():
    seats = list_public_status()
    return jsonify(
        ok=True,
        seats=[
            {
                "id": s.id,
                "code": s.code,
                "status": s.status,
                "updated_at": s.updated_at,
            }
            for s in seats
        ],
    )


@bp.errorhandler(pymysql.Error)
def handle_db_error(error: pymysql.Error):
    print(error, file=sys.stderr)
    return jsonify(ok=False, error="Database error"), 500


@bp.errorhandler(Exception)
def handle_internal_error(error: Exception):
    print(error, file=sys.stderr)
    return jsonify(ok=False, error="Internal error"), 500
