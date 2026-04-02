from datetime import timezone


def convert_to_utc_iso(dt, source_tz=timezone.utc):
    # dtがawareであればUTCに変換，naiveであればsource_tzで解釈してからUTCに変換
    if dt is None:
        return None

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=source_tz)

    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
