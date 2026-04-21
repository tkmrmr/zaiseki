from flask import Blueprint

from app.services import status_service

bp = Blueprint("public", __name__)


@bp.get("/get_status")
def get_status() -> dict:
    seats = status_service.list_public_status()
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
