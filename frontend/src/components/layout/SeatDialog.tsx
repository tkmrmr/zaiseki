import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REFRESH_REQUESTED_EVENT } from "@/lib/events";
import type { Seat } from "@/lib/type";
import { useStudent } from "@/lib/useStudent";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seat: Seat;
};

type FormValues = {
  studentId: string;
};

type ApiResponse = {
  ok?: boolean;
  error?: string;
};

export default function SeatDialog({ open, onOpenChange, seat }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUnassigning, setIsUnassigning] = useState(false);
  const [showUnassignConfirm, setShowUnassignConfirm] = useState(false);
  const { control, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: { studentId: "" },
  });
  const { students, error: studentLoadError } = useStudent();
  const hasAssignedStudent = Boolean(seat.familyName);
  const isBusy = formState.isSubmitting || isUnassigning;
  const isAssignDisabled = isBusy || Boolean(studentLoadError);
  const submitLabel = hasAssignedStudent ? "変更を保存" : "登録する";
  const studentsNotInSeat = students.filter(
    (student) => student.name !== seat.familyName,
  );

  const parseResponseBody = async (
    res: Response,
  ): Promise<ApiResponse | null> => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const onClickUnassign = async () => {
    if (!hasAssignedStudent) {
      return;
    }

    setSubmitError(null);
    setIsUnassigning(true);

    try {
      const res = await fetch("/cgi-bin/zaiseki/api/admin/unassign_student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seat_id: seat.id,
        }),
      });

      const body = await parseResponseBody(res);
      if (!res.ok) {
        setSubmitError(body?.error ?? `Server error: ${res.status}`);
        return;
      }

      if (!body?.ok) {
        setSubmitError(body?.error ?? "解除に失敗しました");
        return;
      }

      window.dispatchEvent(new Event(REFRESH_REQUESTED_EVENT));
      reset({ studentId: "" });
      onOpenChange(false);
    } catch {
      setSubmitError("通信に失敗しました");
    } finally {
      setIsUnassigning(false);
    }
  };

  const onSubmit = async (data: FormValues): Promise<void> => {
    setSubmitError(null);
    setShowUnassignConfirm(false);
    if (studentLoadError) {
      setSubmitError(studentLoadError);
      return;
    }

    try {
      const res = await fetch("/cgi-bin/zaiseki/api/admin/assign_student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seat_id: seat.id,
          student_id: Number(data.studentId),
        }),
      });

      const body = await parseResponseBody(res);

      if (!res.ok) {
        setSubmitError(body?.error ?? `Server error: ${res.status}`);
        return;
      }

      if (!body?.ok) {
        setSubmitError(body?.error ?? "保存に失敗しました");
        return;
      }

      window.dispatchEvent(new Event(REFRESH_REQUESTED_EVENT));
      reset({ studentId: "" });
      onOpenChange(false);
    } catch {
      setSubmitError("通信に失敗しました");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form
          className="contents"
          onSubmit={handleSubmit(onSubmit)}
          method="POST"
        >
          <DialogHeader className="pr-8">
            <DialogTitle className="text-lg">座席設定</DialogTitle>
            <DialogDescription>選択中の座席: {seat?.code}</DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-3">
            <Card className="gap-3">
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle>現在の登録</CardTitle>
                    <CardDescription>
                      {hasAssignedStudent
                        ? "現在、以下の学生が登録されています。"
                        : "現在は学生が登録されていません。"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
                  <p className="text-base font-medium">
                    {seat.familyName ?? "未登録"}
                  </p>
                  {hasAssignedStudent && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      学年: {seat.grade ?? "不明"}
                    </p>
                  )}
                </div>

                {hasAssignedStudent &&
                  (showUnassignConfirm ? (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                      <p className="text-sm font-medium text-destructive">
                        この座席の登録を解除しますか？
                      </p>
                      <div className="mt-3 flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowUnassignConfirm(false)}
                          disabled={isBusy}
                        >
                          やめる
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={onClickUnassign}
                          disabled={isBusy}
                        >
                          {isUnassigning ? "解除中..." : "解除する"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-destructive/30 bg-destructive/5 px-3 py-2.5">
                      <p className="text-sm font-medium">登録を外したい場合</p>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSubmitError(null);
                          setShowUnassignConfirm(true);
                        }}
                        disabled={isBusy}
                      >
                        解除する
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card className="gap-2">
              <CardHeader className="pb-0">
                <CardTitle>
                  {hasAssignedStudent ? "別の学生を登録" : "学生を登録"}
                </CardTitle>
                <CardDescription>
                  {hasAssignedStudent
                    ? "学生を選んで保存すると、この座席の登録を置き換えます。"
                    : "学生を選んでこの座席に登録します。"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Controller
                  name="studentId"
                  control={control}
                  rules={{ required: "学生を選択してください" }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="studentId">登録する学生</FieldLabel>
                      <FieldContent>
                        <Select
                          disabled={isAssignDisabled}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSubmitError(null);
                            setShowUnassignConfirm(false);
                          }}
                        >
                          <SelectTrigger
                            id="studentId"
                            className="w-full"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="学生を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {studentsNotInSeat.map((student) => (
                                <SelectItem
                                  key={student.id}
                                  value={String(student.id)}
                                >
                                  {student.name} ({student.grade})
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FieldError errors={[fieldState.error]} />
                        {studentLoadError && (
                          <FieldError>{studentLoadError}</FieldError>
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
              </CardContent>
            </Card>

            {submitError && <FieldError>{submitError}</FieldError>}
          </FieldGroup>

          <DialogFooter className="mt-1">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isBusy}>
                キャンセル
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isAssignDisabled}>
              {formState.isSubmitting ? "保存中..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
