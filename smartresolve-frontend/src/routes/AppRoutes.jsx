import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import OAuth2Callback from "../pages/OAuth2Callback";

import RoleDashboard from "./RoleDashboard";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

import CreateComplaint from "../pages/user/CreateComplaint";
import MyComplaints from "../pages/user/MyComplaints";

import SupportDashboard from "../pages/support/SupportDashboard";

import SupervisorDashboard from "../pages/supervisor/SupervisorDashboard";
import SupervisorComplaints from "../pages/supervisor/SupervisorComplaints";

import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import ComplaintManagement from "../pages/admin/ComplaintManagement";

import Notifications from "../pages/notifications/Notifications";
import Profile from "../pages/profile/Profile";
import ComplaintDetails from "../pages/user/ComplaintDetails";
export default function AppRoutes() {
  return (
    <Routes>
      {/* Guest pages */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Google OAuth callback */}
      <Route
        path="/oauth2/callback"
        element={<OAuth2Callback />}
      />

      {/* Protected pages */}
      <Route element={<ProtectedRoute />}>
        {/* Main role-based dashboard */}
        <Route
          path="/dashboard"
          element={<RoleDashboard />}
        />

        {/* USER */}
        <Route
          path="/user/create-complaint"
          element={<CreateComplaint />}
        />

        <Route
          path="/user/complaints"
          element={<MyComplaints />}
        />

        {/* SUPPORT */}
        <Route
          path="/support"
          element={<SupportDashboard />}
        />

        {/* SUPERVISOR */}
        <Route
          path="/supervisor"
          element={<SupervisorDashboard />}
        />

        <Route
          path="/supervisor/complaints"
          element={<SupervisorComplaints />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/users"
          element={<UserManagement />}
        />

        <Route
          path="/admin/complaints"
          element={<ComplaintManagement />}
        />

        {/* COMMON */}
        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />
      </Route>

      {/* Default */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
      <Route
  path="/user/complaints/:id"
  element={<ComplaintDetails />}
/>
    </Routes>
  );
}