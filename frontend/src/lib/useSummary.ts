import { useEffect, useState } from "react";
import {
  REFRESH_REQUESTED_EVENT,
  SEAT_STATUS_UPDATED_EVENT,
} from "@/lib/events";
import type { SummaryNum } from "@/lib/type";

export function useSummary() {
  const [summary, setSummary] = useState<SummaryNum | null>(null);

  useEffect(() => {
    const fetchSummary = () => {
      fetch("/cgi-bin/zaiseki/api/get_summary.py")
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setSummary({
              presentCount: data.summary.present_count,
              absentCount: data.summary.absent_count,
              nullCount: data.summary.null_count,
              totalSeats: data.summary.total_seats,
            });
          } else {
            console.error(data.error);
          }
        })
        .catch((err) => console.error(err));
    };

    fetchSummary();

    const onRefresh = () => {
      fetchSummary();
    };

    window.addEventListener(SEAT_STATUS_UPDATED_EVENT, onRefresh);
    window.addEventListener(REFRESH_REQUESTED_EVENT, onRefresh);
    return () => {
      window.removeEventListener(SEAT_STATUS_UPDATED_EVENT, onRefresh);
      window.removeEventListener(REFRESH_REQUESTED_EVENT, onRefresh);
    };
  }, []);

  return summary;
}
