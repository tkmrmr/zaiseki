import SeatTile from "@/components/ui/seatTile";
import useSeat from "@/lib/useSeat";

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
