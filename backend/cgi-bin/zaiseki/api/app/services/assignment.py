from ..db import get_db_connection
from ..db.queries import presence_queries, seat_queries, student_queries


def assign_student_to_seat(student_id: int, seat_id: int) -> None:
    conn = get_db_connection()
    try:
        exists_student = student_queries.exists_student(conn, student_id)
        if not exists_student:
            raise ValueError("Student not found")

        exists_seat = seat_queries.exists_seat(conn, seat_id)
        if not exists_seat:
            raise ValueError("Seat not found")

        presence_queries.delete_by_seat_id(conn, seat_id)
        presence_queries.delete_by_student_id(conn, student_id)
        presence_queries.create_presence_status(conn, student_id, seat_id, "absent")

        conn.commit()
    except Exception:
        conn.rollback()
        raise


def unassign_student_from_seat(seat_id: int) -> None:
    conn = get_db_connection()
    presence_queries.delete_by_seat_id(conn, seat_id)
    conn.commit()
