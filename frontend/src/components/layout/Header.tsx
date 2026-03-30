import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REFRESH_REQUESTED_EVENT } from "@/lib/events";
import type { PageType } from "@/lib/type";

export default function Header({
  appName,
  updatedAt,
  isRefreshing,
  pageType,
}: {
  appName?: string;
  updatedAt: Date | null;
  isRefreshing: boolean;
  pageType: PageType;
}) {
  const onClickUpdate = () => {
    if (isRefreshing) return;
    window.dispatchEvent(new Event(REFRESH_REQUESTED_EVENT));
  };

  const onClickNavigate = () => {
    if (pageType === "kiosk") {
      window.location.href = "/#/admin";
    } else {
      window.location.href = "/#/kiosk";
    }
  };

  const updatedAtText = updatedAt
    ? updatedAt.toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Tokyo",
        hour12: false,
      })
    : "取得中";

  return (
    <header className="sticky top-4 z-10 rounded-4xl border border-white/70 bg-white/75 px-5 py-4 shadow-[0_18px_40px_rgba(36,57,69,0.08)] backdrop-blur md:px-6">
      <div className="m-1 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {appName || "研究室 在室管理アプリ"}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold text-slate-500">
              最終更新：{updatedAtText}
            </p>
            {pageType !== "view" && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-full border-slate-200 bg-white/80 px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white"
                onClick={onClickNavigate}
              >
                {pageType === "kiosk" ? "管理画面へ" : "操作画面へ"}
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-end md:shrink-0">
          <Button
            variant="default"
            size="lg"
            className="h-11 w-full rounded-full px-6 text-base shadow-sm transition sm:w-auto"
            onClick={onClickUpdate}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`size-5 ${isRefreshing ? "animate-spin" : ""}`}
            />{" "}
            <span>{isRefreshing ? "更新中..." : "更新"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
