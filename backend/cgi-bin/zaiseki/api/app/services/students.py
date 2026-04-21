from app.db import get_db
from app.db.queries import student_queries
from app.schemas import Student


def list_students() -> list[Student]:
    conn = get_db()
    return student_queries.read_students(conn)
