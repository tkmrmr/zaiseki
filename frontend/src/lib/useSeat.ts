import { useEffect, useState } from "react";
import type { Seat, Status } from "@/lib/type";
import {
  REFRESH_REQUESTED_EVENT,
  SEAT_STATUS_UPDATED_EVENT,
} from "@/lib/events";

export default function useSeat({
  isViewOnly = false,
}: { isViewOnly?: boolean } = {}) {
  const [seats, setSeats] = useState<Record<string, Seat>>({});

  const fetchSeats = async () => {
    try {
      const res = isViewOnly
        ? await fetch("/cgi-bin/get_status.py")
        : await fetch("/cgi-bin/get_full_status.py");
      const data = await res.json();

      if (data.ok) {
        const tempSeats: Record<string, Seat> = {};
        data.seats.forEach((seat: Seat) => {
          tempSeats[seat.code] = isViewOnly
            ? {
                id: seat.id,
                code: seat.code,
                status: seat.status,
              }
            : {
                id: seat.id,
                code: seat.code,
                familyName: seat.familyName,
                grade: seat.grade,
                status: seat.status,
              };
        });
        setSeats(tempSeats);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (seat: Seat, newStatus: Status): Promise<void> => {
    const res = await fetch("/cgi-bin/update_status.py", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seat_id: seat.id,
        status: newStatus,
      }),
    });

    if (!res.ok) {
      let message = `Server error: ${res.status}`;
      try {
        const data = await res.json();
        if (data.error) message = data.error;
      } catch {
        // non-JSON body; keep the status-code message
      }
      throw new Error(message);
    }

    const data = await res.json();
    if (!data.ok) {
      throw new Error(data.error ?? "Unknown error");
    }
  };

  const onClickSeat = async (seat: Seat) => {
    const newStatus = seat.status === "present" ? "absent" : "present";
    setSeats((prev) => ({
      ...prev,
      [seat.code]: { ...prev[seat.code], status: newStatus },
    }));
    try {
      await updateStatus(seat, newStatus);
      window.dispatchEvent(
        new CustomEvent(SEAT_STATUS_UPDATED_EVENT, {
          detail: { seatId: seat.id, status: newStatus },
        }),
      );
    } catch (err) {
      console.error(err);
      // Roll back optimistic update on failure
      setSeats((prev) => ({
        ...prev,
        [seat.code]: { ...prev[seat.code], status: seat.status },
      }));
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void fetchSeats();
    });

    const onRefreshRequested = () => {
      fetchSeats();
    };

    window.addEventListener(REFRESH_REQUESTED_EVENT, onRefreshRequested);
    return () => {
      window.removeEventListener(REFRESH_REQUESTED_EVENT, onRefreshRequested);
    };
  }, []);
  return [seats, onClickSeat] as [
    Record<string, Seat>,
    (seat: Seat) => Promise<void>,
  ];
}
