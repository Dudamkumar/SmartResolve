import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <AppLayout>
      <div className="page-container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">ACCOUNT</p>

            <h1>My Profile</h1>

            <p>
              View your SmartResolve account information.
            </p>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="profile-info">
            <h2>{user?.name || "User"}</h2>

            <p>
              <strong>Email:</strong>{" "}
              {user?.email || "-"}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {user?.role || "-"}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="danger-button"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </AppLayout>
  );
}