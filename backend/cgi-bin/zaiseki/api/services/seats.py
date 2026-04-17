import sys

from common import (
    Seat,
    SeatStatusWithoutVacant,
    convert_to_utc_iso,
    get_db_connection,
    send_json,
)


def list_public_status() -> list[Seat]:
    QUERY = """
        SELECT
            seats.seat_id, 
            seats.seat_number, 
            presence_status.status, 
            presence_status.updated_at
        FROM seats
        LEFT JOIN presence_status
            ON presence_status.seat_id = seats.seat_id
        ORDER BY seats.seat_id
        ;
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(QUERY)

            seats: list[Seat] = []
            for seat_id, seat_number, status, updated_at in cur:
                if status is None:
                    status = "vacant"
                seats.append(
                    Seat(
                        id=seat_id,
                        code=seat_number,
                        status=status,
                        updated_at=convert_to_utc_iso(updated_at),
                    )
                )
    return seats


def list_full_status() -> list[Seat]:
    QUERY = """
        SELECT
            seats.seat_id, 
            seats.seat_number, 
            students.name, 
            students.grade, 
            presence_status.status, 
            presence_status.updated_at
        FROM seats
        LEFT JOIN presence_status
            ON presence_status.seat_id = seats.seat_id
        LEFT JOIN students
            ON students.student_id = presence_status.student_id
        ORDER BY seats.seat_id
        ;
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(QUERY)

            seats: list[Seat] = []
            for seat_id, seat_number, name, grade, status, updated_at in cur:
                if status is None:
                    status = "vacant"
                seats.append(
                    Seat(
                        id=seat_id,
                        code=seat_number,
                        family_name=name,
                        grade=grade,
                        status=status,
                        updated_at=convert_to_utc_iso(updated_at),
                    )
                )
    return seats


def update_status(seat_id: int, new_status: SeatStatusWithoutVacant) -> None:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE presence_status SET status = %s WHERE seat_id = %s",
                (new_status, seat_id),
            )
            updated = cur.rowcount
            conn.commit()
    if updated == 0:
        send_json({"ok": False, "error": "seat_id not found"})
        sys.exit(0)
