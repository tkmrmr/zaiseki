import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import SummaryPanel from "@/components/SummaryPanel";
import LabMap from "@/components/LabMap";
import useSummary from "@/lib/useSummary";

export default function App() {
  const [summary, updatedAt] = useSummary();
  const presentCount = summary?.present_count ?? 0;
  const absentCount = summary?.absent_count ?? 0;
  const nullCount = summary?.null_count ?? 0;
  const totalSeats = summary?.total_seats ?? 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(253,224,71,0.18),_transparent_32%),linear-gradient(180deg,#f6f2e9_0%,#edf4f7_100%)] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col p-4 sm:px-6 lg:px-8 lg:py-8">
        <Header appName="研究室 在室管理アプリ" updatedAt={updatedAt} />
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
              <CardTitle className="font-bold text-xl ">研究室マップ</CardTitle>
            </CardHeader>
            <CardContent>
              <LabMap isViewOnly={true} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
