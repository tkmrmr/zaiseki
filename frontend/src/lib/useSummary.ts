import { useEffect, useState } from "react";
import {
  REFRESH_REQUESTED_EVENT,
  SEAT_STATUS_UPDATED_EVENT,
} from "@/lib/events";
import type { SummaryNum } from "@/lib/type";

export default function useSummary() {
  const [summary, setSummary] = useState<SummaryNum | null>(null);

  useEffect(() => {
    const fetchSummary = () => {
      fetch("/cgi-bin/get_summary.py")
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setSummary(data.summary);
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
