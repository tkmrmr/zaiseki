import { useCallback, useEffect, useState, useRef } from "react";
import type { Seat, Status } from "@/lib/type";
import {
  REFRESH_REQUESTED_EVENT,
  SEAT_STATUS_UPDATED_EVENT,
} from "@/lib/events";

const AUTO_REFRESH_INTERVAL_MS = 30_000;

type ApiSeat = {
  id: number;
  code: string;
  family_name?: string;
  grade?: "B4" | "M1" | "M2" | "D1" | "D2" | "D3";
  status: Status;
  updated_at?: string;
};

export function useSeat({ isViewOnly }: { isViewOnly: boolean }) {
  const [seats, setSeats] = useState<Record<string, Seat>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshInFlightRef = useRef(false);
  const pendingRefreshRef = useRef(false);

  const refreshSeats = useCallback(async () => {
    if (refreshInFlightRef.current) {
      pendingRefreshRef.current = true;
      return;
    }
    setIsRefreshing(true);
    do {
      pendingRefreshRef.current = false;
      refreshInFlightRef.current = true;
      try {
        const res = isViewOnly
          ? await fetch("/cgi-bin/zaiseki/api/get_status.py", {
              cache: "no-store",
            })
          : await fetch("/cgi-bin/zaiseki/api/get_full_status.py", {
              cache: "no-store",
            });
        const data = await res.json();

        if (data.ok) {
          const tempSeats: Record<string, Seat> = {};
          data.seats.forEach((seat: ApiSeat) => {
            tempSeats[seat.code] = isViewOnly
              ? {
                  id: seat.id,
                  code: seat.code,
                  status: seat.status,
                  updatedAt: seat.updated_at,
                }
              : {
                  id: seat.id,
                  code: seat.code,
                  familyName: seat.family_name,
                  grade: seat.grade,
                  status: seat.status,
                  updatedAt: seat.updated_at,
                };
          });
          setSeats(tempSeats);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        refreshInFlightRef.current = false;
      }
    } while (pendingRefreshRef.current);
    setIsRefreshing(false);
  }, [isViewOnly]);

  const updateStatus = async (seat: Seat, newStatus: Status): Promise<void> => {
    const res = await fetch("/cgi-bin/zaiseki/api/update_status.py", {
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
      await refreshSeats();
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

  const getUpdatedAt = (): Date | null => {
    const times = Object.values(seats)
      .map((s) => Date.parse(s.updatedAt ?? ""))
      .filter(Number.isFinite);

    let updatedAt: Date | null = null;
    if (times.length) {
      const updatedAtUTC = new Date(Math.max(...times));
      const timezoneOffset =
        new Date().getTimezoneOffset() + 9 * 60 * 60 * 1000;
      updatedAt = new Date(updatedAtUTC.getTime() + timezoneOffset);
    }

    return updatedAt;
  };

  useEffect(() => {
    queueMicrotask(() => {
      void refreshSeats();
    });

    const intervalId = window.setInterval(() => {
      void refreshSeats();
    }, AUTO_REFRESH_INTERVAL_MS);

    const onRefreshRequested = () => {
      void refreshSeats();
    };

    window.addEventListener(REFRESH_REQUESTED_EVENT, onRefreshRequested);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener(REFRESH_REQUESTED_EVENT, onRefreshRequested);
    };
  }, [refreshSeats]);
  return [seats, onClickSeat, getUpdatedAt, isRefreshing] as [
    Record<string, Seat>,
    (seat: Seat) => Promise<void>,
    () => Date | null,
    boolean,
  ];
}
