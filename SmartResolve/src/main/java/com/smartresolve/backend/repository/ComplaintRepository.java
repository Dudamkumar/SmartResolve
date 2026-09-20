package com.smartresolve.backend.repository;

import com.smartresolve.backend.entity.Complaint;
import com.smartresolve.backend.enums.ComplaintPriority;
import com.smartresolve.backend.enums.ComplaintStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository
        extends JpaRepository<Complaint, Long> {

    List<Complaint> findByCreatedById(Long userId);

    List<Complaint> findByAssignedToId(Long userId);

    long countByStatus(ComplaintStatus status);

    long countBySlaBreachedTrue();

    long countByPriority(ComplaintPriority priority);
}