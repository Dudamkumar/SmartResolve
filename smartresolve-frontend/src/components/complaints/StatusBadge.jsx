import { STATUS } from "../../constants/status";

const LABELS = {
  [STATUS.OPEN]: "Open",
  [STATUS.IN_PROGRESS]: "In Progress",
  [STATUS.RESOLVED]: "Resolved",
  [STATUS.CLOSED]: "Closed",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`status-badge status-${status}`}
    >
      {LABELS[status] || status}
    </span>
  );
}