import { Navigate, Outlet } from "react-router-dom";
import { canAny, homeFor } from "../utils/permissions";

// permissions: يكفي وحدة منهم. إذا فاضية، يكفي تسجيل الدخول.
export default function RequirePermission({ permissions = [] }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;
  if (permissions.length && !canAny(...permissions)) {
    return <Navigate to={homeFor()} replace />;
  }
  return <Outlet />;
}
