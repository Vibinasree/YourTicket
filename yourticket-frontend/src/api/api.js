const BASE_URL = "http://localhost:8080/api";

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.text();
}

export async function signup(name, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.text();
}
export async function loginUser(email, password) {
  const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Login failed");
  }
  return res.json();
}

export async function registerUser(name, email, password) {
  const res = await fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Signup failed");
  }
  return res.text();
}
export async function getSeats(eventId) {
  const res = await fetch(`${BASE_URL}/seats/event/${eventId}`);
  return res.json();
}

export async function holdSeat(seatId, userId) {
  const res = await fetch(`${BASE_URL}/seats/${seatId}/hold?userId=${userId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.text();
}

export async function confirmSeat(seatId, userId) {
  const res = await fetch(`${BASE_URL}/seats/${seatId}/confirm?userId=${userId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}