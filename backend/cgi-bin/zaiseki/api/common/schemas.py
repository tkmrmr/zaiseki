from dataclasses import dataclass
from typing import Literal

SeatStatus = Literal["present", "absent", "vacant"]
Grade = Literal["B4", "M1", "M2", "D1", "D2", "D3"]


@dataclass
class Seat:
    id: int
    code: str
    status: SeatStatus
    family_name: str | None = None
    grade: Grade | None = None
    updated_at: str | None = None
