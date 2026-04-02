from datetime import timezone


def convert_to_utc_iso(dt):
    return (
        dt.replace(tzinfo=timezone.utc).isoformat().replace("+00:00", "Z")
        if dt
        else None
    )
