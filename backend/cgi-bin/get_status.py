#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

import mysql.connector

print("Content-Type: application/json; charset=utf-8")
print()

try:
    conn = mysql.connector.connect(
        host="localhost", user="root", password="rootpass", database="lab"
    )
    cur = conn.cursor()

    query = """
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

    cur.execute(query)

    seats = []
    for seat_id, seat_number, name, grade, status, updated_at in cur:
        seats.append(
            {
                "id": seat_id,
                "seat_number": seat_number,
                "name": name,
                "grade": grade,
                "status": status,
                "updated_at": updated_at.isoformat() if updated_at else None,
            }
        )

    conn.close()

    print(json.dumps({"ok": True, "seats": seats}, ensure_ascii=False))

except mysql.connector.Error as e:
    print(json.dumps({"ok": False, "error": str(e)}, ensure_ascii=False))
