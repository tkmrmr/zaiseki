from app.db import get_db_connection
from app.schemas import SeatStatusWithoutVacant


def create_presence_status(
    student_id: int, seat_id: int, status: str = "absent"
) -> None:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO presence_status (student_id, seat_id, status) VALUES (%s, %s, %s)",
                (student_id, seat_id, status),
            )
            conn.commit()


def update_presence_status(seat_id: int, status: SeatStatusWithoutVacant) -> bool:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE presence_status SET status = %s WHERE seat_id = %s",
                (status, seat_id),
            )
            updated = cur.rowcount
            conn.commit()
    return updated > 0


def delete_by_seat_id(seat_id: int) -> None:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM presence_status WHERE seat_id = %s", (seat_id,))
            conn.commit()


def delete_by_student_id(student_id: int) -> None:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM presence_status WHERE student_id = %s", (student_id,)
            )
            conn.commit()
