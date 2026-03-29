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
      <form className="contents">
        <DialogContent className="sm:max-w-md">
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
                    {seat?.familyName || "電通太郎"}
                  </p>
                </CardContent>
              </Field>
            </Card>

            <Field>
              <Card className="gap-2">
                <CardHeader className="pb-0">
                  <Label htmlFor="username-1">名前</Label>
                </CardHeader>
                {/* TODO: リストから選ぶ方式にする */}
                <CardContent className="space-y-2">
                  <DialogDescription className="text-xs">
                    名字のみを入力してください
                  </DialogDescription>
                  <Input
                    id="username-1"
                    name="username"
                    placeholder="例: 宮本"
                  />
                </CardContent>
              </Card>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-1">
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
