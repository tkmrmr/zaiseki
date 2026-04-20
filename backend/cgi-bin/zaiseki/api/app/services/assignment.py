from app.db.queries import presence_queries, student_queries


def assign_student_to_seat(student_id: int, seat_id: int) -> bool:
    exists_student = student_queries.exists_student(student_id)
    if not exists_student:
        return False
    presence_queries.delete_by_seat_id(seat_id)
    presence_queries.delete_by_student_id(student_id)
    presence_queries.create_presence_status(student_id, seat_id)
    return True


def unassign_student_from_seat(seat_id: int) -> None:
    presence_queries.delete_by_seat_id(seat_id)
