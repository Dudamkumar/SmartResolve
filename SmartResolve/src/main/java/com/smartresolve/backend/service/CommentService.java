package com.smartresolve.backend.service;

import com.smartresolve.backend.dto.complaint.CommentRequest;
import com.smartresolve.backend.dto.complaint.CommentResponse;
import com.smartresolve.backend.entity.Complaint;
import com.smartresolve.backend.entity.ComplaintComment;
import com.smartresolve.backend.entity.User;
import com.smartresolve.backend.repository.ComplaintCommentRepository;
import com.smartresolve.backend.repository.ComplaintRepository;
import com.smartresolve.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final ComplaintCommentRepository commentRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CommentService(
            ComplaintCommentRepository commentRepository,
            ComplaintRepository complaintRepository,
            UserRepository userRepository,
            NotificationService notificationService) {

        this.commentRepository = commentRepository;
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    /*
     * =========================================================
     * ADD COMMENT
     * =========================================================
     */

    public CommentResponse addComment(
            Long complaintId,
            CommentRequest request,
            String email) {

        /*
         * Find complaint.
         */
        Complaint complaint =
                complaintRepository.findById(
                        complaintId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Complaint not found"
                        )
                );

        /*
         * Find logged-in user.
         */
        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        /*
         * Create comment.
         */
        ComplaintComment comment =
                new ComplaintComment();

        comment.setComplaint(
                complaint
        );

        comment.setUser(
                user
        );

        comment.setComment(
                request.getComment()
        );

        /*
         * Save comment first.
         */
        ComplaintComment savedComment =
                commentRepository.save(
                        comment
                );

        /*
         * Create notifications after successful save.
         */
        notificationService.notifyCommentAdded(
                complaint,
                user
        );

        return toResponse(
                savedComment
        );
    }

    /*
     * =========================================================
     * GET COMMENTS
     * =========================================================
     */

    public List<CommentResponse> getComments(
            Long complaintId) {

        return commentRepository
                .findByComplaintIdOrderByCreatedAtAsc(
                        complaintId
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /*
     * =========================================================
     * CONVERT ENTITY -> RESPONSE
     * =========================================================
     */

    private CommentResponse toResponse(
            ComplaintComment comment) {

        CommentResponse response =
                new CommentResponse();

        response.setId(
                comment.getId()
        );

        if (comment.getUser() != null) {

            response.setUserId(
                    comment.getUser().getId()
            );

            response.setUserName(
                    comment.getUser().getName()
            );

            response.setUserEmail(
                    comment.getUser().getEmail()
            );
        }

        response.setComment(
                comment.getComment()
        );

        response.setCreatedAt(
                comment.getCreatedAt()
        );

        return response;
    }
}