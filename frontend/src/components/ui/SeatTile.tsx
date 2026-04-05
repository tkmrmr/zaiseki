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
    return (
      <div
        aria-hidden="true"
        className="rounded-none border border-slate-700/20 bg-transparent p-3 shadow-none"
      >
        <div className="flex items-center justify-between">
          <span className="block h-4 w-8" />
          <span className="block h-5 w-12" />
        </div>
        <span className="mt-4 block h-[28px] w-full" />
        <span className="mt-1 block h-[20px] w-full" />
      </div>
    );
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
        {!isVacant && (
          <Badge className={seat.status === "present" ? "bg-white/80 text-emerald-600" : "bg-white/80 text-slate-800"} variant="outline">
            {getSeatStatusLabel(seat.status)}
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
