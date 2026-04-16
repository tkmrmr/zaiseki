from dataclasses import dataclass
from typing import Literal

SeatStatus = Literal["present", "absent", "vacant"]
SeatStatusWithoutVacant = Literal["present", "absent"]
Grade = Literal["B4", "M1", "M2", "D1", "D2", "D3"]


@dataclass
class Seat:
    id: int
    code: str
    status: SeatStatus
    family_name: str | None = None
    grade: Grade | None = None
    updated_at: str | None = None


@dataclass
class Student:
    id: int
    student_name: str
    grade: Grade


@dataclass
class NewStatusRequest:
    seat_id: int
    new_status: SeatStatusWithoutVacant

@dataclass
class AssignStudentRequest:
    seat_id: int
    student_id: int

@dataclass
class UnassignStudentRequest:
    seat_id: int
