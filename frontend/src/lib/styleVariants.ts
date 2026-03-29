import type { Status, SummaryItem } from "@/lib/type";
import { cn } from "@/lib/utils";

type LabZoneType = "facility" | "aisle" | "lounge";

const STATUS_LABEL: Record<Status, string> = {
  present: "在室",
  absent: "不在",
  vacant: "空席",
};

const SEAT_TILE_STATUS_CLASS: Record<Status, string> = {
  present:
    "bg-gradient-to-b from-green-100/85 to-green-200/90 active:from-green-200/90 active:to-green-300/95",
  absent:
    "bg-gradient-to-b from-slate-100/85 to-slate-200/90 active:from-slate-200/90 active:to-slate-300/95",
  vacant: "bg-gradient-to-b from-white/85 to-gray-300/90",
};

const SEAT_TILE_STATUS_CLASS_WITHOUT_ACTIVE: Record<Status, string> = {
  present: "bg-gradient-to-b from-green-100/85 to-green-200/90",
  absent: "bg-gradient-to-b from-slate-100/85 to-slate-200/90",
  vacant: "bg-gradient-to-b from-white/85 to-gray-300/90",
};

const LAB_ZONE_BASE_CLASS =
  "border border-slate-300 flex items-center justify-center";

const LAB_ZONE_TEXT_CLASS = "text-xl font-bold text-slate-800";

const LAB_ZONE_STYLE_CLASS: Record<LabZoneType, string> = {
  facility:
    "bg-gradient-to-b from-[rgba(252,237,192,0.92)] to-[rgba(249,229,170,0.95)]",
  aisle:
    "bg-gradient-to-b from-[rgba(250,248,241,0.95)] to-[rgba(245,240,229,0.98)]",
  lounge:
    "bg-gradient-to-b from-[rgba(250,219,210,0.9)] to-[rgba(247,208,202,0.95)]",
};

export function getSeatStatusLabel(status: Status): string {
  return STATUS_LABEL[status];
}

export function getSeatTileClass(status: Status, isViewOnly: boolean): string {
  const statusClass = isViewOnly
    ? SEAT_TILE_STATUS_CLASS_WITHOUT_ACTIVE[status]
    : SEAT_TILE_STATUS_CLASS[status];

  return cn(
    "h-full rounded-none border border-slate-900/20 p-3",
    statusClass,
    status === "vacant" || isViewOnly ? "cursor-default" : "cursor-pointer",
  );
}

export function getSummaryCardClass(tone: SummaryItem["tone"]): string {
  return cn(
    "rounded-4xl p-3 md:p-4",
    tone === "highlight"
      ? "ring-emerald-200 bg-emerald-50/90"
      : "ring-white/79 bg-white/80",
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
