import type { Status, SummaryItem } from "@/lib/type";
import { cn } from "@/lib/utils";
import type { PageType } from "@/lib/type";

type LabZoneType = "facility" | "aisle" | "lounge";

const STATUS_LABEL: Record<Status, string> = {
  present: "在室",
  absent: "不在",
  vacant: "空席",
};

const SEAT_TILE_STATUS_CLASS_WITHOUT_ACTIVE: Record<Status, string> = {
  present: "bg-gradient-to-b from-emerald-200/60 to-emerald-300/65",
  absent: "bg-gradient-to-b from-slate-200/50 to-slate-300/55",
  vacant: "bg-gray-200/40 border-dashed",
};

const SEAT_TILE_STATUS_CLASS: Record<Status, string> = {
  present: `${SEAT_TILE_STATUS_CLASS_WITHOUT_ACTIVE.present} active:from-emerald-200/90 active:to-emerald-300/95`,
  absent: `${SEAT_TILE_STATUS_CLASS_WITHOUT_ACTIVE.absent} active:from-slate-200/90 active:to-slate-300/95`,
  vacant: `${SEAT_TILE_STATUS_CLASS_WITHOUT_ACTIVE.vacant}`,
};

const SEAT_TILE_BASE_CLASS =
  "h-full min-h-28 rounded-none border border-slate-700/20 p-3";

const LAB_ZONE_BASE_CLASS =
  "border border-slate-200 flex items-center justify-center";

const LAB_ZONE_TEXT_CLASS = "text-xl font-bold text-slate-700/90";

const LAB_ZONE_STYLE_CLASS: Record<LabZoneType, string> = {
  facility:
    "bg-gradient-to-b from-[rgba(253,243,210,0.9)] to-[rgba(250,236,190,0.93)]",
  aisle:
    "bg-gradient-to-b from-[rgba(252,250,245,0.94)] to-[rgba(248,244,235,0.97)]",
  lounge:
    "bg-gradient-to-b from-[rgba(252,230,223,0.9)] to-[rgba(249,219,212,0.94)]",
};

export function getSeatStatusLabel(status: Status): string {
  return STATUS_LABEL[status];
}

export function getSeatTileClass(
  status: Status,
  isViewOnly: boolean,
  pageType: PageType,
): string {
  const statusClass = isViewOnly
    ? SEAT_TILE_STATUS_CLASS_WITHOUT_ACTIVE[status]
    : SEAT_TILE_STATUS_CLASS[status];

  return cn(
    SEAT_TILE_BASE_CLASS,
    "shadow-md hover:shadow-sm active:translate-y-px",
    statusClass,
    (status === "vacant" || isViewOnly) && pageType !== "admin"
      ? "cursor-default shadow-none hover:shadow-none active:translate-y-0"
      : "cursor-pointer",
  );
}

export function getSeatTilePlaceholderClass(pageType: PageType): string {
  return cn(
    SEAT_TILE_BASE_CLASS,
    pageType === "view" ? "shadow-none" : "shadow-md",
  );
}

export function getSummaryCardClass({
  tone,
  isHidden,
}: {
  tone?: SummaryItem["tone"];
  isHidden?: boolean;
}): string {
  return cn(
    "rounded-xl p-3 md:p-4 ring-0 shadow-sm",
    isHidden && "hidden xl:flex",
    tone === "highlight" ? "bg-emerald-50/90" : "bg-white/80",
  );
}

export function getLabZoneClass(zone: Exclude<LabZoneType, "lounge">): string {
  return cn(
    LAB_ZONE_BASE_CLASS,
    LAB_ZONE_TEXT_CLASS,
    LAB_ZONE_STYLE_CLASS[zone],
  );
}

export function getLoungeClass(): string {
  return cn(
    "col-span-4 h-full min-h-[300px] flex flex-col",
    LAB_ZONE_BASE_CLASS,
    LAB_ZONE_STYLE_CLASS.lounge,
  );
}

export function getLoungeTitleClass(): string {
  return cn(LAB_ZONE_TEXT_CLASS, "tracking-tight");
}
