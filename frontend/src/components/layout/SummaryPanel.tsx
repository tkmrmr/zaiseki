import { SummaryCard } from "@/components/ui/SummaryCard";
import type { SummaryItem } from "@/lib/type";

export default function SummaryPanel({ items }: { items: SummaryItem[] }) {
  return (
    <div className="grid gap-2 lg:gap-3 grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <SummaryCard key={item.label} item={item} />
      ))}
    </div>
  );
}
