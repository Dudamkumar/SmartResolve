import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import ComplaintCard from "../../components/complaints/ComplaintCard";
import complaintService from "../../services/complaintService";

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await complaintService.getMyComplaints();

      setComplaints(response.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load your complaints."
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

      closed: complaints.filter(
        (item) => item.status === "CLOSED"
      ).length,
    };
  }, [complaints]);

  const recentComplaints = complaints.slice(0, 5);

  return (
    <AppLayout>
      <div className="page-container">

        {/* Hero */}

        <section className="dashboard-hero">
          <div>
            <p className="eyebrow">
              SMARTRESOLVE
            </p>

            <h1>
              Complaint Dashboard
            </h1>

            <p>
              Track your complaints, monitor progress,
              and stay updated.
            </p>
          </div>

          <Link
            to="/user/create-complaint"
            className="primary-button dashboard-primary-action"
          >
            + Create Complaint
          </Link>
        </section>

        {/* Statistics */}

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Overview</h2>
              <p>Your complaint summary</p>
            </div>
          </div>

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
              <span>Closed</span>
              <strong>{stats.closed}</strong>
            </div>

          </div>
        </section>

        {/* Quick actions */}

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Common complaint actions</p>
            </div>
          </div>

          <div className="quick-actions">

            <Link
              to="/user/create-complaint"
              className="quick-action"
            >
              <strong>
                Create Complaint
              </strong>

              <span>
                Report a new problem
              </span>
            </Link>

            <Link
              to="/user/complaints"
              className="quick-action"
            >
              <strong>
                My Complaints
              </strong>

              <span>
                View all your complaints
              </span>
            </Link>

            <Link
              to="/notifications"
              className="quick-action"
            >
              <strong>
                Notifications
              </strong>

              <span>
                Check latest updates
              </span>
            </Link>

          </div>
        </section>

        {/* Recent complaints */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>
                Recent Complaints
              </h2>

              <p>
                Your latest complaint activity
              </p>
            </div>

            <Link
              to="/user/complaints"
              className="view-all-link"
            >
              View all
            </Link>
          </div>

          {loading && (
            <div className="loading-card">
              Loading complaints...
            </div>
          )}

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            recentComplaints.length === 0 && (
              <div className="empty-card">
                <h3>
                  No complaints yet
                </h3>

                <p>
                  Create your first complaint
                  to start tracking an issue.
                </p>

                <Link
                  to="/user/create-complaint"
                  className="primary-button"
                >
                  Create Complaint
                </Link>
              </div>
            )}

          {!loading &&
            !error &&
            recentComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onUpdated={loadComplaints}
              />
            ))}

        </section>

      </div>
    </AppLayout>
  );
}