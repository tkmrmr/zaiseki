from dataclasses import dataclass

from ..db.queries import assignment_queries, presence_queries


@dataclass
class AssignmentResult:
    ok: bool
    error: str | None = None


def assign_student_to_seat(student_id: int, seat_id: int) -> AssignmentResult:
    error = assignment_queries.assign_student_to_seat(student_id, seat_id)
    if error is not None:
        return AssignmentResult(ok=False, error=error)
    return AssignmentResult(ok=True)


def unassign_student_from_seat(seat_id: int) -> None:
    presence_queries.delete_by_seat_id(seat_id)
