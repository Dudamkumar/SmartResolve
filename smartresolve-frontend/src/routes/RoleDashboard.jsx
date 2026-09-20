import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";

import UserDashboard from "../pages/user/UserDashboard";
import SupportDashboard from "../pages/support/SupportDashboard";
import SupervisorDashboard from "../pages/supervisor/SupervisorDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

export default function RoleDashboard() {
  const { user } = useAuth();

  if (!user?.role) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case ROLES.USER:
      return <UserDashboard />;

    case ROLES.SUPPORT:
      return <SupportDashboard />;

    case ROLES.SUPERVISOR:
      return <SupervisorDashboard />;

    case ROLES.ADMIN:
      return <AdminDashboard />;

    default:
      return <Navigate to="/login" replace />;
  }
}