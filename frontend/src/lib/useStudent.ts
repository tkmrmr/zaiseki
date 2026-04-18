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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/cgi-bin/zaiseki/api/admin/get_students");
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("学生一覧の取得に認証が必要です。");
          }
          if (res.status === 403) {
            throw new Error("学生一覧を取得する権限がありません。");
          }
          throw new Error(`学生一覧の取得に失敗しました (${res.status})。`);
        }

        const data: StudentResponse = await res.json();
        if (!data.ok) {
          throw new Error(data.error ?? "学生一覧の取得に失敗しました。");
        }

        const tempStudents: Student[] = data.students.map((student) => ({
          id: student.id,
          name: student.student_name,
          grade: student.grade,
        }));
        setStudents(tempStudents);
        setError(null);
      } catch (err) {
        console.error(err);
        setStudents([]);
        setError(
          err instanceof Error ? err.message : "学生一覧の取得に失敗しました。",
        );
      }
    };

    void fetchStudents();
  }, []);

  return { students, error };
}
