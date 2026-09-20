package com.smartresolve.backend.dto.dashboard;

public class DashboardResponse {

    private long totalComplaints;
    private long openComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private long closedComplaints;
    private long slaBreachedComplaints;
    private long highPriorityComplaints;
    private long criticalPriorityComplaints;

    public DashboardResponse() {
    }

    public long getTotalComplaints() {
        return totalComplaints;
    }

    public void setTotalComplaints(long totalComplaints) {
        this.totalComplaints = totalComplaints;
    }

    public long getOpenComplaints() {
        return openComplaints;
    }

    public void setOpenComplaints(long openComplaints) {
        this.openComplaints = openComplaints;
    }

    public long getInProgressComplaints() {
        return inProgressComplaints;
    }

    public void setInProgressComplaints(long inProgressComplaints) {
        this.inProgressComplaints = inProgressComplaints;
    }

    public long getResolvedComplaints() {
        return resolvedComplaints;
    }

    public void setResolvedComplaints(long resolvedComplaints) {
        this.resolvedComplaints = resolvedComplaints;
    }

    public long getClosedComplaints() {
        return closedComplaints;
    }

    public void setClosedComplaints(long closedComplaints) {
        this.closedComplaints = closedComplaints;
    }

    public long getSlaBreachedComplaints() {
        return slaBreachedComplaints;
    }

    public void setSlaBreachedComplaints(long slaBreachedComplaints) {
        this.slaBreachedComplaints = slaBreachedComplaints;
    }

    public long getHighPriorityComplaints() {
        return highPriorityComplaints;
    }

    public void setHighPriorityComplaints(long highPriorityComplaints) {
        this.highPriorityComplaints = highPriorityComplaints;
    }

    public long getCriticalPriorityComplaints() {
        return criticalPriorityComplaints;
    }

    public void setCriticalPriorityComplaints(long criticalPriorityComplaints) {
        this.criticalPriorityComplaints = criticalPriorityComplaints;
    }
}