#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import sys

import mysql.connector

print("Content-Type: application/json; charset=utf-8")
print()

conn = None
try:
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
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
        if status is None:
            status = "vacant"
        seats.append(
            {
                "id": seat_id,
                "code": seat_number,
                "familyName": name,
                "grade": grade,
                "status": status,
                "updated_at": updated_at.isoformat() if updated_at else None,
            }
        )
    print(json.dumps({"ok": True, "seats": seats}, ensure_ascii=False))

except mysql.connector.Error as e:
    print(e, file=sys.stderr)
    print(json.dumps({"ok": False, "error": "Database error"}, ensure_ascii=False))

finally:
    if conn is not None:
        conn.close()
