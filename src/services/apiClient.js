import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

const api = axios.create({ baseURL: BASE_URL, withCredentials: true });

// الـ roles/permissions ممكن ترجع strings أو objects حسب authService عندك
const toName = (x) => (typeof x === "string" ? x : x?.name);

export function saveSession({ user, roles, permissions, accessToken }) {
  localStorage.setItem("token", accessToken);
  if (user) {
    localStorage.setItem("userId", user.id ?? user._id ?? "");
    localStorage.setItem("userName", user.full_name ?? "");
  }
  const roleNames = (roles || []).map(toName).filter(Boolean);
  localStorage.setItem("userRole", roleNames[0] || "student");
  localStorage.setItem("userRoles", JSON.stringify(roleNames));
  localStorage.setItem(
    "userPermissions",
    JSON.stringify((permissions || []).map(toName).filter(Boolean))
  );
}

export function clearSession() {
  [
    "token",
    "userRole",
    "userRoles",
    "userId",
    "userName",
    "userPermissions",
  ].forEach((k) => localStorage.removeItem(k));
}

function toError(error) {
  console.error("API error:", {
    url: error.config?.baseURL + error.config?.url,
    method: error.config?.method,
    code: error.code,
    hasResponse: !!error.response,
    status: error.response?.status,
    data: error.response?.data,
  });
  const data = error.response?.data;
  const err = new Error(data?.message || error.message || "Unexpected error");
  err.status = error.response?.status;
  err.errors = data?.errors || data?.details || [];
  return err;
}

export function errorText(e) {
  if (e?.errors?.length) {
    return e.errors.map((x) => `${x.field}: ${x.message}`).join("\n");
  }
  return e?.message || "Unexpected error";
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthCall = original?.url?.startsWith("/auth/");

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthCall
    ) {
      original._retry = true;
      try {
        refreshing ??= axios
          .post(`${BASE_URL}/auth/refresh`, null, { withCredentials: true })
          .finally(() => {
            refreshing = null;
          });
        const res = await refreshing;
        saveSession(res.data.data);
        original.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
        return api(original);
      } catch {
        clearSession();
        window.location.href = "/login";
        return Promise.reject(toError(error));
      }
    }
    return Promise.reject(toError(error));
  }
);

export default api;
