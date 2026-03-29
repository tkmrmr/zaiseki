import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Seat } from "@/lib/type";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seat: Seat | null;
};

export default function SeatDialog({ open, onOpenChange, seat }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>座席設定</DialogTitle>
            <DialogDescription>選択中の座席: {seat?.code}</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">現在登録されている学生</Label>
              <p>{seat?.familyName || "電通太郎"}</p>
            </Field>
            <Field>
              <Label htmlFor="username-1">名前</Label>
              {/* TODO: リストから選ぶ方式にする */}
              <DialogDescription>名字のみを入力してください</DialogDescription>
              <Input id="username-1" name="username" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">キャンセル</Button>
            </DialogClose>
            <Button type="submit">保存</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
