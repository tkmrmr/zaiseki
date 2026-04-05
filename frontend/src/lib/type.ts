export type Status = "present" | "absent" | "vacant";

export type SummaryItem = {
  label: "在室" | "不在" | "空席" | "総席数";
  value: string;
  tone?: "default" | "highlight";
  hideOnSmall?: boolean;
};

export type SummaryNum = {
  presentCount: number;
  absentCount: number;
  nullCount: number;
  totalSeats: number;
};

export type Seat = {
  id: number;
  code: string;
  familyName?: string;
  grade?: "B4" | "M1" | "M2" | "D1" | "D2" | "D3";
  status: Status;
  updatedAt?: string;
};

export type PageType = "view" | "kiosk" | "admin";

export type ErrorPageType =
  | "not-found"
  | "unauthorized"
  | "forbidden"
  | "unknown";

export type ErrorType = null | "unauthorized" | "forbidden" | "unknown";
