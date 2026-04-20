from vendor import pymysql

from app.schemas import SeatStatusWithoutVacant


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
