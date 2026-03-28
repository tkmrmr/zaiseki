import { Badge } from "@/components/ui/badge";
import useSeat from "@/lib/useSeat";
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

function SeatTile({
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

export default function LabMap() {
  const [seats, onClickSeat] = useSeat();

  return (
    <div className="w-full overflow-x-auto pb-2">
      <section className="min-w-[950px] overflow-hidden rounded-[28px] border border-slate-300 bg-white">
        <div className="grid grid-cols-12">
          <div className="col-span-4 grid grid-cols-3">
            <SeatTile seat={seats.A1} onClickSeat={onClickSeat} />
            <div className="row-span-3 flex items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(250,248,241,0.95)] to-[rgba(245,240,229,0.98)] text-xl font-semibold text-slate-800">
              通路
            </div>
            <SeatTile seat={seats.B1} onClickSeat={onClickSeat} />
            <SeatTile seat={seats.A2} onClickSeat={onClickSeat} />
            <SeatTile seat={seats.B2} onClickSeat={onClickSeat} />
            <SeatTile seat={seats.A3} onClickSeat={onClickSeat} />
            <SeatTile seat={seats.B3} onClickSeat={onClickSeat} />
          </div>

          <div className="col-span-4 grid grid-cols-3">
            <SeatTile seat={seats.C1} onClickSeat={onClickSeat} />
            <div className="row-span-3 flex items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(250,248,241,0.95)] to-[rgba(245,240,229,0.98)] text-xl font-semibold text-slate-800">
              通路
            </div>
            <SeatTile seat={seats.D1} onClickSeat={onClickSeat} />
            <SeatTile seat={seats.C2} onClickSeat={onClickSeat} />
            <SeatTile seat={seats.D2} onClickSeat={onClickSeat} />
            <SeatTile seat={seats.C3} onClickSeat={onClickSeat} />
            <SeatTile seat={seats.D3} onClickSeat={onClickSeat} />
          </div>

          <div className="col-span-4 border border-slate-300 bg-gradient-to-b from-[rgba(250,219,210,0.9)] to-[rgba(247,208,202,0.95)]">
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center">
              <p className="text-xl font-bold tracking-tight text-slate-900">
                談話スペース
              </p>
              <p className="mt-3 text-md text-slate-600">打ち合わせ・雑談</p>
            </div>
          </div>

          <div className="col-span-12 flex h-28 items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(250,248,241,0.95)] to-[rgba(245,240,229,0.98)] text-xl font-bold text-slate-900">
            メイン通路
          </div>

          <div className="col-span-4 grid grid-cols-3">
            <SeatTile seat={seats.E1} onClickSeat={onClickSeat} />
            <SeatTile seat={seats.E2} onClickSeat={onClickSeat} />
            <SeatTile seat={seats.E3} onClickSeat={onClickSeat} />
          </div>

          <div className="col-span-8 grid grid-cols-4">
            <div className="flex items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(252,237,192,0.92)] to-[rgba(249,229,170,0.95)] text-xl font-bold text-slate-900">
              食器棚
            </div>
            <div className="flex items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(250,248,241,0.95)] to-[rgba(245,240,229,0.98)] text-xl font-bold text-slate-900">
              入口
            </div>
            <div className="flex text-center items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(252,237,192,0.92)] to-[rgba(249,229,170,0.95)] text-xl font-bold text-slate-900">
              冷蔵庫
              <br />
              電子レンジ
            </div>
            <div className="flex items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(252,237,192,0.92)] to-[rgba(249,229,170,0.95)] text-xl font-bold text-slate-900">
              サーバ
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
