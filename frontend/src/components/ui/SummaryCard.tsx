import { UserRound, UsersRound, UserRoundX, Armchair } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSummaryCardClass } from "@/lib/styleVariants";
import type { SummaryItem } from "@/lib/type";

export function SummaryCard({ item }: { item: SummaryItem }) {
  const isHidden = item.hideOnSmall ?? false;

  const getIcon = () => {
    const iconColor =
      item.tone === "highlight" ? "text-emerald-600/80" : "text-slate-500/80";

    switch (item.label) {
      case "在室":
        return <UserRound className={iconColor} size={32} />;
      case "不在":
        return <UserRoundX className={iconColor} size={32} />;
      case "空席":
        return <Armchair className={iconColor} size={32} />;
      case "総席数":
        return <UsersRound className={iconColor} size={32} />;
      default:
        return null;
    }
  };

  const icon = getIcon();

  return (
    <Card className={getSummaryCardClass({ tone: item.tone, isHidden })}>
      <CardHeader>
        <CardTitle
          className={`text-sm font-medium ${item.tone === "highlight" ? "text-emerald-500/90" : "text-slate-500"}`}
        >
          {item.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <p
            className={`text-2xl font-semibold tracking-tight ${item.tone === "highlight" ? "text-emerald-800/80" : "text-slate-900"}`}
          >
            {item.value}
          </p>
          {icon && <div className="flex-shrink-0">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
