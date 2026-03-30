import { SummaryCard } from "@/components/ui/summaryCard";
import type { SummaryItem } from "@/lib/type";

export default function SummaryPanel({ items }: { items: SummaryItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <SummaryCard key={item.label} item={item} />
      ))}
    </div>
  );
}
