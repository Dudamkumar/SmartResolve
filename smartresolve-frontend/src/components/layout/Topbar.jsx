import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Topbar({
  onMenuClick,
}) {
  const { user } = useAuth();

  return (
    <header className="topbar">

      <div className="topbar-left">
        <button
          type="button"
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          ☰
        </button>
      </div>

      <div className="topbar-actions">

        <Link
          to="/notifications"
          className="topbar-notification"
          aria-label="Notifications"
        >
          ◉
        </Link>

        <span
          className={`role-badge role-${String(
            user?.role || ""
          ).toLowerCase()}`}
        >
          {user?.role || "USER"}
        </span>

        <div className="topbar-user">
          <strong>
            {user?.name || "User"}
          </strong>

          <span>
            {user?.email || ""}
          </span>
        </div>

      </div>

    </header>
  );
}