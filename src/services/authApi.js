import api, { saveSession, clearSession } from "./apiClient.js";

export async function loginUser(credentials) {
  const res = await api.post("/auth/login", credentials);
  saveSession(res.data.data);
  return res.data;
}

export async function logoutUser() {
  try {
    await api.post("/auth/logout");
  } finally {
    clearSession();
  }
}
