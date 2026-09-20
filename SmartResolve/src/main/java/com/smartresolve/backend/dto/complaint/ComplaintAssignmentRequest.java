package com.smartresolve.backend.dto.complaint;

import jakarta.validation.constraints.NotNull;

public class ComplaintAssignmentRequest {

    @NotNull(message = "Support user ID is required")
    private Long assignedToId;

    public ComplaintAssignmentRequest() {
    }

    public Long getAssignedToId() {
        return assignedToId;
    }

    public void setAssignedToId(Long assignedToId) {
        this.assignedToId = assignedToId;
    }
}