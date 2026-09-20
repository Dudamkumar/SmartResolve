package com.smartresolve.backend.controller;

import com.smartresolve.backend.dto.complaint.CommentRequest;
import com.smartresolve.backend.dto.complaint.CommentResponse;
import com.smartresolve.backend.service.CommentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/{complaintId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse addComment(
            @PathVariable Long complaintId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return commentService.addComment(
                complaintId,
                request,
                email);
    }

    @GetMapping("/{complaintId}/comments")
    public List<CommentResponse> getComments(
            @PathVariable Long complaintId) {

        return commentService.getComments(complaintId);
    }
}