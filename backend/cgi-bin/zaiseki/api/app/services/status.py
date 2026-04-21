import datetime
import random
from dataclasses import dataclass

from app.db import get_db
from app.db.queries import presence_queries, seat_queries
from app.schemas import (
    Seat,
    SeatStatusWithoutVacant,
)
from app.utils import (
    send_message,
)

GREETINGS = {
    "morning": ["おはよう", "おはよ", "やあ"],
    "afternoon": ["こんにちは", "やあ", "どうも"],
    "evening": ["こんばんは", "おつかれ", "どうも"],
}


@dataclass
class UpdateStatusResult:
    ok: bool
    error: str | None = None


def _select_greeting() -> str:
    dt_now = datetime.datetime.now()
    if 5 <= dt_now.hour < 12:
        greeting = random.choice(GREETINGS["morning"])
    elif 12 <= dt_now.hour < 18:
        greeting = random.choice(GREETINGS["afternoon"])
    else:
        greeting = random.choice(GREETINGS["evening"])
    return greeting


def list_public_status() -> list[Seat]:
    conn = get_db()
    return seat_queries.read_seats_with_public_status(conn)


def list_full_status() -> list[Seat]:
    conn = get_db()
    return seat_queries.read_seats_with_full_status(conn)


def update_seat_status(
    seat_id: int, new_status: SeatStatusWithoutVacant
) -> UpdateStatusResult:
    conn = get_db()
    is_updated = presence_queries.update_presence_status(conn, seat_id, new_status)
    if not is_updated:
        return UpdateStatusResult(ok=False, error="Seat not found or not assigned")
    conn.commit()

    # BOCCOに挨拶を送る
    if new_status == "present":
        send_message(_select_greeting())

    return UpdateStatusResult(ok=True)
