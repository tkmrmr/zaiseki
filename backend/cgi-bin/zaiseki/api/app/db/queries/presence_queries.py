from vendor import pymysql

from app.schemas import SeatStatusWithoutVacant


def create_presence_status(
    conn: pymysql.Connection,
    student_id: int,
    seat_id: int,
    status: SeatStatusWithoutVacant,
) -> None:
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO presence_status (student_id, seat_id, status) VALUES (%s, %s, %s)",
            (student_id, seat_id, status),
        )


def update_presence_status(
    conn: pymysql.Connection, seat_id: int, status: SeatStatusWithoutVacant
) -> bool:
    with conn.cursor() as cur:
        cur.execute(
            "UPDATE presence_status SET status = %s WHERE seat_id = %s",
            (status, seat_id),
        )
        updated = cur.rowcount
    return updated > 0


def delete_by_seat_id(conn: pymysql.Connection, seat_id: int) -> None:
    with conn.cursor() as cur:
        cur.execute("DELETE FROM presence_status WHERE seat_id = %s", (seat_id,))


def delete_by_student_id(conn: pymysql.Connection, student_id: int) -> None:
    with conn.cursor() as cur:
        cur.execute("DELETE FROM presence_status WHERE student_id = %s", (student_id,))
