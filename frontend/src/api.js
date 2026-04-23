const API = "http://localhost:4000";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(name, email, password) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

export function isLoggedIn() {
  return !!getToken();
}

export async function createExpense(data, idempotencyKey) {
  const res = await fetch(`${API}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ ...data, idempotencyKey }),
  });
  if (res.status === 401) { logout(); window.location.reload(); }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.errors?.join(", ") || err.message || "Failed to create expense");
  }
  return res.json();
}

export async function fetchExpenses({ category, sort, page = 0, size = 10 } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);
  params.set("page", page);
  params.set("size", size);
  const res = await fetch(`${API}/expenses?${params}`, { headers: authHeaders() });
  if (res.status === 401) { logout(); window.location.reload(); }
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export async function deleteExpense(id) {
  const res = await fetch(`${API}/expenses/${id}`, { method: "DELETE", headers: authHeaders() });
  if (res.status === 401) { logout(); window.location.reload(); }
  if (!res.ok) throw new Error("Failed to delete expense");
}
