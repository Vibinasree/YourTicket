import React, { useState } from "react";
import YourTicketAuth from "./pages/YourTicketAuth";
import EventDashboard from "./pages/EventDashboard";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";

function App() {
  const [screen, setScreen] = useState("auth");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [checkoutSeats, setCheckoutSeats] = useState([]);

  const handleLoginSuccess = (id, name) => {
    setUserId(id);
    setUserName(name || "Guest");
    setScreen("dashboard");
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
    setScreen("seats");
  };

  const handleProceedToPayment = (seats) => {
    setCheckoutSeats(seats);
    setScreen("checkout");
  };

  if (screen === "auth") return <YourTicketAuth onLoginSuccess={handleLoginSuccess} />;

  if (screen === "dashboard")
    return (
      <EventDashboard
        userId={userId}
        userName={userName}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onSelectEvent={handleSelectEvent}
      />
    );

  if (screen === "seats")
    return (
      <SeatSelection
        eventId={selectedEventId}
        userId={userId}
        onBack={() => setScreen("dashboard")}
        onProceedToPayment={handleProceedToPayment}
      />
    );

  if (screen === "checkout")
    return (
      <Checkout
        seats={checkoutSeats}
        userId={userId}
        onBack={() => setScreen("seats")}
        onDone={() => setScreen("dashboard")}
      />
    );

  return null;
}

export default App;