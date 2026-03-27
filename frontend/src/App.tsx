import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./components/ui/button";
import SummaryPanel from "@/components/summaryPanel";
import type { Status } from "@/lib/type";

// type Seat = {
//   id: string;
//   name: string;
//   status: Status;
//   x: number;
//   y: number;
//   w: number;
//   h: number;
//   note?: string;
// };

// const seats: Seat[] = [
//   // 左上縦3席
//   { id: "A1", name: "山田", status: "present", x: 0, y: 0, w: 160, h: 100 },
//   {
//     id: "A2",
//     name: "鈴木",
//     status: "away",
//     x: 0,
//     y: 100,
//     w: 160,
//     h: 100,
//     note: "離席 20分",
//   },
//   {
//     id: "A3",
//     name: "佐藤",
//     status: "absent",
//     x: 0,
//     y: 200,
//     w: 160,
//     h: 100,
//     note: "要確認",
//   },

//   // 中央左 3席
//   { id: "B1", name: "高橋", status: "absent", x: 320, y: 0, w: 160, h: 100 },
//   { id: "B3", name: "田中", status: "present", x: 320, y: 100, w: 160, h: 100 },
//   { id: "B5", name: "井上", status: "present", x: 320, y: 200, w: 160, h: 100 },

//   // 中央右 3席
//   { id: "B2", name: "伊藤", status: "present", x: 480, y: 0, w: 160, h: 100 },
//   { id: "B4", name: "中村", status: "present", x: 480, y: 100, w: 160, h: 100 },
//   { id: "B6", name: "小林", status: "absent", x: 480, y: 200, w: 160, h: 100 },

//   // 右上縦3席
//   { id: "C1", name: "加藤", status: "present", x: 800, y: 0, w: 160, h: 100 },
//   { id: "C2", name: "吉田", status: "absent", x: 800, y: 100, w: 160, h: 100 },
//   { id: "C3", name: "山本", status: "present", x: 800, y: 200, w: 160, h: 100 },

//   // 左下横3席
//   { id: "D1", name: "松本", status: "present", x: 0, y: 420, w: 160, h: 100 },
//   { id: "D2", name: "渡辺", status: "present", x: 160, y: 420, w: 160, h: 100 },
//   {
//     id: "D3",
//     name: "阿部",
//     status: "away",
//     x: 320,
//     y: 420,
//     w: 160,
//     h: 100,
//     note: "離席 8分",
//   },
// ];

// const statusLabel: Record<Status, string> = {
//   present: "在席",
//   away: "離席",
//   absent: "不在",
// };

// const statusStyle: Record<
//   Status,
//   { fill: string; stroke: string; text: string }
// > = {
//   present: { fill: "#DCFCE7", stroke: "#16A34A", text: "#166534" },
//   away: { fill: "#FEF3C7", stroke: "#D97706", text: "#92400E" },
//   absent: { fill: "#E5E7EB", stroke: "#6B7280", text: "#374151" },
// };

// function countByStatus(status: Status) {
//   return seats.filter((seat) => seat.status === status).length;
// }

// function seatLists() {
//   return {
//     away: seats.filter((seat) => seat.status === "away"),
//     absent: seats.filter((seat) => seat.status === "absent"),
//   };
// }

// function SeatRect({ seat }: { seat: Seat }) {
//   const style = statusStyle[seat.status];

//   return (
//     <g>
//       <rect
//         x={seat.x}
//         y={seat.y}
//         width={seat.w}
//         height={seat.h}
//         rx={10}
//         fill={style.fill}
//         stroke={style.stroke}
//         strokeWidth={3}
//       />
//       <text
//         x={seat.x + 14}
//         y={seat.y + 30}
//         fontSize="20"
//         fontWeight="700"
//         fill="#111827"
//       >
//         {seat.name}
//       </text>
//       <text
//         x={seat.x + 14}
//         y={seat.y + 58}
//         fontSize="16"
//         fontWeight="600"
//         fill={style.text}
//       >
//         {statusLabel[seat.status]}
//       </text>
//       {seat.note && (
//         <text x={seat.x + 14} y={seat.y + 82} fontSize="13" fill="#4B5563">
//           {seat.note}
//         </text>
//       )}
//     </g>
//   );
// }

// function SummaryCard({
//   label,
//   value,
//   className,
// }: {
//   label: string;
//   value: number;
//   className: string;
// }) {
//   return (
//     <div className={`rounded-xl border px-4 py-3 ${className}`}>
//       <div className="text-xs text-slate-600">{label}</div>
//       <div className="mt-1 text-2xl font-bold">{value}</div>
//     </div>
//   );
// }

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(253,224,71,0.18),_transparent_32%),linear-gradient(180deg,#f6f2e9_0%,#edf4f7_100%)] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        <header className="sticky top-4 z-10 rounded-[30px] border border-white/70 bg-white/75 px-5 py-4 shadow-[0_18px_40px_rgba(36,57,69,0.08)] backdrop-blur md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                研究室 在室管理アプリ
              </p>
              <p className="text-sm font-semibold tracking-[0.10m] text-slate-500">
                最終更新：2026年3月28日(木) 14:30
              </p>
            </div>
            <Button
              variant="default"
              size="lg"
              className="rounded-full px-4 py-2 transition"
            >
              更新
            </Button>
          </div>
        </header>
        <div className="my-8 h-px bg-slate-200">
          <SummaryPanel
            items={[
              {
                label: "在室人数",
                value: `6 名`,
                tone: "highlight",
              },
              { label: "離席・未確認", value: `2 名` },
              {
                label: "使用中の席",
                value: `4 / 12`,
              },
              { label: "空席", value: `8 席` },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
