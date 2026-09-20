import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";

function Icon({ type }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (type) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );

    case "complaint":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M9 7h6" />
          <path d="M9 11h6" />
          <path d="M9 15h4" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="4" />
          <path d="M17 3.5a4 4 0 0 1 0 7.5" />
          <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
        </svg>
      );

    case "add":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      );

    case "support":
      return (
        <svg {...common}>
          <path d="M4 13a8 8 0 0 1 16 0" />
          <path d="M4 13v4a2 2 0 0 0 2 2h1v-6H4Z" />
          <path d="M20 13v4a2 2 0 0 1-2 2h-1v-6h3Z" />
        </svg>
      );

    case "notification":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "profile":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );

    case "logout":
      return (
        <svg {...common}>
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M21 3v18" />
        </svg>
      );

    default:
      return null;
  }
}

function SidebarLink({
  to,
  icon,
  label,
  onClick,
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `sidebar-link ${isActive ? "active" : ""}`
      }
    >
      <span className="sidebar-link-icon">
        <Icon type={icon} />
      </span>

      <span className="sidebar-link-label">
        {label}
      </span>
    </NavLink>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="sidebar-section-title">
      {children}
    </div>
  );
}

export default function Sidebar({
  open = false,
  onClose = () => {},
}) {
  const { user, logout } = useAuth();

  const role = user?.role;

  return (
    <>
      {open && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`sidebar ${
          open ? "sidebar-open" : ""
        }`}
      >

        {/* BRAND */}

        <div className="sidebar-brand">
          <div className="sidebar-logo">
            S
          </div>

          <div className="sidebar-brand-text">
            <strong>
              SmartResolve
            </strong>

            <span>
              Complaint Platform
            </span>
          </div>
        </div>


        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          <SectionTitle>
            Main
          </SectionTitle>

          <SidebarLink
            to="/dashboard"
            icon="dashboard"
            label="Dashboard"
            onClick={onClose}
          />


          {/* USER */}

          {role === ROLES.USER && (
            <>
              <SectionTitle>
                Complaints
              </SectionTitle>

              <SidebarLink
                to="/user/create-complaint"
                icon="add"
                label="Create Complaint"
                onClick={onClose}
              />

              <SidebarLink
                to="/user/complaints"
                icon="complaint"
                label="My Complaints"
                onClick={onClose}
              />
            </>
          )}


          {/* SUPPORT */}

          {role === ROLES.SUPPORT && (
            <>
              <SectionTitle>
                Workspace
              </SectionTitle>

              <SidebarLink
                to="/support"
                icon="support"
                label="Assigned Complaints"
                onClick={onClose}
              />
            </>
          )}


          {/* SUPERVISOR */}

          {role === ROLES.SUPERVISOR && (
            <>
              <SectionTitle>
                Operations
              </SectionTitle>

              <SidebarLink
                to="/supervisor"
                icon="dashboard"
                label="Overview"
                onClick={onClose}
              />

              <SidebarLink
                to="/supervisor/complaints"
                icon="complaint"
                label="Complaints"
                onClick={onClose}
              />
            </>
          )}


          {/* ADMIN */}

          {role === ROLES.ADMIN && (
            <>
              <SectionTitle>
                Administration
              </SectionTitle>

              <SidebarLink
                to="/admin"
                icon="dashboard"
                label="Overview"
                onClick={onClose}
              />

              <SidebarLink
                to="/admin/users"
                icon="users"
                label="Users"
                onClick={onClose}
              />

              <SidebarLink
                to="/admin/complaints"
                icon="complaint"
                label="Complaints"
                onClick={onClose}
              />
            </>
          )}


          {/* ACCOUNT */}

          <SectionTitle>
            Account
          </SectionTitle>

          <SidebarLink
            to="/notifications"
            icon="notification"
            label="Notifications"
            onClick={onClose}
          />

          <SidebarLink
            to="/profile"
            icon="profile"
            label="Profile"
            onClick={onClose}
          />

        </nav>


        {/* BOTTOM */}

        <div className="sidebar-bottom">

          <div className="sidebar-account">

            <div className="sidebar-account-avatar">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <div className="sidebar-account-info">

              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                {user?.role || "USER"}
              </span>

            </div>

          </div>


          <button
            type="button"
            className="sidebar-logout"
            onClick={logout}
          >
            <span>
              <Icon type="logout" />
            </span>

            <span>
              Sign out
            </span>
          </button>

        </div>

      </aside>
    </>
  );
}