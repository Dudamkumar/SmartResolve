import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import ComplaintCard from "../../components/complaints/ComplaintCard";
import complaintService from "../../services/complaintService";
import dashboardService from "../../services/dashboardService";
import userService from "../../services/userService";

export default function SupervisorDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [supportUsers, setSupportUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        complaintResponse,
        statsResponse,
        supportResponse,
      ] = await Promise.all([
        complaintService.getAll(),
        dashboardService.getStats(),
        userService.getSupportUsers(),
      ]);

      setComplaints(
        complaintResponse.data || []
      );

      setStats(
        statsResponse.data || null
      );

      setSupportUsers(
        supportResponse.data || []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load supervisor dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const recentComplaints = useMemo(
    () => complaints.slice(0, 5),
    [complaints]
  );

  return (
    <AppLayout>
      <div className="page-container">

        <section className="dashboard-hero">
          <div>
            <p className="eyebrow">
              SUPERVISOR CONSOLE
            </p>

            <h1>
              Complaint Overview
            </h1>

            <p>
              Monitor complaints, workload and
              SLA performance.
            </p>
          </div>

          <Link
            to="/supervisor/complaints"
            className="primary-button"
          >
            Manage Complaints
          </Link>
        </section>

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        <section className="dashboard-section">

          <div className="stats-row">

            <div className="simple-stat">
              <span>Total</span>
              <strong>
                {stats?.totalComplaints ?? complaints.length}
              </strong>
            </div>

            <div className="simple-stat">
              <span>Open</span>
              <strong>
                {stats?.openComplaints ?? 0}
              </strong>
            </div>

            <div className="simple-stat">
              <span>In Progress</span>
              <strong>
                {stats?.inProgressComplaints ?? 0}
              </strong>
            </div>

            <div className="simple-stat">
              <span>Resolved</span>
              <strong>
                {stats?.resolvedComplaints ?? 0}
              </strong>
            </div>

            <div className="simple-stat">
              <span>SLA Breached</span>
              <strong>
                {stats?.slaBreachedComplaints ?? 0}
              </strong>
            </div>

            <div className="simple-stat">
              <span>Support Staff</span>
              <strong>
                {supportUsers.length}
              </strong>
            </div>

          </div>

        </section>

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>
                Recent Complaint Queue
              </h2>

              <p>
                Latest complaints requiring supervision
              </p>
            </div>

            <Link
              to="/supervisor/complaints"
              className="view-all-link"
            >
              View all
            </Link>
          </div>

          {loading && (
            <div className="loading-card">
              Loading dashboard...
            </div>
          )}

          {!loading &&
            recentComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                showActions
                onUpdated={loadDashboard}
              />
            ))}

        </section>

      </div>
    </AppLayout>
  );
}