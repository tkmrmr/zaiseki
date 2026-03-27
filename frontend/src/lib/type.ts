export type Status = "present" | "away" | "absent";

export type SummaryItem = {
  label: string;
  value: string;
  tone?: "default" | "highlight";
};
