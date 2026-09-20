import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import Comments from "./Comments";
import StatusActions from "./StatusActions";
import { Link } from "react-router-dom";
export default function ComplaintCard({
  complaint,
  showActions = false,
  onUpdated,
}) {
  if (!complaint) {
    return null;
  }

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString();
  };

  return (
    <article className="complaint-card">

      {/* Header */}

      <div className="complaint-head">
        <div>
          <p className="eyebrow">
            #{complaint.id}
            {" · "}
            {complaint.category || "OTHER"}
          </p>

          <h3>
            {complaint.title || "Untitled Complaint"}
          </h3>
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

      {/* Description */}

      <p className="complaint-description">
        {complaint.description || "No description available."}
      </p>

      {/* Complaint information */}

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
            {formatDate(complaint.createdAt)}
          </b>
        </span>

        <span>
          SLA deadline{" "}
          <b>
            {formatDate(complaint.slaDeadline)}
          </b>
        </span>

        <span>
          SLA status{" "}
          <b
            className={
              complaint.slaBreached
                ? "sla-breached"
                : "sla-ok"
            }
          >
            {complaint.slaBreached
              ? "BREACHED"
              : "ON TRACK"}
          </b>
        </span>

      </div>

      {/* Support / supervisor / admin actions */}

      {showActions && (
        <StatusActions
          complaintId={complaint.id}
          currentStatus={complaint.status}
          onUpdated={onUpdated}
        />
      )}
<div className="complaint-card-actions">
  <Link
    to={`/user/complaints/${complaint.id}`}
    className="secondary-button"
  >
    View Details
  </Link>
</div>
      {/* Comments */}

      <Comments
        complaintId={complaint.id}
      />

    </article>
  );
}