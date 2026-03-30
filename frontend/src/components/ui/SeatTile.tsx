import { Badge } from "@/components/ui/badge";
import { getSeatStatusLabel, getSeatTileClass } from "@/lib/styleVariants";
import type { Seat, PageType } from "@/lib/type";

export function SeatTile({
  seat,
  onClickSeat,
  pageType,
}: {
  seat?: Seat;
  onClickSeat: (seat: Seat) => void;
  pageType: PageType;
}) {
  if (!seat) {
    return <div className="h-full border border-slate-300 bg-slate-100/70" />;
  }
  const isVacant = seat.status === "vacant";
  const isViewOnly = pageType === "view" ? true : false;

  return (
    <button
      type="button"
      onClick={
        (!isVacant && !isViewOnly) || pageType === "admin"
          ? () => onClickSeat(seat)
          : undefined
      }
      disabled={(isVacant || isViewOnly) && pageType !== "admin"}
      className={getSeatTileClass(seat.status, isViewOnly, pageType)}
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
      {!isViewOnly && !isVacant ? (
        <p className="mt-4 text-xl font-bold tracking-tight text-slate-900">
          {seat.familyName}
        </p>
      ) : (
        <p
          aria-hidden="true"
          className="mt-4 h-[28px] text-xl font-bold tracking-tight text-slate-900"
        />
      )}

      {!isViewOnly && !isVacant ? (
        <p className="mt-1 text-sm text-slate-600">{seat.grade}</p>
      ) : (
        <p
          aria-hidden="true"
          className="mt-1 h-[20px] text-sm text-slate-600"
        />
      )}
    </button>
  );
}
