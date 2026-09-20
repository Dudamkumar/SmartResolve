import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import ComplaintCard from "../../components/complaints/ComplaintCard";
import complaintService from "../../services/complaintService";

export default function SupportDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await complaintService.getAssignedComplaints();

      setComplaints(response.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load assigned complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const stats = useMemo(() => {
    return {
      total: complaints.length,

      open: complaints.filter(
        (item) => item.status === "OPEN"
      ).length,

      inProgress: complaints.filter(
        (item) => item.status === "IN_PROGRESS"
      ).length,

      resolved: complaints.filter(
        (item) => item.status === "RESOLVED"
      ).length,

      breached: complaints.filter(
        (item) => item.slaBreached === true
      ).length,

      critical: complaints.filter(
        (item) => item.priority === "CRITICAL"
      ).length,
    };
  }, [complaints]);

  return (
    <AppLayout>
      <div className="page-container">

        <section className="dashboard-hero">
          <div>
            <p className="eyebrow">
              SUPPORT CONSOLE
            </p>

            <h1>
              Assigned Complaints
            </h1>

            <p>
              Handle assigned complaints and keep
              their status up to date.
            </p>
          </div>

          <Link
            to="/notifications"
            className="secondary-button"
          >
            Notifications
          </Link>
        </section>

        <section className="dashboard-section">

          <div className="stats-row">

            <div className="simple-stat">
              <span>Total</span>
              <strong>{stats.total}</strong>
            </div>

            <div className="simple-stat">
              <span>Open</span>
              <strong>{stats.open}</strong>
            </div>

            <div className="simple-stat">
              <span>In Progress</span>
              <strong>{stats.inProgress}</strong>
            </div>

            <div className="simple-stat">
              <span>Resolved</span>
              <strong>{stats.resolved}</strong>
            </div>

            <div className="simple-stat">
              <span>Critical</span>
              <strong>{stats.critical}</strong>
            </div>

            <div className="simple-stat">
              <span>SLA Breached</span>
              <strong>{stats.breached}</strong>
            </div>

          </div>

        </section>

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>
                Assigned Queue
              </h2>

              <p>
                Complaints requiring your attention
              </p>
            </div>
          </div>

          {loading && (
            <div className="loading-card">
              Loading assigned complaints...
            </div>
          )}

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            complaints.length === 0 && (
              <div className="empty-card">
                <h3>
                  No complaints assigned
                </h3>

                <p>
                  Assigned complaints will appear here.
                </p>
              </div>
            )}

          {!loading &&
            complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                showActions
                onUpdated={loadComplaints}
              />
            ))}

        </section>

      </div>
    </AppLayout>
  );
}