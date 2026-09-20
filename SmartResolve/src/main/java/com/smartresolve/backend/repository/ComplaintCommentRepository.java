package com.smartresolve.backend.repository;

import com.smartresolve.backend.entity.ComplaintComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintCommentRepository
        extends JpaRepository<ComplaintComment, Long> {

    List<ComplaintComment> findByComplaintIdOrderByCreatedAtAsc(
            Long complaintId);
}