import { useCallback, useEffect, useState, useRef } from "react";
import type { Seat, Status, PageType, ErrorType } from "@/lib/type";
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

type RequestError = Error & {
  status?: number;
};

const createRequestError = (message: string, status?: number): RequestError => {
  const error = new Error(message) as RequestError;
  error.status = status;
  return error;
};

export function useSeat({ pageType }: { pageType: PageType }) {
  const [seats, setSeats] = useState<Record<string, Seat>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const refreshInFlightRef = useRef(false);
  const pendingRefreshRef = useRef(false);

  const refreshSeats = useCallback(async () => {
    const apiBase = "/cgi-bin/zaiseki/api";
    const statusEndpoint =
      pageType === "admin"
        ? `${apiBase}/admin/get_full_status.py`
        : pageType === "kiosk"
          ? `${apiBase}/kiosk/get_full_status.py`
          : `${apiBase}/public/get_status.py`;

    if (pageType === "view") {
      setIsCheckingAuth(false);
    }

    if (refreshInFlightRef.current) {
      pendingRefreshRef.current = true;
      return;
    }
    setIsRefreshing(true);
    try {
      do {
        pendingRefreshRef.current = false;
        refreshInFlightRef.current = true;
        try {
          const res = await fetch(statusEndpoint, {
            cache: "no-store",
          });

          if (!res.ok) {
            let message = `Server error: ${res.status}`;
            setIsCheckingAuth(false);
            if (res.status === 401) {
              setErrorType("unauthorized");
              message = "Unauthorized.";
              return;
            } else if (res.status === 403) {
              setErrorType("forbidden");
              message = "Forbidden.";
              return;
            }
            try {
              const data = await res.json();
              if (data.error) message = data.error;
            } catch {
              // non-JSON body; keep the status-code message
            }
            throw new Error(message);
          }

          const data = await res.json();
          if (data.ok) {
            const tempSeats: Record<string, Seat> = {};
            setErrorType(null);
            setIsCheckingAuth(false);
            data.seats.forEach((seat: ApiSeat) => {
              tempSeats[seat.code] =
                pageType === "view"
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
            setErrorType("unknown");
            setIsCheckingAuth(false);
          }
        } catch (err) {
          console.error(err);
          setErrorType("unknown");
          setIsCheckingAuth(false);
        } finally {
          refreshInFlightRef.current = false;
        }
      } while (pendingRefreshRef.current);
    } finally {
      setIsRefreshing(false);
    }
  }, [pageType]);

  const updateStatus = async (seat: Seat, newStatus: Status): Promise<void> => {
    const res = await fetch("/cgi-bin/zaiseki/api/kiosk/update_status.py", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seat_id: seat.id,
        new_status: newStatus,
      }),
    });

    if (!res.ok) {
      let message = `Server error: ${res.status}`;
      if (res.status === 401) {
        message = "Unauthorized.";
      } else if (res.status === 403) {
        message = "Forbidden.";
      }
      try {
        const data = await res.json();
        if (data.error) message = data.error;
      } catch {
        // non-JSON body; keep the status-code message
      }
      throw createRequestError(message, res.status);
    }

    const data = await res.json();
    if (!data.ok) {
      throw createRequestError(data.error ?? "Unknown error", res.status);
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
      const status = (err as RequestError).status;
      if (status === 401 || status === 403) {
        await refreshSeats();
      }
    }
  };

  const getUpdatedAt = (): Date | null => {
    const times = Object.values(seats)
      .map((s) => {
        const ua = s.updatedAt;
        if (!ua) return NaN;
        return Date.parse(ua);
      })
      .filter(Number.isFinite);

    return times.length ? new Date(Math.max(...times)) : null;
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
  return [
    seats,
    onClickSeat,
    getUpdatedAt,
    isRefreshing,
    isCheckingAuth,
    errorType,
  ] as [
    Record<string, Seat>,
    (seat: Seat) => Promise<void>,
    () => Date | null,
    boolean,
    boolean,
    ErrorType,
  ];
}
