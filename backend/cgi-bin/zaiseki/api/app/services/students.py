from ..db.queries import student_queries
from ..schemas import Student


def list_students() -> list[Student]:
    return student_queries.read_students()
