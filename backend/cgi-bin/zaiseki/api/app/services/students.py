from ..common import (
    get_db_connection,
)
from ..schemas import (
    Student,
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
