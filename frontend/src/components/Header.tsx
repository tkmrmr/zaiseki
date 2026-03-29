import { Button } from "@/components/ui/button";
import useSummary from "@/lib/useSummary";
import { REFRESH_REQUESTED_EVENT } from "@/lib/events";

const onClickUpdate = () => {
  window.dispatchEvent(new Event(REFRESH_REQUESTED_EVENT));
};

export default function Header() {
  const [, updatedAt] = useSummary();

  return (
    <header className="sticky top-4 z-10 rounded-4xl border border-white/70 bg-white/75 px-5 py-4 shadow-[0_18px_40px_rgba(36,57,69,0.08)] backdrop-blur md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            研究室 在室管理アプリ
          </p>
          <p className="text-sm font-semibold tracking-[0.10m] text-slate-500">
            最終更新：
            {updatedAt
              ? updatedAt.toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Tokyo",
                  hour12: false,
                })
              : "取得中"}
          </p>
        </div>
        <Button
          variant="default"
          size="lg"
          className="rounded-full px-4 py-2 transition"
          onClick={onClickUpdate}
        >
          更新
        </Button>
      </div>
    </header>
  );
}
