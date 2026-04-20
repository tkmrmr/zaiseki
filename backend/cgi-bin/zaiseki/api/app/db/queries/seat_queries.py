from vendor import pymysql

from app.schemas import Seat
from app.utils.convert_to_utc_iso import convert_to_utc_iso


def read_seats_with_public_status(conn: pymysql.Connection) -> list[Seat]:
    QUERY = """
        SELECT
            seats.seat_id, 
            seats.seat_number, 
            presence_status.status, 
            presence_status.updated_at
        FROM seats
        LEFT JOIN presence_status
            ON presence_status.seat_id = seats.seat_id
        ORDER BY seats.seat_id
        ;
    """
    with conn.cursor() as cur:
        cur.execute(QUERY)

        seats: list[Seat] = []
        for seat_id, seat_number, status, updated_at in cur:
            if status is None:
                status = "vacant"
            seats.append(
                Seat(
                    id=seat_id,
                    code=seat_number,
                    status=status,
                    updated_at=convert_to_utc_iso(updated_at),
                )
            )
    return seats


def read_seats_with_full_status(conn: pymysql.Connection) -> list[Seat]:
    QUERY = """
        SELECT
            seats.seat_id, 
            seats.seat_number, 
            students.name, 
            students.grade, 
            presence_status.status, 
            presence_status.updated_at
        FROM seats
        LEFT JOIN presence_status
            ON presence_status.seat_id = seats.seat_id
        LEFT JOIN students
            ON students.student_id = presence_status.student_id
        ORDER BY seats.seat_id
        ;
    """
    with conn.cursor() as cur:
        cur.execute(QUERY)

        seats: list[Seat] = []
        for seat_id, seat_number, name, grade, status, updated_at in cur:
            if status is None:
                status = "vacant"
            seats.append(
                Seat(
                    id=seat_id,
                    code=seat_number,
                    family_name=name,
                    grade=grade,
                    status=status,
                    updated_at=convert_to_utc_iso(updated_at),
                )
            )
    return seats
