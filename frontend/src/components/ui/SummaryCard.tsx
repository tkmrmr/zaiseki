import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSummaryCardClass } from "@/lib/styleVariants";
import type { SummaryItem } from "@/lib/type";

export function SummaryCard({ item }: { item: SummaryItem }) {
  const isHidden = item.hideOnSmall ?? false;
  return (
    <Card className={getSummaryCardClass({ tone: item.tone, isHidden })}>
      <CardHeader>
        <CardTitle
          className={`text-sm font-medium ${item.tone === "highlight" ? "text-emerald-400/60" : "text-slate-500"}`}
        >
          {item.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-2xl font-semibold tracking-tight ${item.tone === "highlight" ? "text-emerald-800/90" : "text-slate-900"}`}
        >
          {item.value}
        </p>
      </CardContent>
    </Card>
  );
}
