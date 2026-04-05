import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import SummaryPanel from "@/components/layout/SummaryPanel";
import LabMap from "@/components/layout/LabMap";
import ErrorLayout from "@/components/layout/ErrorLayout";
import { useSeat } from "@/lib/useSeat";
import type { PageType, ErrorType } from "@/lib/type";

const ErrorViews = ({ errorType }: { errorType: ErrorType }) => {
  if (errorType === "unauthorized") {
    return <ErrorLayout errorPageType="unauthorized" />;
  } else if (errorType === "forbidden") {
    return <ErrorLayout errorPageType="forbidden" />;
  } else if (errorType === "unknown") {
    return <ErrorLayout errorPageType="unknown" />;
  } else {
    return null;
  }
};

export default function LabPageLayout({ pageType }: { pageType: PageType }) {
  const [
    seats,
    onClickSeat,
    getUpdatedAt,
    isRefreshing,
    isCheckingAuth,
    errorType,
  ] = useSeat({
    pageType,
  });
  const seatList = Object.values(seats);
  const presentCount = seatList.length
    ? seatList.filter((seat) => seat.status === "present").length
    : null;
  const absentCount = seatList.length
    ? seatList.filter((seat) => seat.status === "absent").length
    : null;
  const vacantCount = seatList.length
    ? seatList.filter((seat) => seat.status === "vacant").length
    : null;
  const totalSeats = seatList.length ? seatList.length : null;
  const updatedAt = getUpdatedAt();

  return (pageType === "view" || !isCheckingAuth) && errorType === null ? (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(253,224,71,0.18),_transparent_32%),linear-gradient(180deg,#f6f2e9_0%,#edf4f7_100%)] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col p-4 lg:p-8">
        <Header
          updatedAt={updatedAt}
          isRefreshing={isRefreshing}
          pageType={pageType}
        />
        <main className="mt-3 space-y-3 md:space-y-6 md:mt-6">
          <SummaryPanel
            items={[
              {
                label: "在室",
                value: presentCount,
                tone: "highlight",
              },
              { label: "不在", value: absentCount },
              {
                label: "空席",
                value: vacantCount,
                hideOnSmall: true,
              },
              { label: "総席数", value: totalSeats, hideOnSmall: true },
            ]}
          />
          <Card className="rounded-xl px-3 py-6 md:px-4 md:py-7 shadow-sm ring-0">
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
  ) : (
    <>
      {isCheckingAuth || errorType === null ? null : (
        <ErrorViews errorType={errorType} />
      )}
    </>
  );
}
