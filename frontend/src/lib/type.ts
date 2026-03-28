export type Status = "present" | "absent" | "vacant";

export type SummaryItem = {
  label: string;
  value: string;
  tone?: "default" | "highlight";
};
