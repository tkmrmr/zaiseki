import { useEffect, useState } from "react";

type SummaryNum = {
  present_count: number;
  absent_count: number;
  null_count: number;
  total_seats: number;
};

export default function useSummary() {
  const [summary, setSummary] = useState<SummaryNum | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    const fetchSummary = () => {
      fetch("/cgi-bin/get_summary.py")
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setSummary(data.summary);
            setUpdatedAt(new Date());
          } else {
            console.error(data.error);
          }
        })
        .catch((err) => console.error(err));
    };

    fetchSummary();

    const onSeatStatusUpdated = () => {
      fetchSummary();
    };

    window.addEventListener("seat-status-updated", onSeatStatusUpdated);
    return () => {
      window.removeEventListener("seat-status-updated", onSeatStatusUpdated);
    };
  }, []);

  return [summary, updatedAt] as [SummaryNum | null, Date | null];
}
