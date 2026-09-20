package com.smartresolve.backend.dto.complaint;

import com.smartresolve.backend.enums.ComplaintStatus;
import jakarta.validation.constraints.NotNull;

public class ComplaintStatusRequest {

    @NotNull(message = "Status is required")
    private ComplaintStatus status;

    public ComplaintStatusRequest() {
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }
}