from app.db import get_db_connection


def assign_student_to_seat(student_id: int, seat_id: int) -> str | None:
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT student_id FROM students WHERE student_id = %s",
                (student_id,),
            )
            result = cur.fetchone()
            if not result:
                return "Student not found"

            cur.execute(
                "SELECT seat_id FROM seats WHERE seat_id = %s",
                (seat_id,),
            )
            result = cur.fetchone()
            if not result:
                return "Seat not found"

            cur.execute("DELETE FROM presence_status WHERE seat_id = %s", (seat_id,))
            cur.execute(
                "DELETE FROM presence_status WHERE student_id = %s", (student_id,)
            )
            cur.execute(
                "INSERT INTO presence_status (student_id, seat_id, status) VALUES (%s, %s, 'absent')",
                (student_id, seat_id),
            )
            conn.commit()
    except Exception:
        conn.rollback()
        raise
    return None
