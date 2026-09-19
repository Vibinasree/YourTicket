import React, { useState } from "react";
import { confirmSeat } from "../api/api";

export default function Checkout({ seats, userId, onBack, onDone }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const total = seats.reduce((sum, s) => sum + s.price, 0);

  const handlePay = async () => {
    setProcessing(true);
    setError("");
    try {
      for (const seat of seats) {
        await confirmSeat(seat.id, userId);
      }
      alert("Booking confirmed for: " + seats.map((s) => s.seatCode).join(", "));
      onDone();
    } catch (e) {
      setError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Work Sans', sans-serif", maxWidth: "480px", margin: "0 auto" }}>
      <button onClick={onBack} style={{ marginBottom: "1rem", background: "none", border: "none", cursor: "pointer" }}>
        ← Back to seats
      </button>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Confirm and pay</h2>

      <div style={{ border: "1px solid #E3D3C9", borderRadius: 10, padding: "1rem", margin: "1rem 0" }}>
        {seats.map((s) => (
          <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0" }}>
            <span>{s.seatCode} ({s.tier})</span>
            <span>₹{s.price.toLocaleString("en-IN")}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500, borderTop: "1px solid #E3D3C9", marginTop: "0.6rem", paddingTop: "0.6rem" }}>
          <span>Total</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {error && <p style={{ color: "#C81D3B" }}>{error}</p>}

      <button
        onClick={handlePay}
        disabled={processing}
        style={{
          width: "100%",
          padding: "0.9rem 0",
          background: "#C81D3B",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: processing ? "not-allowed" : "pointer",
          opacity: processing ? 0.6 : 1,
        }}
      >
        {processing ? "Processing..." : "Pay and confirm booking"}
      </button>
    </div>
  );
}