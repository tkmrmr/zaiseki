from common import (
    Student,
    get_db_connection,
)


def list_students() -> list[Student]:
    QUERY = """
        SELECT
            students.student_id,
            students.name,
            students.grade
        FROM students
        ORDER BY students.student_id
        ;
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(QUERY)

            students: list[Student] = []
            for student_id, name, grade in cur:
                students.append(Student(id=student_id, student_name=name, grade=grade))
    return students


def assign_student_to_seat(student_id: int, seat_id: int) -> bool:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT student_id FROM students WHERE student_id = %s", (student_id,)
            )
            result = cur.fetchone()
            if not result:
                return False

            cur.execute("DELETE FROM presence_status WHERE seat_id = %s", (seat_id,))
            cur.execute(
                "DELETE FROM presence_status WHERE student_id = %s", (student_id,)
            )
            cur.execute(
                "INSERT INTO presence_status (student_id, seat_id, status) VALUES (%s, %s, 'absent')",
                (student_id, seat_id),
            )
            conn.commit()
    return True


def unassign_student_from_seat(seat_id: int) -> None:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM presence_status WHERE seat_id = %s", (seat_id,))
            conn.commit()
