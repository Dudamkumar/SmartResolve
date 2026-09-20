import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <section className="welcome-card">

        <div className="welcome-content">
          <div className="welcome-eyebrow">
            SMARTRESOLVE
          </div>

          <h2>
            Welcome, {user?.name || "User"}
          </h2>

          <p>
            Your complaint management workspace
            is ready.
          </p>
        </div>

        <div className="welcome-role">
          {user?.role || "USER"}
        </div>

      </section>
    </AppLayout>
  );
}