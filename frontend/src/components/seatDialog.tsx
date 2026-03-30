import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { REFRESH_REQUESTED_EVENT } from "@/lib/events";
import type { Seat } from "@/lib/type";
import useStudent from "@/lib/useStudent";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seat: Seat;
};

type FormValues = {
  name: string;
};

export default function SeatDialog({ open, onOpenChange, seat }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { control, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: { name: "" },
  });
  const students = useStudent();
  const studentNames = students.map((student) => student.name);

  const onSubmit = async (data: FormValues): Promise<void> => {
    setSubmitError(null);

    const res = await fetch("/cgi-bin/assign_student.py", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seat_id: seat.id,
        student_name: data.name,
      }),
    });

    let body: { ok?: boolean; error?: string } | null = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }

    if (!res.ok) {
      let message = `Server error: ${res.status}`;
      if (body?.error) message = body.error;
      setSubmitError(message);
      return;
    }

    if (!body?.ok) {
      setSubmitError(body?.error ?? "保存に失敗しました");
      return;
    }

    window.dispatchEvent(new Event(REFRESH_REQUESTED_EVENT));
    reset({ name: "" });
    onOpenChange(false);
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
            <Card className="gap-2">
              <Field>
                <CardHeader className="pb-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    現在登録されている学生
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-base font-medium">
                    {seat?.familyName || "なし"}
                  </p>
                </CardContent>
              </Field>
            </Card>

            <Field>
              <Card className="gap-2">
                <CardHeader className="pb-0">
                  <Label htmlFor="name">登録する学生</Label>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "学生を選択してください" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSubmitError(null);
                        }}
                      >
                        <SelectTrigger id="name">
                          <SelectValue placeholder="学生を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {studentNames.map((name) => (
                              <SelectItem key={name} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {formState.errors.name && (
                    <p className="text-sm text-red-600">
                      {formState.errors.name.message}
                    </p>
                  )}
                  {submitError && (
                    <p className="text-sm text-red-600">{submitError}</p>
                  )}
                </CardContent>
              </Card>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-1">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                キャンセル
              </Button>
            </DialogClose>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
