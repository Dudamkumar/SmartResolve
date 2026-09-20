package com.smartresolve.backend.repository;

import com.smartresolve.backend.entity.ComplaintHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintHistoryRepository
        extends JpaRepository<ComplaintHistory, Long> {

    List<ComplaintHistory> findByComplaintIdOrderByChangedAtAsc(
            Long complaintId);
}