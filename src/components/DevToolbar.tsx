// src/components/DevToolbar.jsx
import { USE_MOCK } from "../services/http.js";
import { homeFor } from "../utils/permissions.js";

const USERS = [
  { label: "teacher", role: "teacher", id: 1 },
  { label: "admin", role: "admin", id: 2 },
  { label: "secretary", role: "secretary", id: 3 },
  { label: "student 1", role: "student", id: 5 },
  { label: "student 2", role: "student", id: 6 },
  { label: "student 3", role: "student", id: 7 },
];

function DevToolbar() {
  if (!USE_MOCK) return null;

  const currentRole = localStorage.getItem("userRole");
  const currentId = Number(localStorage.getItem("userId"));

  const switchTo = (u) => {
    localStorage.setItem("token", "mock-token");
    localStorage.setItem("userRole", u.role);
    localStorage.setItem("userId", u.id);
    window.location.href = homeFor(u.role);
  };

  const logout = () => {
    ["token", "userRole", "userId"].forEach((k) => localStorage.removeItem(k));
    window.location.href = "/login";
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-wrap items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
      <span className="text-slate-400">Role:</span>
      {USERS.map((u) => (
        <button
          key={u.label}
          onClick={() => switchTo(u)}
          className={`rounded-lg px-2.5 py-1 font-semibold ${
            currentRole === u.role && currentId === u.id
              ? "bg-white text-slate-900"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          {u.label}
        </button>
      ))}
      <button onClick={logout} className="ms-1 text-rose-300 hover:underline">
        Logout
      </button>
    </div>
  );
}

export default DevToolbar;
