from ..db import get_db
from ..db.queries import student_queries
from ..schemas import Student


def list_students() -> list[Student]:
    conn = get_db()
    return student_queries.read_students(conn)
