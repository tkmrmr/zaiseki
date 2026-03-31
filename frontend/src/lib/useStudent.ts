import { useEffect, useState } from "react";

type Student = {
  id: number;
  name: string;
  grade: "B4" | "M1" | "M2" | "D1" | "D2" | "D3";
};

type StudentResponse = {
  ok: boolean;
  students: {
    id: number;
    student_name: string;
    grade: Student["grade"];
  }[];
  error?: string;
};

export function useStudent() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetch("/cgi-bin/zaiseki/api/get_students.py")
      .then((res) => res.json())
      .then((data: StudentResponse) => {
        if (data.ok) {
          const tempStudents: Student[] = data.students.map((student) => ({
            id: student.id,
            name: student.student_name,
            grade: student.grade,
          }));
          setStudents(tempStudents);
        } else {
          console.error(data.error);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return students;
}
