package com.smartresolve.backend.controller;

import com.smartresolve.backend.dto.notification.NotificationResponse;
import com.smartresolve.backend.service.NotificationService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.http.HttpStatus;
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> getMyNotifications(
            Authentication authentication) {

        String email = authentication.getName();

        return notificationService.getMyNotifications(email);
    }
    
    @PutMapping("/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAsRead(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        notificationService.markAsRead(id, email);
    }
}