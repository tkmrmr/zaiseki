import { Badge } from "@/components/ui/badge";
import type { Status, Seat } from "@/lib/type";

const STATUS_LABEL: Record<Status, string> = {
  present: "在室",
  absent: "不在",
  vacant: "空席",
};

const SEAT_STYLE: Record<Status, string> = {
  present:
    "bg-gradient-to-b from-green-100/85 to-green-200/90 active:from-green-200/90 active:to-green-300/95",
  absent:
    "bg-gradient-to-b from-slate-100/85 to-slate-200/90 active:from-slate-200/90 active:to-slate-300/95",
  vacant: "bg-gradient-to-b from-white/85 to-gray-300/90",
};

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
      className={`h-full rounded-none border border-slate-900/20 p-3 ${SEAT_STYLE[seat.status]} ${
        isVacant ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide text-slate-500">
          {seat.code}
        </p>
        {!isVacant ? (
          <Badge className="bg-white/80 text-slate-800" variant="outline">
            {STATUS_LABEL[seat.status]}
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
        className={`mt-4 text-xl font-bold tracking-tight text-slate-900 ${isVacant ? "invisible" : ""}`}
      >
        {seat.familyName ?? "空席"}
      </p>
      <p
        className={`mt-1 text-sm text-slate-600 ${isVacant ? "invisible" : ""}`}
      >
        {seat.grade ?? "D3"}
      </p>
    </button>
  );
}
