import { useState, useEffect, useRef } from "react";
import ScrollHint from "scroll-hint";
import { cn } from "@/lib/utils";
import SeatDialog from "@/components/layout/SeatDialog";
import { SeatTile } from "@/components/ui/SeatTile";
import {
  getLabZoneClass,
  getLoungeClass,
  getLoungeTitleClass,
} from "@/lib/styleVariants";
import type { PageType, Seat } from "@/lib/type";

const FACILITY_CLASS = getLabZoneClass("facility");
const AISLE_CLASS = cn(getLabZoneClass("aisle"), "relative"); // sr-onlyはabsoluteになるため親にrelativeを追加

const Lounge = () => {
  return (
    <div className={getLoungeClass()}>
      <p className={getLoungeTitleClass()}>談話スペース</p>
    </div>
  );
};

export default function LabMap({
  pageType,
  seats,
  onClickSeat,
}: {
  pageType: PageType;
  seats: Record<string, Seat>;
  onClickSeat: (seat: Seat) => Promise<void>;
}) {
  const [isSeatDialogOpen, setIsSeatDialogOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    new ScrollHint(el, { remainingTime: "3000" });
    return () => {
      const icon = el.querySelector('[data-target="scrollable-icon"]');
      if (icon) icon.remove();
    };
  }, []);

  const handleTileClick = (seat: Seat) => {
    if (pageType === "admin") {
      setSelectedSeat(seat);
      setIsSeatDialogOpen(true);
      return;
    }
    return onClickSeat(seat);
  };

  const onOpenChangeSeatDialog = (open: boolean) => {
    setIsSeatDialogOpen(open);
    if (!open) {
      setSelectedSeat(null);
    }
  };

  return (
    <div ref={scrollContainerRef} className="w-full overflow-x-auto pb-2">
      <section className="min-w-[950px] overflow-hidden rounded-xl border border-slate-300 bg-white">
        <div className="grid grid-cols-12">
          <div className="col-span-4 grid grid-cols-3">
            <SeatTile
              seat={seats.A1}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
            <div className={`row-span-3 ${AISLE_CLASS}`}>
              {/* スクリーンリーダオンリー */}
              <span className=" sr-only ">通路</span>
            </div>
            <SeatTile
              seat={seats.B1}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.A2}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.B2}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.A3}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.B3}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
          </div>

          <div className="col-span-4 grid grid-cols-3">
            <SeatTile
              seat={seats.C1}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
            <div className={`row-span-3 ${AISLE_CLASS}`}>
              {/* スクリーンリーダオンリー */}
              <span className=" sr-only ">通路</span>
            </div>
            <SeatTile
              seat={seats.D1}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.C2}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.D2}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.C3}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.D3}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
          </div>

          <Lounge />

          <div className={`col-span-12 h-28 ${AISLE_CLASS}`}>
            {/* スクリーンリーダオンリー */}
            <span className=" sr-only ">メイン通路</span>
          </div>

          <div className="col-span-4 grid grid-cols-3">
            <SeatTile
              seat={seats.E1}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.E2}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
            <SeatTile
              seat={seats.E3}
              onClickSeat={handleTileClick}
              pageType={pageType}
            />
          </div>

          <div className="col-span-8 grid grid-cols-4">
            <div className={FACILITY_CLASS}>食器棚</div>
            <div className={AISLE_CLASS}>
              {/* スクリーンリーダオンリー */}
              <span className=" sr-only ">入口</span>
            </div>
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
