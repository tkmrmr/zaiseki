from ..db.queries import assignment_queries, presence_queries


def assign_student_to_seat(student_id: int, seat_id: int) -> bool:
    return assignment_queries.assign_student_to_seat(student_id, seat_id)


def unassign_student_from_seat(seat_id: int) -> None:
    presence_queries.delete_by_seat_id(seat_id)
