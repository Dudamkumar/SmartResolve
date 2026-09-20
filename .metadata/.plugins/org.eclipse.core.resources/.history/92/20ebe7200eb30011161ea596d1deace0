package com.smartresolve.backend.service;

import com.smartresolve.backend.dto.notification.NotificationResponse;
import com.smartresolve.backend.entity.Complaint;
import com.smartresolve.backend.entity.Notification;
import com.smartresolve.backend.entity.Role;
import com.smartresolve.backend.entity.User;
import com.smartresolve.backend.enums.NotificationType;
import com.smartresolve.backend.repository.NotificationRepository;
import com.smartresolve.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {

        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public void createSlaBreachNotifications(
            Complaint complaint) {

        List<User> supervisors =
                userRepository.findByRole(Role.SUPERVISOR);

        System.out.println(
                "SUPERVISORS FOUND: " + supervisors.size());

        for (User supervisor : supervisors) {

            boolean alreadyExists =
                    notificationRepository
                            .existsByUserAndComplaintAndType(
                                    supervisor,
                                    complaint,
                                    NotificationType.SLA_BREACH
                            );

            if (alreadyExists) {
                continue;
            }

            Notification notification =
                    new Notification();

            notification.setUser(supervisor);
            notification.setComplaint(complaint);
            notification.setType(
                    NotificationType.SLA_BREACH);

            notification.setMessage(
                    "SLA breached for complaint ID "
                    + complaint.getId()
                    + ": "
                    + complaint.getTitle()
            );

            notificationRepository.save(notification);

            System.out.println(
                    "Notification created for: "
                    + supervisor.getEmail());
        }
    }

    public List<NotificationResponse> getMyNotifications(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private NotificationResponse toResponse(
            Notification notification) {

        NotificationResponse response =
                new NotificationResponse();

        response.setId(notification.getId());

        if (notification.getComplaint() != null) {
            response.setComplaintId(
                    notification.getComplaint().getId());
        }

        response.setType(notification.getType());
        response.setMessage(notification.getMessage());
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());

        return response;
    }
    public void markAsRead(Long notificationId, String email) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));

        // Security check:
        // User can mark only their own notification as read
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You cannot update this notification");
        }

        notification.setRead(true);

        notificationRepository.save(notification);
    }
}