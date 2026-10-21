// src/layout/AppLayout.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { NAV_ITEMS } from "./navConfig";

const HeaderContext = createContext({ setHeader: () => {} });

/**
 * بأي صفحة بتغيّري العنوان اللي بالـ Navbar:
 *   usePageHeader("Teachers", "12 teachers");
 * بدونها بيظهر اسم العنصر من navConfig
 */
export function usePageHeader(title, subtitle = "") {
  const { setHeader } = useContext(HeaderContext);
  useEffect(() => {
    setHeader({ title, subtitle });
    return () => setHeader({ title: "", subtitle: "" });
  }, [title, subtitle, setHeader]);
}

export default function AppLayout() {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [header, setHeader] = useState({ title: "", subtitle: "" });

  // سكّري الـ drawer عند التنقل (موبايل)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // الإطار كله للمسجّلين فقط
  if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;

  // العنوان الافتراضي: أطول مسار مطابق من navConfig
  const current = NAV_ITEMS.filter(
    (i) => pathname === i.to || pathname.startsWith(i.to + "/")
  ).sort((a, b) => b.to.length - a.to.length)[0];

  return (
    <HeaderContext.Provider value={{ setHeader }}>
      <div className="flex h-screen w-full overflow-hidden bg-white" dir="ltr">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* خلفية معتمة للموبايل */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar
            title={header.title || current?.label || ""}
            subtitle={header.subtitle}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto bg-white px-8 pb-8">
            {/* max-w يمنع المحتوى من التمدد الزائد على الشاشات الكبيرة */}
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </HeaderContext.Provider>
  );
}
