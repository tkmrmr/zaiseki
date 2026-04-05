import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { REFRESH_REQUESTED_EVENT } from "@/lib/events";
import type { PageType } from "@/lib/type";

export default function Header({
  appName = "ラボ在室状況",
  updatedAt,
  isRefreshing,
  pageType,
}: {
  appName?: string;
  updatedAt: Date | null;
  isRefreshing: boolean;
  pageType: PageType;
}) {
  const navigate = useNavigate();

  const onClickUpdate = () => {
    if (isRefreshing) return;
    window.dispatchEvent(new Event(REFRESH_REQUESTED_EVENT));
  };

  const onClickNavigate = () => {
    if (pageType === "kiosk") {
      navigate("/admin");
    } else {
      navigate("/kiosk");
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

  const PageBadge = (pageType: PageType) => {
    const text =
      pageType === "view"
        ? "閲覧画面"
        : pageType === "kiosk"
          ? "操作画面"
          : "管理画面";
    const color =
      pageType === "view"
        ? "border-sky-200/70 bg-sky-100/70 text-sky-700"
        : pageType === "kiosk"
          ? "border-emerald-200/70 bg-emerald-100/70 text-emerald-700"
          : "border-violet-200/70 bg-violet-100/70 text-violet-700";
    return (
      <Badge
        className={`${color} justify-self-end px-2.5 py-1 text-xs xl:text-sm font-semibold shadow-xs backdrop-blur-sm`}
      >
        {text}
      </Badge>
    );
  };

  return (
    <header className="sticky top-4 z-10 rounded-xl border border-white/70 bg-white/75 px-5 py-3 shadow-md backdrop-blur md:px-6 md:py-4">
      <div className="m-1 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center md:gap-2 justify-between">
            <p className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
              {appName}
            </p>
            {PageBadge(pageType)}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 justify-between">
            <p className="text-sm font-semibold text-slate-500">
              最終更新：{updatedAtText}
            </p>
            {pageType !== "view" && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-slate-200 bg-white/80 px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white"
                onClick={onClickNavigate}
              >
                {pageType === "kiosk" ? "管理画面へ" : "操作画面へ"}
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-end md:shrink-0 md:self-center">
          <Button
            variant="secondary"
            size="lg"
            className="w-full min-w-[9em] rounded-full px-6 text-base shadow-sm transition sm:w-auto md:h-10"
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
