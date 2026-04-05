import type { Status, SummaryItem } from "@/lib/type";
import { cn } from "@/lib/utils";
import type { PageType } from "@/lib/type";

type LabZoneType = "facility" | "aisle" | "lounge";

const STATUS_LABEL: Record<Status, string> = {
  present: "在室",
  absent: "不在",
  vacant: "空席",
};

const SEAT_TILE_STATUS_CLASS: Record<Status, string> = {
  present:
    "bg-gradient-to-b from-emerald-100/85 to-emerald-200/90 active:from-emerald-200/90 active:to-emerald-300/95",
  absent:
    "bg-gradient-to-b from-slate-100/85 to-slate-200/90 active:from-slate-200/90 active:to-slate-300/95",
  vacant: "bg-gradient-to-b from-white/85 to-gray-300/90",
};

const SEAT_TILE_STATUS_CLASS_WITHOUT_ACTIVE: Record<Status, string> = {
  present: "bg-gradient-to-b from-emerald-100/85 to-emerald-200/90",
  absent: "bg-gradient-to-b from-slate-100/85 to-slate-200/90",
  vacant: "bg-gray-200/40 border-dashed",
};

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
    "h-full rounded-none border border-slate-700/20 p-3",
    statusClass,
    (status === "vacant" || isViewOnly) && pageType !== "admin"
      ? "cursor-default"
      : "cursor-pointer",
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
    tone === "highlight" ? "bg-emerald-50/90" : " bg-white/80",
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
