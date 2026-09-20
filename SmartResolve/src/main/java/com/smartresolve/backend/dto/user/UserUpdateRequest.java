package com.smartresolve.backend.dto.user;

import com.smartresolve.backend.entity.Role;
import jakarta.validation.constraints.NotNull;

public class UserUpdateRequest {

    @NotNull(message = "Role is required")
    private Role role;

    private Long departmentId;

    public UserUpdateRequest() {
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
}