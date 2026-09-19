import React, { useEffect, useState } from "react";
import { getSeats, holdSeat } from "../api/api";

const tierColors = {
  VVIP: "#C8A34E",
  VIP: "#C81D3B",
  REGULAR: "#9A9A96",
};

export default function SeatSelection({ eventId, userId, onBack, onProceedToPayment }) {
  const [seats, setSeats] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getSeats(eventId).then(setSeats);
  }, [eventId]);

  const handleSeatClick = async (seat) => {
    if (seat.status === "BOOKED") return;
    setError("");

    if (selectedIds.includes(seat.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== seat.id));
      return;
    }

    try {
      await holdSeat(seat.id, userId);
      setSelectedIds([...selectedIds, seat.id]);
    } catch (e) {
      setError(e.message);
    }
  };

  const selectedSeats = seats.filter((s) => selectedIds.includes(s.id));
  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleProceed = () => {
    if (selectedIds.length === 0) return;
    onProceedToPayment(selectedSeats);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Work Sans', sans-serif", paddingBottom: "6rem" }}>
      <button onClick={onBack} style={{ marginBottom: "1rem", background: "none", border: "none", cursor: "pointer" }}>
        ← Back to events
      </button>

      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Select your seats</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "1.5rem 0" }}>
        {seats.map((seat) => {
          const isSelected = selectedIds.includes(seat.id);
          return (
            <button
              key={seat.id}
              onClick={() => handleSeatClick(seat)}
              disabled={seat.status === "BOOKED"}
              style={{
                width: 34,
                height: 34,
                borderRadius: 6,
                border: `2px solid ${tierColors[seat.tier]}`,
                background:
                  seat.status === "BOOKED"
                    ? tierColors[seat.tier] + "33"
                    : isSelected
                    ? tierColors[seat.tier]
                    : "transparent",
                color: isSelected ? "#fff" : "#333",
                cursor: seat.status === "BOOKED" ? "not-allowed" : "pointer",
                fontSize: 11,
              }}
            >
              {seat.seatCode}
            </button>
          );
        })}
      </div>
      {error && <p style={{ color: "#C81D3B" }}>{error}</p>}

      {selectedIds.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#fff",
            borderTop: "1px solid #E3D3C9",
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "0.85rem", color: "#8C6B6F" }}>
              {selectedSeats.map((s) => s.seatCode).join(", ")}
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 500 }}>₹{total.toLocaleString("en-IN")}</div>
          </div>
          <button
            onClick={handleProceed}
            style={{
              padding: "0.8rem 1.6rem",
              background: "#C81D3B",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Proceed to payment
          </button>
        </div>
      )}
    </div>
  );
}