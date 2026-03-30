import { useState } from "react";
import SeatDialog from "@/components/seatDialog";
import SeatTile from "@/components/ui/seatTile";
import {
  getLabZoneClass,
  getLoungeClass,
  getLoungeTitleClass,
} from "@/lib/styleVariants";
import useSeat from "@/lib/useSeat";
import type { PageType } from "@/lib/type";

const FACILITY_CLASS = getLabZoneClass("facility");
const AISLE_CLASS = getLabZoneClass("aisle");

const Lounge = () => {
  return (
    <div className={getLoungeClass()}>
      <p className={getLoungeTitleClass()}>談話スペース</p>
      <p className="mt-3 text-md text-slate-600">打ち合わせ・雑談</p>
    </div>
  );
};

export default function LabMap({ pageType }: { pageType: PageType }) {
  const isViewOnly = pageType === "view" ? true : false;
  const [seats, updateStatus] = useSeat({ isViewOnly });
  const [isSeatDialogOpen, setIsSeatDialogOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<
    Parameters<typeof updateStatus>[0] | null
  >(null);

  const onClickSeat = (...args: Parameters<typeof updateStatus>) => {
    if (pageType === "admin") {
      setSelectedSeat(args[0] ?? null);
      setIsSeatDialogOpen(true);
      return;
    }
    return updateStatus(...args);
  };

  const onOpenChangeSeatDialog = (open: boolean) => {
    setIsSeatDialogOpen(open);
    if (!open) {
      setSelectedSeat(null);
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <section className="min-w-[950px] overflow-hidden rounded-[28px] border border-slate-300 bg-white">
        <div className="grid grid-cols-12">
          <div className="col-span-4 grid grid-cols-3">
            <SeatTile
              seat={seats.A1}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
            <div className={`row-span-3 ${AISLE_CLASS}`}>通路</div>
            <SeatTile
              seat={seats.B1}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.A2}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.B2}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.A3}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.B3}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
          </div>

          <div className="col-span-4 grid grid-cols-3">
            <SeatTile
              seat={seats.C1}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
            <div className={`row-span-3 ${AISLE_CLASS}`}>通路</div>
            <SeatTile
              seat={seats.D1}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.C2}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.D2}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.C3}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.D3}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
          </div>

          <Lounge />

          <div className={`col-span-12 h-28 ${AISLE_CLASS}`}>メイン通路</div>

          <div className="col-span-4 grid grid-cols-3">
            <SeatTile
              seat={seats.E1}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.E2}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.E3}
              onClickSeat={onClickSeat}
              pageType={pageType}
            />
          </div>

          <div className="col-span-8 grid grid-cols-4">
            <div className={FACILITY_CLASS}>食器棚</div>
            <div className={AISLE_CLASS}>入口</div>
            <div className={`text-center ${FACILITY_CLASS}`}>
              冷蔵庫
              <br />
              電子レンジ
            </div>
            <div className={FACILITY_CLASS}>サーバ</div>
          </div>
        </div>
      </section>

      {selectedSeat && (
        <SeatDialog
          open={isSeatDialogOpen}
          onOpenChange={onOpenChangeSeatDialog}
          seat={selectedSeat}
        />
      )}
    </div>
  );
}
