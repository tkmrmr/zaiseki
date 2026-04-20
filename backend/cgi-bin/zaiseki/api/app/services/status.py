from app.db.queries import presence_queries, seat_queries

from ..schemas import (
    Seat,
    SeatStatusWithoutVacant,
)


def list_public_status() -> list[Seat]:
    return seat_queries.read_seats_with_public_status()


def list_full_status() -> list[Seat]:
    return seat_queries.read_seats_with_full_status()


def update_seat_status(seat_id: int, new_status: SeatStatusWithoutVacant) -> bool:
    is_updated = presence_queries.update_presence_status(seat_id, new_status)
    return is_updated
