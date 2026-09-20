import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import StatusBadge from "../../components/complaints/StatusBadge";
import PriorityBadge from "../../components/complaints/PriorityBadge";

import complaintService from "../../services/complaintService";
import dashboardService from "../../services/dashboardService";
import userService from "../../services/userService";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [supportUsers, setSupportUsers] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [assigningId, setAssigningId] = useState(null);
  const [assignMessage, setAssignMessage] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        complaintsResponse,
        statsResponse,
        usersResponse,
        supportResponse,
      ] = await Promise.all([
        complaintService.getAll(),
        dashboardService.getStats(),
        userService.getAll(),
        userService.getSupportUsers(),
      ]);

      setComplaints(
        Array.isArray(complaintsResponse.data)
          ? complaintsResponse.data
          : []
      );

      setStats(statsResponse.data || null);

      setUsers(
        Array.isArray(usersResponse.data)
          ? usersResponse.data
          : []
      );

      setSupportUsers(
        Array.isArray(supportResponse.data)
          ? supportResponse.data
          : []
      );
    } catch (err) {
      console.error(
        "ADMIN DASHBOARD ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = async (
    complaintId,
    supportUserId
  ) => {
    if (!supportUserId) {
      return;
    }

    try {
      setAssigningId(complaintId);
      setAssignMessage("");
      setError("");

      await complaintService.assign(
        complaintId,
        Number(supportUserId)
      );

      setAssignMessage(
        "Complaint assigned successfully."
      );

      await loadDashboard();
    } catch (err) {
      console.error(
        "ASSIGNMENT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to assign complaint."
      );
    } finally {
      setAssigningId(null);
    }
  };

  const roleCounts = useMemo(() => {
    return {
      users: users.filter(
        (user) => user.role === "USER"
      ).length,

      support: users.filter(
        (user) => user.role === "SUPPORT"
      ).length,

      supervisors: users.filter(
        (user) => user.role === "SUPERVISOR"
      ).length,

      admins: users.filter(
        (user) => user.role === "ADMIN"
      ).length,
    };
  }, [users]);

  const recentComplaints = useMemo(() => {
    return [...complaints]
      .sort((a, b) => {
        const first = new Date(
          a.createdAt || 0
        ).getTime();

        const second = new Date(
          b.createdAt || 0
        ).getTime();

        return second - first;
      })
      .slice(0, 5);
  }, [complaints]);

  const criticalComplaints = useMemo(() => {
    return complaints.filter(
      (complaint) =>
        complaint.priority === "CRITICAL" &&
        complaint.status !== "CLOSED"
    ).length;
  }, [complaints]);

  const unassignedComplaints = useMemo(() => {
    return complaints.filter(
      (complaint) =>
        !complaint.assignedToName &&
        complaint.status !== "CLOSED"
    ).length;
  }, [complaints]);

  const totalComplaints =
    stats?.totalComplaints ?? complaints.length;

  const openComplaints =
    stats?.openComplaints ?? 0;

  const inProgressComplaints =
    stats?.inProgressComplaints ?? 0;

  const resolvedComplaints =
    stats?.resolvedComplaints ?? 0;

  const closedComplaints =
    stats?.closedComplaints ?? 0;

  const slaBreachedComplaints =
    stats?.slaBreachedComplaints ?? 0;

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AppLayout>
      <div className="admin-dashboard">

        {/* =========================================
            HERO
        ========================================= */}

        <section className="admin-hero">
          <div className="admin-hero-content">

            <div className="admin-hero-icon">
              S
            </div>

            <div>
              <p className="eyebrow">
                ADMIN CONTROL CENTER
              </p>

              <h1>
                SmartResolve Overview
              </h1>

              <p>
                Monitor complaints, manage users,
                assign support staff and track
                platform performance.
              </p>
            </div>

          </div>

          <div className="admin-hero-meta">
            <span>
              Platform status
            </span>

            <strong>
              Operational
            </strong>
          </div>
        </section>


        {/* =========================================
            ERROR
        ========================================= */}

        {error && (
          <div className="alert error admin-alert">
            {error}
          </div>
        )}

        {assignMessage && (
          <div className="alert success admin-alert">
            {assignMessage}
          </div>
        )}


        {/* =========================================
            KEY METRICS
        ========================================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-section-label">
                SYSTEM OVERVIEW
              </p>

              <h2>
                Key metrics
              </h2>
            </div>

            <span>
              Current platform data
            </span>

          </div>

          <div className="admin-kpi-grid">

            <AdminMetric
              label="Total Complaints"
              value={totalComplaints}
              icon="▤"
              tone="blue"
              description="All complaints"
            />

            <AdminMetric
              label="Open"
              value={openComplaints}
              icon="○"
              tone="orange"
              description="Waiting for action"
            />

            <AdminMetric
              label="In Progress"
              value={inProgressComplaints}
              icon="◐"
              tone="purple"
              description="Currently handled"
            />

            <AdminMetric
              label="Resolved"
              value={resolvedComplaints}
              icon="✓"
              tone="green"
              description="Successfully resolved"
            />

            <AdminMetric
              label="Closed"
              value={closedComplaints}
              icon="✓"
              tone="slate"
              description="Completed complaints"
            />

            <AdminMetric
              label="SLA Breached"
              value={slaBreachedComplaints}
              icon="!"
              tone="red"
              description="Past SLA deadline"
            />

          </div>

        </section>


        {/* =========================================
            QUICK ACCESS
        ========================================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-section-label">
                QUICK ACCESS
              </p>

              <h2>
                Administration
              </h2>
            </div>

          </div>

          <div className="admin-quick-actions">

            <Link
              to="/admin/users"
              className="admin-quick-card"
            >
              <div className="admin-quick-icon blue">
                ♙
              </div>

              <div className="admin-quick-content">

                <strong>
                  User Management
                </strong>

                <span>
                  Manage users, roles and accounts
                </span>

                <small>
                  {users.length} total accounts
                </small>

              </div>

              <div className="admin-quick-arrow">
                →
              </div>

            </Link>


            <Link
              to="/admin/complaints"
              className="admin-quick-card"
            >
              <div className="admin-quick-icon purple">
                ▤
              </div>

              <div className="admin-quick-content">

                <strong>
                  Complaint Management
                </strong>

                <span>
                  Review, assign and manage complaints
                </span>

                <small>
                  {complaints.length} total complaints
                </small>

              </div>

              <div className="admin-quick-arrow">
                →
              </div>

            </Link>

          </div>

        </section>


        {/* =========================================
            OPERATIONS
        ========================================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-section-label">
                OPERATIONS
              </p>

              <h2>
                System activity
              </h2>
            </div>

          </div>


          <div className="admin-operation-grid">

            {/* USER DISTRIBUTION */}

            <div className="admin-panel-card">

              <div className="admin-panel-header">

                <div>

                  <span className="admin-panel-icon blue">
                    ♙
                  </span>

                  <div>
                    <h3>
                      User Distribution
                    </h3>

                    <p>
                      Current account roles
                    </p>
                  </div>

                </div>

                <Link
                  to="/admin/users"
                  className="admin-card-link"
                >
                  Manage →
                </Link>

              </div>


              <div className="admin-role-grid">

                <RoleCount
                  label="Users"
                  value={roleCounts.users}
                />

                <RoleCount
                  label="Support"
                  value={roleCounts.support}
                />

                <RoleCount
                  label="Supervisors"
                  value={roleCounts.supervisors}
                />

                <RoleCount
                  label="Admins"
                  value={roleCounts.admins}
                />

              </div>

            </div>


            {/* SUPPORT OPERATIONS */}

            <div className="admin-panel-card">

              <div className="admin-panel-header">

                <div>

                  <span className="admin-panel-icon purple">
                    ⇄
                  </span>

                  <div>
                    <h3>
                      Support Operations
                    </h3>

                    <p>
                      Current workload overview
                    </p>
                  </div>

                </div>

                <Link
                  to="/admin/complaints"
                  className="admin-card-link"
                >
                  Open →
                </Link>

              </div>


              <div className="admin-operation-stat">

                <strong>
                  {supportUsers.length}
                </strong>

                <span>
                  support staff
                </span>

              </div>


              <div className="admin-small-stats">

                <div>
                  <strong>
                    {unassignedComplaints}
                  </strong>

                  <span>
                    Unassigned
                  </span>
                </div>

                <div>
                  <strong>
                    {criticalComplaints}
                  </strong>

                  <span>
                    Critical
                  </span>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =========================================
            ATTENTION
        ========================================= */}

        {(slaBreachedComplaints > 0 ||
          criticalComplaints > 0 ||
          unassignedComplaints > 0) && (

          <section className="admin-section">

            <div className="admin-section-heading">

              <div>

                <p className="admin-section-label">
                  ATTENTION
                </p>

                <h2>
                  Items requiring action
                </h2>

              </div>

              <span>
                Active issues
              </span>

            </div>


            <div className="admin-attention-grid">

              <AttentionCard
                title="SLA Breached"
                value={slaBreachedComplaints}
                description="Complaints exceeded their SLA."
                tone="red"
              />

              <AttentionCard
                title="Critical Complaints"
                value={criticalComplaints}
                description="Critical complaints still active."
                tone="orange"
              />

              <AttentionCard
                title="Unassigned"
                value={unassignedComplaints}
                description="Complaints waiting for support."
                tone="purple"
              />

            </div>

          </section>
        )}


        {/* =========================================
            RECENT COMPLAINTS
        ========================================= */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="admin-section-label">
                COMPLAINTS
              </p>

              <h2>
                Recent activity
              </h2>
            </div>

            <Link
              to="/admin/complaints"
              className="admin-card-link"
            >
              View all →
            </Link>

          </div>


          <div className="admin-complaints-card">

            {loading ? (
              <div className="admin-table-state">
                Loading complaints...
              </div>
            ) : recentComplaints.length === 0 ? (
              <div className="admin-table-state">
                No complaints found.
              </div>
            ) : (

              <div className="admin-complaint-table">

                <div className="admin-table-header">

                  <span>
                    Complaint
                  </span>

                  <span>
                    Priority
                  </span>

                  <span>
                    Status
                  </span>

                  <span>
                    Assigned To
                  </span>

                  <span>
                    Action
                  </span>

                </div>


                {recentComplaints.map(
                  (complaint) => (

                    <div
                      key={complaint.id}
                      className="admin-table-row"
                    >

                      {/* COMPLAINT */}

                      <div className="admin-complaint-title">

                        <strong>
                          {complaint.title ||
                            "Untitled complaint"}
                        </strong>

                        <span>
                          #{complaint.id}
                          {" · "}
                          {complaint.category ||
                            "OTHER"}
                          {" · "}
                          {formatDate(
                            complaint.createdAt
                          )}
                        </span>

                      </div>


                      {/* PRIORITY */}

                      <div>
                        <PriorityBadge
                          priority={
                            complaint.priority
                          }
                        />
                      </div>


                      {/* STATUS */}

                      <div>
                        <StatusBadge
                          status={
                            complaint.status
                          }
                        />
                      </div>


                      {/* ASSIGNMENT */}

                      <div className="admin-assignment-cell">

                        {complaint.assignedToName && (
                          <div className="admin-current-assignee">
                            {complaint.assignedToName}
                          </div>
                        )}

                        <select
                          value={
                            complaint.assignedToId
                              ? String(
                                  complaint.assignedToId
                                )
                              : ""
                          }
                          disabled={
                            assigningId ===
                            complaint.id
                          }
                          onChange={(event) =>
                            handleAssignment(
                              complaint.id,
                              event.target.value
                            )
                          }
                        >

                          <option value="">
                            {assigningId ===
                            complaint.id
                              ? "Assigning..."
                              : complaint.assignedToName
                                ? "Change support"
                                : "Assign support"}
                          </option>

                          {supportUsers.map(
                            (supportUser) => (
                              <option
                                key={
                                  supportUser.id
                                }
                                value={
                                  supportUser.id
                                }
                              >
                                {supportUser.name}
                              </option>
                            )
                          )}

                        </select>

                      </div>


                      {/* ACTION */}

                      <div>

                        <Link
                          to="/admin/complaints"
                          className="admin-view-button"
                        >
                          Manage
                        </Link>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </section>


        {/* =========================================
            SUMMARY
        ========================================= */}

        <section className="admin-section">

          <div className="admin-panel-card">

            <div className="admin-panel-header">

              <div>

                <span className="admin-panel-icon green">
                  ✓
                </span>

                <div>

                  <h3>
                    Platform Summary
                  </h3>

                  <p>
                    Current SmartResolve workload
                  </p>

                </div>

              </div>

            </div>


            <div className="admin-small-stats admin-summary-stats">

              <div>
                <strong>
                  {users.length}
                </strong>

                <span>
                  Total users
                </span>
              </div>


              <div>
                <strong>
                  {supportUsers.length}
                </strong>

                <span>
                  Support staff
                </span>
              </div>


              <div>
                <strong>
                  {openComplaints +
                    inProgressComplaints}
                </strong>

                <span>
                  Active complaints
                </span>
              </div>


              <div>
                <strong>
                  {resolvedComplaints +
                    closedComplaints}
                </strong>

                <span>
                  Completed
                </span>
              </div>

            </div>

          </div>

        </section>

      </div>
    </AppLayout>
  );
}


/* =========================================
   KPI CARD
========================================= */

function AdminMetric({
  label,
  value,
  icon,
  tone,
  description,
}) {
  return (
    <div className="admin-metric-card">

      <div className="admin-metric-top">

        <span
          className={`admin-metric-icon ${tone}`}
        >
          {icon}
        </span>

        <span className="admin-metric-label">
          {label}
        </span>

      </div>

      <strong className="admin-metric-value">
        {value}
      </strong>

      <span className="admin-metric-description">
        {description}
      </span>

    </div>
  );
}


/* =========================================
   ROLE COUNT
========================================= */

function RoleCount({
  label,
  value,
}) {
  return (
    <div className="admin-role-item">

      <strong>
        {value}
      </strong>

      <span>
        {label}
      </span>

    </div>
  );
}


/* =========================================
   ATTENTION CARD
========================================= */

function AttentionCard({
  title,
  value,
  description,
  tone,
}) {
  return (
    <div
      className={`admin-attention-card ${tone}`}
    >

      <div
        className={`admin-attention-dot ${tone}`}
      />

      <div>

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <p>
          {description}
        </p>

      </div>

    </div>
  );
}