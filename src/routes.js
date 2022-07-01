import { Navigate, Outlet } from "react-router-dom";
import { authentication } from "./authentication";

function AdminRoutes() {
  return authentication.isAdmin() ? <Outlet /> : <Navigate to="/login" />;
}

function PrivateRoutes() {
  return authentication.isAuthentication() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
}

function LogedIn() {
  return authentication.isAuthentication() ? <Navigate to="/" /> : <Outlet />;
}

export { AdminRoutes, PrivateRoutes, LogedIn };
