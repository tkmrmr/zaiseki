from typing import Literal, NotRequired, TypedDict

type SeatStatus = Literal["present", "absent", "vacant"]
type Grade = Literal["B4", "M1", "M2", "D1", "D2", "D3"]


class Seat(TypedDict):
    id: int
    code: str
    family_name: NotRequired[str]
    grade: NotRequired[Grade]
    status: SeatStatus
    updated_at: NotRequired[str]
