// src/guards/RequireRole.jsx
import { Navigate, Outlet } from "react-router-dom";
import { getRole } from "../utils/permissions";

export default function RequireRole({ roles }) {
  const token = localStorage.getItem("token");
  const role = getRole();

  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/courses" replace />;

  return <Outlet />;
}
