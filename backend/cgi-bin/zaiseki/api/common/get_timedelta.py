import datetime

from common import get_db_connection


def get_timedelta() -> datetime.timedelta:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SHOW VARIABLES LIKE '%time_zone';")
            system_time_zone = cur.fetchone()
            server_time_zone = cur.fetchone()
    if server_time_zone == "SYSTEM":
        timezone = system_time_zone[1] if system_time_zone else "UTC"
    else:
        timezone = server_time_zone[1] if server_time_zone else "UTC"
    return datetime.timedelta(hours=9) if timezone == "UTC" else datetime.timedelta()
