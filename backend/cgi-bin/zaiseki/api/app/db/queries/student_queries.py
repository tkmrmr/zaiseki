from vendor import pymysql

from app.schemas import Student


def read_students(conn: pymysql.Connection) -> list[Student]:
    QUERY = """
        SELECT
            students.student_id,
            students.name,
            students.grade
        FROM students
        ORDER BY students.student_id
        ;
    """
    with conn.cursor() as cur:
        cur.execute(QUERY)

        students: list[Student] = []
        for student_id, name, grade in cur:
            students.append(Student(id=student_id, student_name=name, grade=grade))
    return students


def exists_student(conn: pymysql.Connection, student_id: int) -> bool:
    with conn.cursor() as cur:
        cur.execute(
            "SELECT student_id FROM students WHERE student_id = %s",
            (student_id,),
        )
        is_exist = cur.fetchone()
        if not is_exist:
            return False
    return True
