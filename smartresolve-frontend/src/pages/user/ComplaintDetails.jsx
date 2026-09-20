import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import StatusBadge from "../../components/complaints/StatusBadge";
import PriorityBadge from "../../components/complaints/PriorityBadge";
import Comments from "../../components/complaints/Comments";
import complaintService from "../../services/complaintService";

export default function ComplaintDetails() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadComplaint = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await complaintService.getById(id);

        setComplaint(response.data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load complaint."
        );
      } finally {
        setLoading(false);
      }
    };

    loadComplaint();
  }, [id]);

  return (
    <AppLayout>
      <div className="page-container">

        <div className="page-heading">
          <div>
            <p className="eyebrow">
              COMPLAINT DETAILS
            </p>

            <h1>
              Complaint #{id}
            </h1>

            <p>
              View the complete complaint information.
            </p>
          </div>
        </div>

        <Link
          to="/user/complaints"
          className="secondary-button"
        >
          ← Back to My Complaints
        </Link>

        {loading && (
          <div className="loading-card">
            Loading complaint...
          </div>
        )}

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        {!loading && !error && complaint && (
          <div className="complaint-details-card">

            <div className="complaint-details-header">
              <div>
                <p className="eyebrow">
                  #{complaint.id} ·{" "}
                  {complaint.category}
                </p>

                <h2>
                  {complaint.title}
                </h2>
              </div>

              <div className="badges">
                <StatusBadge
                  status={complaint.status}
                />

                <PriorityBadge
                  priority={complaint.priority}
                />
              </div>
            </div>

            <div className="complaint-details-description">
              <h3>Description</h3>

              <p>
                {complaint.description}
              </p>
            </div>

            <div className="meta-grid">

              <span>
                Created by{" "}
                <b>
                  {complaint.createdByName || "—"}
                </b>
              </span>

              <span>
                Assigned to{" "}
                <b>
                  {complaint.assignedToName ||
                    "Unassigned"}
                </b>
              </span>

              <span>
                Created{" "}
                <b>
                  {complaint.createdAt
                    ? new Date(
                        complaint.createdAt
                      ).toLocaleString()
                    : "—"}
                </b>
              </span>

              <span>
                SLA Deadline{" "}
                <b>
                  {complaint.slaDeadline
                    ? new Date(
                        complaint.slaDeadline
                      ).toLocaleString()
                    : "—"}
                </b>
              </span>

              <span>
                SLA Status{" "}
                <b>
                  {complaint.slaBreached
                    ? "BREACHED"
                    : "ON TRACK"}
                </b>
              </span>

            </div>

            {complaint.status === "CLOSED" && (
              <div className="closed-banner">
                <strong>
                  Complaint Closed
                </strong>

                <p>
                  This complaint has completed the
                  support workflow and is now closed.
                </p>
              </div>
            )}

            <Comments
              complaintId={complaint.id}
            />

          </div>
        )}
      </div>
    </AppLayout>
  );
}