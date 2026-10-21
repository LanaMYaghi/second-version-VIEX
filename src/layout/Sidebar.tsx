// src/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { NAV_ITEMS, canSee } from "./navConfig";
import { getRole } from "../utils/permissions";

// العنصر الفعّال بيصير أبيض وبيلتحم مع المحتوى. before و after بيعملوا المنحنيات فوقه وتحته
const base =
  "relative flex items-center gap-4 rounded-l-full py-3 pl-6 pr-4 text-sm font-medium transition-colors";
const inactive = "text-green-100 hover:bg-white/10 hover:text-white";
const active =
  "bg-white text-[#3A5B22] " +
  "before:content-[''] before:absolute before:right-0 before:-top-5 before:h-5 before:w-5 " +
  "before:rounded-br-full before:shadow-[5px_5px_0_5px_#fff] " +
  "after:content-[''] after:absolute after:right-0 after:-bottom-5 after:h-5 after:w-5 " +
  "after:rounded-tr-full after:shadow-[5px_-5px_0_5px_#fff]";

export default function Sidebar({
  brand = "VIEX",
  items = NAV_ITEMS,
  open = false,
  onClose,
}) {
  const role = getRole();
  const visibleItems = items.filter((item) => canSee(item, role));

  return (
    <aside
      className={
        "fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col bg-[#329072] text-white " +
        "transition-transform md:static md:translate-x-0 " +
        (open ? "translate-x-0" : "-translate-x-full")
      }
    >
      <div className="px-8 pb-12 pt-10 text-center text-2xl font-semibold">
        {brand}
      </div>

      {/* pl فقط بدون pr، حتى يلمس العنصر الأبيض حافة المحتوى */}
      <nav className="flex-1 space-y-5 pl-5">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
