export type Status = "present" | "absent" | "vacant";

export type SummaryItem = {
  label: string;
  value: string;
  tone?: "default" | "highlight";
};

export type Seat = {
  id: number;
  code: string;
  familyName?: string;
  grade?: "B4" | "M1" | "M2" | "D1" | "D2" | "D3";
  status: Status;
};
