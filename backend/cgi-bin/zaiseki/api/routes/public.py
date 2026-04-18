from flask import Blueprint
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
