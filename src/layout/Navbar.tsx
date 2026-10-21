// src/layout/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, ChevronDown, LogOut } from "lucide-react";
import { getRole } from "../utils/permissions";

export default function Navbar({ title, subtitle, onMenuClick }) {
  const navigate = useNavigate();
  const role = getRole();
  const name = localStorage.getItem("userName") || role;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // سكّري القائمة لما تضغطي برّاها
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    ["token", "userRole", "userId", "userName"].forEach((k) =>
      localStorage.removeItem(k)
    );
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex items-start justify-between gap-4 px-8 pb-4 pt-8">
      <div className="flex items-start gap-3">
        {/* زر القائمة للموبايل */}
        <button
          type="button"
          onClick={onMenuClick}
          className="mt-1 rounded-lg p-1 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold uppercase text-[#41a2ad]">
            {(name || "?").charAt(0)}
          </span>
          <ChevronDown size={14} className="text-slate-500" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-100 bg-white p-2 shadow-lg">
            <div className="border-b border-slate-100 px-3 py-2">
              <p className="text-sm font-medium text-slate-800">{name}</p>
              <p className="text-xs capitalize text-slate-500">{role}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
