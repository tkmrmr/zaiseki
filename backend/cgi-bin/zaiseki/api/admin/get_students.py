#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
from dataclasses import asdict

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))
import pymysql
from common import Student, get_db_connection, send_json

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

            students: list[Student] = []
            for student_id, name, grade in cur:
                students.append(Student(id=student_id, student_name=name, grade=grade))

    send_json({"ok": True, "students": [asdict(s) for s in students]})

except pymysql.Error as e:
    print(e, file=sys.stderr)
    send_json({"ok": False, "error": "Database error"})

except Exception as e:
    print(e, file=sys.stderr)
    send_json({"ok": False, "error": "Internal error"})
