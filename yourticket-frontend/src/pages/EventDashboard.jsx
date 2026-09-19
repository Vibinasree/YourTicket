import React, { useEffect, useState } from "react";

const CATEGORIES = ["All", "Concerts", "Sports", "Theatre", "Comedy"];

export default function EventDashboard({ userId, userName, darkMode, onToggleDarkMode, onSelectEvent }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [openTooltip, setOpenTooltip] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/events")
      .then((res) => res.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  const theme = darkMode
    ? {
        bg: "#1A1113",
        text: "#FBF3EC",
        muted: "#B79E9B",
        border: "#3A2C2E",
        cardBg: "#241A1D",
      }
    : {
        bg: "#FBF3EC",
        text: "#1A1113",
        muted: "#8C6B6F",
        border: "#E3D3C9",
        cardBg: "#FFFFFF",
      };

  const filtered = events.filter((e) => {
    const matchesCategory = category === "All" || e.category === category;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      e.name.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif", background: theme.bg, minHeight: "100vh", color: theme.text }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          borderBottom: `1px solid ${theme.border}`,
          position: "relative",
        }}
      >
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", margin: 0 }}>YourTicket.com</p>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            maxWidth: "360px",
            margin: "0 2rem",
            padding: "0.55rem 1rem",
            borderRadius: "999px",
            border: `1px solid ${theme.border}`,
            fontSize: "0.9rem",
            background: theme.cardBg,
            color: theme.text,
          }}
          placeholder="Search events, artists, venues"
        />

        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <span style={{ fontSize: "0.85rem" }}>{userName || `User #${userId}`}</span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: "none",
              border: `1px solid ${theme.border}`,
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              cursor: "pointer",
              color: theme.text,
            }}
          >
            ⚙
          </button>
        </div>

        {showSettings && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: "2rem",
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: "10px",
              padding: "1rem",
              minWidth: "200px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 10,
            }}
          >
            <p style={{ fontSize: "0.8rem", color: theme.muted, margin: "0 0 0.6rem 0" }}>Settings</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem" }}>Dark theme</span>
              <input type="checkbox" checked={darkMode} onChange={onToggleDarkMode} />
            </div>
          </div>
        )}
      </div>

      <div style={{ background: "linear-gradient(160deg, #C81D3B 0%, #8F1226 100%)", color: "#FBF3EC", padding: "2.5rem 2rem" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.6rem", margin: "0 0 0.5rem 0" }}>Tonight's hottest seats</h1>
        <p style={{ margin: 0, color: "#F3D9DC" }}>Book before the good ones are gone.</p>
      </div>

      <div style={{ display: "flex", gap: "0.6rem", padding: "1.2rem 2rem", borderBottom: `1px solid ${theme.border}`, flexWrap: "wrap" }}>
        {CATEGORIES.map((c) => (
          <span
            key={c}
            onClick={() => setCategory(c)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "999px",
              fontSize: "0.85rem",
              cursor: "pointer",
              border: category === c ? "none" : `1px solid ${theme.border}`,
              background: category === c ? "#C81D3B" : "transparent",
              color: category === c ? "#FBF3EC" : theme.muted,
            }}
          >
            {c}
          </span>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.2rem", padding: "1.5rem 2rem" }}>
        {filtered.length === 0 && <p style={{ color: theme.muted }}>No events match your search.</p>}
        {filtered.map((event) => (
          <div
            key={event.id}
            onClick={() => onSelectEvent(event.id)}
            style={{
              background: theme.cardBg,
              borderRadius: "12px",
              border: `1px solid ${theme.border}`,
              overflow: "hidden",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "130px",
                background: event.imageUrl
                  ? `url(${event.imageUrl}) center/cover`
                  : darkMode ? "#3A2C2E" : "#E9D9CD",
              }}
            />
            {event.seatsLeft <= 10 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenTooltip(openTooltip === event.id ? null : event.id);
                }}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "#C81D3B",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "26px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                !
              </span>
            )}
            {openTooltip === event.id && (
              <div style={{ position: "absolute", top: "40px", right: "10px", background: "#1A1113", color: "#fff", fontSize: "0.72rem", padding: "0.4rem 0.6rem", borderRadius: "6px" }}>
                Only {event.seatsLeft} seats left — book soon
              </div>
            )}
            <div style={{ padding: "0.9rem 1rem" }}>
              <p style={{ fontWeight: 500, fontSize: "0.95rem", margin: "0 0 0.2rem 0" }}>{event.name}</p>
              <p style={{ fontSize: "0.8rem", color: theme.muted, margin: 0 }}>{event.venue} · {event.date}</p>
              <p style={{ fontSize: "0.78rem", color: theme.muted, marginTop: "0.4rem" }}>{event.seatsLeft ?? "—"} seats left</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}