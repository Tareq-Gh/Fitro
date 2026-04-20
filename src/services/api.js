import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
});

export const submitUserInfo = (data) => api.post("/api/users", data);

export const registerUser = (data) => api.post("/api/register", data);

export const getUsers = (token) =>
  api.get("/api/users", { headers: { Authorization: `Bearer ${token}` } });

export const login = (username, password) =>
  api.post("/api/auth", { username, password });

export const lookupByEmail = (email) =>
  api.get(`/api/lookup?email=${encodeURIComponent(email)}`);

export const submitTryOn = (data) => api.post("/api/tryon", data);
