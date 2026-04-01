#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys

sys.path.append(os.pardir)
import pymysql
from common import get_db_connection, print_json

print("Content-Type: application/json; charset=utf-8")
print()

QUERY = """
    SELECT
        students.student_id,
        students.name,
        students.grade
    FROM students
    ORDER BY students.student_id
    ;
"""

try:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(QUERY)

            students = []
            for student_id, name, grade in cur:
                students.append(
                    {
                        "id": student_id,
                        "student_name": name,
                        "grade": grade,
                    }
                )

    print_json({"ok": True, "students": students})

except pymysql.Error as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Database error"})

except Exception as e:
    print(e, file=sys.stderr)
    print_json({"ok": False, "error": "Internal error"})
