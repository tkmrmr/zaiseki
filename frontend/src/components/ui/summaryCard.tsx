import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SummaryItem } from "@/lib/type";

export default function SummaryCard({ item }: { item: SummaryItem }) {
  return (
    <Card
      className={
        item.tone === "highlight"
          ? "ring-emerald-200 bg-emerald-50/90 rounded-4xl"
          : "ring-white/79 bg-white/80 rounded-4xl"
      }
    >
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-500">
          {item.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight text-slate-900">
          {item.value}
        </p>
      </CardContent>
    </Card>
  );
}
