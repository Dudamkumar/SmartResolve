export const STATUS = Object.freeze({
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
});

export const STATUS_FLOW = Object.freeze([
  STATUS.OPEN,
  STATUS.IN_PROGRESS,
  STATUS.RESOLVED,
  STATUS.CLOSED,
]);