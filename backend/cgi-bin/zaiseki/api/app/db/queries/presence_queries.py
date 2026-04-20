from app.db import get_db_connection
from app.schemas import SeatStatusWithoutVacant


def update_presence_status(seat_id: int, status: SeatStatusWithoutVacant) -> bool:
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute(
            "UPDATE presence_status SET status = %s WHERE seat_id = %s",
            (status, seat_id),
        )
        updated = cur.rowcount
        conn.commit()
    return updated > 0


def delete_by_seat_id(seat_id: int) -> None:
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("DELETE FROM presence_status WHERE seat_id = %s", (seat_id,))
        conn.commit()
