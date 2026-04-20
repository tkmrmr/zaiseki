from app.db.connection import (
    get_db_connection,
)
from app.schemas import (
    Student,
)


def read_students() -> list[Student]:
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


def exists_student(student_id: int) -> bool:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT student_id FROM students WHERE student_id = %s", (student_id,)
            )
            student_row = cur.fetchone()
            if not student_row:
                return False
    return True
