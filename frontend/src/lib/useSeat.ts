import { useEffect, useState } from "react";
import type { Seat, Status } from "@/lib/type";

export default function useSeat() {
  const [seats, setSeats] = useState<Record<string, Seat>>({});

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
        new CustomEvent("seat-status-updated", {
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
    fetch("/cgi-bin/get_status.py")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const tempSeats: Record<string, Seat> = {};
          data.seats.forEach((seat: Seat) => {
            tempSeats[seat.code] = {
              id: seat.id,
              code: seat.code,
              familyName: seat.familyName,
              grade: seat.grade,
              status: seat.status,
            };
          });
          setSeats(tempSeats);
          console.log("座席情報を取得しました:", tempSeats);
        } else {
          console.error(data.error);
        }
      })
      .catch((err) => console.error(err));
  }, []);
  return [seats, onClickSeat] as [
    Record<string, Seat>,
    (seat: Seat) => Promise<void>,
  ];
}
