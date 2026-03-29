import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSummaryCardClass } from "@/lib/styleVariants";
import type { SummaryItem } from "@/lib/type";

export default function SummaryCard({ item }: { item: SummaryItem }) {
  return (
    <Card className={getSummaryCardClass(item.tone)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-500">
          {item.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight text-slate-900">
          {item.value}
        </p>
      </CardContent>
    </Card>
  );
}
