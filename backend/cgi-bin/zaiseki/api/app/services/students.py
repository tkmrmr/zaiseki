from dataclasses import asdict

from app.db.queries import student_queries


def list_students() -> list[dict]:
    students = student_queries.read_students()
    return [asdict(student) for student in students]
