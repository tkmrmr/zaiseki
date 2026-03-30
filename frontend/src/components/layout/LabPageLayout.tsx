import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import SummaryPanel from "@/components/layout/SummaryPanel";
import LabMap from "@/components/layout/LabMap";
import { useSummary } from "@/lib/useSummary";
import { useSeat } from "@/lib/useSeat";
import type { PageType } from "@/lib/type";

export default function LabPageLayout({ pageType }: { pageType: PageType }) {
  const summary = useSummary();
  const [seats, onClickSeat, getUpdatedAt, isRefreshing] = useSeat({
    isViewOnly: pageType === "view",
  });
  const presentCount = summary?.presentCount ?? 0;
  const absentCount = summary?.absentCount ?? 0;
  const nullCount = summary?.nullCount ?? 0;
  const totalSeats = summary?.totalSeats ?? 0;
  const updatedAt = getUpdatedAt();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(253,224,71,0.18),_transparent_32%),linear-gradient(180deg,#f6f2e9_0%,#edf4f7_100%)] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col p-4 sm:px-6 lg:px-8 lg:py-8">
        <Header
          appName="研究室 在室管理アプリ"
          updatedAt={updatedAt}
          isRefreshing={isRefreshing}
        />
        <main className="mt-8 space-y-8">
          <SummaryPanel
            items={[
              {
                label: "在室",
                value: `${presentCount} 名`,
                tone: "highlight",
              },
              { label: "不在", value: `${absentCount} 名` },
              {
                label: "空席",
                value: `${nullCount} 席`,
              },
              { label: "総席数", value: `${totalSeats} 席` },
            ]}
          />
          <Card className="rounded-4xl px-3 py-5 md:px-4 md:py-6">
            <CardHeader>
              <CardTitle className="font-bold text-xl">研究室マップ</CardTitle>
            </CardHeader>
            <CardContent>
              <LabMap
                pageType={pageType}
                seats={seats}
                onClickSeat={onClickSeat}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
