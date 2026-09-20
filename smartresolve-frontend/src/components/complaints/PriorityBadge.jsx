import { PRIORITY } from "../../constants/priority";

const LABELS = {
  [PRIORITY.LOW]: "Low",
  [PRIORITY.MEDIUM]: "Medium",
  [PRIORITY.HIGH]: "High",
  [PRIORITY.CRITICAL]: "Critical",
};

export default function PriorityBadge({
  priority,
}) {
  return (
    <span
      className={`priority-badge priority-${priority}`}
    >
      {LABELS[priority] || priority}
    </span>
  );
}