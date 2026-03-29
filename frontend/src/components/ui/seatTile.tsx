import { Badge } from "@/components/ui/badge";
import { getSeatStatusLabel, getSeatTileClass } from "@/lib/styleVariants";
import { cn } from "@/lib/utils";
import type { Seat } from "@/lib/type";

export default function SeatTile({
  seat,
  onClickSeat,
}: {
  seat?: Seat;
  onClickSeat: (seat: Seat) => void;
}) {
  if (!seat) {
    return <div className="h-full border border-slate-300 bg-slate-100/70" />;
  }
  const isVacant = seat.status === "vacant";

  return (
    <button
      type="button"
      onClick={!isVacant ? () => onClickSeat(seat) : undefined}
      disabled={isVacant}
      className={getSeatTileClass(seat.status)}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide text-slate-500">
          {seat.code}
        </p>
        {!isVacant ? (
          <Badge className="bg-white/80 text-slate-800" variant="outline">
            {getSeatStatusLabel(seat.status)}
          </Badge>
        ) : (
          <Badge
            aria-hidden
            className="invisible bg-white/80 text-slate-800"
            variant="outline"
          >
            空席
          </Badge>
        )}
      </div>
      <p
        className={cn(
          "mt-4 text-xl font-bold tracking-tight text-slate-900",
          isVacant && "invisible",
        )}
      >
        {seat.familyName ?? "空席"}
      </p>
      <p className={cn("mt-1 text-sm text-slate-600", isVacant && "invisible")}>
        {seat.grade ?? "D3"}
      </p>
    </button>
  );
}
