import { useState } from "react";

import complaintService from "../../services/complaintService";
import { STATUS, STATUS_FLOW } from "../../constants/status";

const LABELS = {
  [STATUS.OPEN]: "Open",
  [STATUS.IN_PROGRESS]: "In Progress",
  [STATUS.RESOLVED]: "Resolved",
  [STATUS.CLOSED]: "Closed",
};

export default function StatusActions({
  complaintId,
  currentStatus,
  onUpdated,
}) {
  const [selectedStatus, setSelectedStatus] =
    useState(currentStatus || STATUS.OPEN);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdate = async () => {
    if (!selectedStatus) {
      return;
    }

    if (selectedStatus === currentStatus) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await complaintService.updateStatus(
        complaintId,
        selectedStatus
      );

      setSuccess("Complaint status updated successfully.");

      if (onUpdated) {
        await onUpdated(
          response.data || {
            id: complaintId,
            status: selectedStatus,
          }
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update complaint status."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-actions-box">
      <div className="status-actions-header">
        <h4>Update Status</h4>
      </div>

      <div className="status-actions-controls">
        <select
          value={selectedStatus}
          onChange={(event) =>
            setSelectedStatus(event.target.value)
          }
          disabled={loading}
        >
          {STATUS_FLOW.map((status) => (
            <option key={status} value={status}>
              {LABELS[status]}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="primary-button"
          onClick={handleUpdate}
          disabled={
            loading ||
            !selectedStatus ||
            selectedStatus === currentStatus
          }
        >
          {loading ? "Updating..." : "Update Status"}
        </button>
      </div>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert success">
          {success}
        </div>
      )}
    </div>
  );
}