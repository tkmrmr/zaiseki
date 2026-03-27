import { Badge } from "@/components/ui/badge";

type SeatStatus = "present" | "absent" | "vacant";

type Seat = {
  code: string;
  familyName?: string;
  grade?: "B4" | "M1" | "M2";
  status: SeatStatus;
};

const STATUS_LABEL: Record<SeatStatus, string> = {
  present: "在室",
  absent: "不在",
  vacant: "",
};

const SEAT_STYLE: Record<SeatStatus, string> = {
  present: "bg-gradient-to-b from-green-100/85 to-green-200/90",
  absent: "bg-gradient-to-b from-slate-100/85 to-slate-200/90",
  vacant: "bg-gradient-to-b from-white-200/85 to-gray-300/90",
};

function SeatTile({ seat }: { seat: Seat }) {
  return (
    <div
      className={`h-full rounded-none border border-slate-900/20 p-4 ${SEAT_STYLE[seat.status]} p-3`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide text-slate-500">
          {seat.code}
        </p>
        {seat.status !== "vacant" && (
          <Badge className="bg-white/80 text-slate-800" variant="outline">
            {STATUS_LABEL[seat.status]}
          </Badge>
        )}
      </div>
      <p className="mt-4 text-xl font-bold tracking-tight text-slate-900">
        {seat.familyName}
      </p>
      <p className="mt-1 text-sm text-slate-600">{seat.grade}</p>
    </div>
  );
}

const seats: Record<string, Seat> = {
  A1: {
    code: "A 1",
    familyName: "青木",
    grade: "M1",
    status: "absent",
  },
  A2: {
    code: "A 2",
    familyName: "石田",
    grade: "B4",
    status: "absent",
  },
  A3: {
    code: "A 3",
    familyName: "上村",
    grade: "M2",
    status: "absent",
  },

  B1: {
    code: "B 1",
    familyName: "大西",
    grade: "M1",
    status: "present",
  },
  B2: {
    code: "B 2",
    familyName: "岡本",
    grade: "M2",
    status: "present",
  },
  B3: {
    code: "B 3",
    familyName: "川村",
    grade: "B4",
    status: "absent",
  },

  C1: {
    code: "C 1",
    familyName: "木村",
    grade: "M1",
    status: "absent",
  },
  C2: {
    code: "C 2",
    familyName: "小林",
    grade: "M2",
    status: "absent",
  },
  C3: {
    code: "C 3",
    familyName: "佐々木",
    grade: "M1",
    status: "absent",
  },

  D1: {
    code: "D 1",
    familyName: "田中",
    grade: "M1",
    status: "absent",
  },
  D2: {
    code: "D 2",
    familyName: "中村",
    grade: "M1",
    status: "absent",
  },
  D3: {
    code: "D 3",
    familyName: "橋本",
    grade: "M1",
    status: "absent",
  },

  E1: {
    code: "E 1",
    familyName: "福田",
    grade: "M1",
    status: "present",
  },
  E2: {
    code: "E 2",
    familyName: "松本",
    grade: "M2",
    status: "present",
  },
  E3: {
    code: "E 3",
    status: "vacant",
  },
};

export default function LabMap() {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <section className="min-w-[980px] overflow-hidden rounded-[28px] border border-slate-300 bg-white">
        <div className="grid grid-cols-12">
          <div className="col-span-4 grid grid-cols-3">
            <SeatTile seat={seats.A1} />
            <div className="row-span-3 flex items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(250,248,241,0.95)] to-[rgba(245,240,229,0.98)] text-xl font-semibold text-slate-800">
              通路
            </div>
            <SeatTile seat={seats.B1} />
            <SeatTile seat={seats.A2} />
            <SeatTile seat={seats.B2} />
            <SeatTile seat={seats.A3} />
            <SeatTile seat={seats.B3} />
          </div>

          <div className="col-span-4 grid grid-cols-3">
            <SeatTile seat={seats.C1} />
            <div className="row-span-3 flex items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(250,248,241,0.95)] to-[rgba(245,240,229,0.98)] text-xl font-semibold text-slate-800">
              通路
            </div>
            <SeatTile seat={seats.D1} />
            <SeatTile seat={seats.C2} />
            <SeatTile seat={seats.D2} />
            <SeatTile seat={seats.C3} />
            <SeatTile seat={seats.D3} />
          </div>

          <div className="col-span-4 border border-slate-300 bg-gradient-to-b from-[rgba(250,219,210,0.9)] to-[rgba(247,208,202,0.95)]">
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center">
              <p className="text-xl font-bold tracking-tight text-slate-900">
                談話スペース
              </p>
              <p className="mt-3 text-md text-slate-600">打ち合わせ・雑談</p>
            </div>
          </div>

          <div className="col-span-12 flex h-28 items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(250,248,241,0.95)] to-[rgba(245,240,229,0.98)] text-xl font-bold text-slate-900">
            メイン通路
          </div>

          <div className="col-span-4 grid grid-cols-3">
            <SeatTile seat={seats.E1} />
            <SeatTile seat={seats.E2} />
            <SeatTile seat={seats.E3} />
          </div>

          <div className="col-span-8 grid grid-cols-4">
            <div className="flex items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(252,237,192,0.92)] to-[rgba(249,229,170,0.95)] text-xl font-bold text-slate-900">
              食器棚
            </div>
            <div className="flex items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(250,248,241,0.95)] to-[rgba(245,240,229,0.98)] text-xl font-bold text-slate-900">
              入口
            </div>
            <div className="flex items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(252,237,192,0.92)] to-[rgba(249,229,170,0.95)] text-xl font-bold text-slate-900">
              冷蔵庫
              <br />
              電子レンジ
            </div>
            <div className="flex items-center justify-center border border-slate-300 bg-gradient-to-b from-[rgba(252,237,192,0.92)] to-[rgba(249,229,170,0.95)] text-xl font-bold text-slate-900">
              サーバ
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
