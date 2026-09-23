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

    /*
     * =========================================================
     * COMMON NOTIFICATION CREATION
     * =========================================================
     */

    private void createNotificationIfNotExists(
            User user,
            Complaint complaint,
            NotificationType type,
            String message) {

        if (user == null || complaint == null) {
            return;
        }

        boolean alreadyExists =
                notificationRepository
                        .existsByUserAndComplaintAndType(
                                user,
                                complaint,
                                type
                        );

        if (alreadyExists) {
            return;
        }

        Notification notification =
                new Notification();

        notification.setUser(user);
        notification.setComplaint(complaint);
        notification.setType(type);
        notification.setMessage(message);

        notificationRepository.save(notification);
    }

    /*
     * =========================================================
     * COMPLAINT CREATED
     * =========================================================
     */

    public void notifyComplaintCreated(
            Complaint complaint) {

        User creator =
                complaint.getCreatedBy();

        /*
         * USER
         *
         * The person who created the complaint
         * receives confirmation.
         */
        createNotificationIfNotExists(
                creator,
                complaint,
                NotificationType.COMPLAINT_CREATED,
                "Your complaint #" +
                        complaint.getId() +
                        " has been created successfully."
        );

        /*
         * SUPERVISORS
         *
         * Normal complaint:
         * COMPLAINT_CREATED
         *
         * Critical complaint:
         * CRITICAL_COMPLAINT
         */
        List<User> supervisors =
                userRepository.findByRole(
                        Role.SUPERVISOR
                );

        boolean critical =
                complaint.getPriority() != null &&
                complaint.getPriority()
                        .name()
                        .equals("CRITICAL");

        for (User supervisor : supervisors) {

            if (critical) {

                createNotificationIfNotExists(
                        supervisor,
                        complaint,
                        NotificationType.CRITICAL_COMPLAINT,
                        "Critical complaint #" +
                                complaint.getId() +
                                " requires attention: " +
                                complaint.getTitle()
                );

            } else {

                createNotificationIfNotExists(
                        supervisor,
                        complaint,
                        NotificationType.COMPLAINT_CREATED,
                        "New complaint #" +
                                complaint.getId() +
                                " requires assignment: " +
                                complaint.getTitle()
                );
            }
        }

        /*
         * ADMIN
         *
         * Only important critical complaint events.
         */
        if (critical) {

            List<User> admins =
                    userRepository.findByRole(
                            Role.ADMIN
                    );

            for (User admin : admins) {

                createNotificationIfNotExists(
                        admin,
                        complaint,
                        NotificationType.CRITICAL_COMPLAINT,
                        "Critical complaint #" +
                                complaint.getId() +
                                " was created: " +
                                complaint.getTitle()
                );
            }
        }
    }

    /*
     * =========================================================
     * COMPLAINT ASSIGNED / REASSIGNED
     * =========================================================
     */

    public void notifyComplaintAssigned(
            Complaint complaint,
            User previousSupport,
            User newSupport) {

        if (newSupport == null) {
            return;
        }

        boolean reassigned =
                previousSupport != null &&
                !sameUser(previousSupport, newSupport);

        NotificationType type =
                reassigned
                        ? NotificationType.COMPLAINT_REASSIGNED
                        : NotificationType.COMPLAINT_ASSIGNED;

        /*
         * NEW SUPPORT USER
         */
        createNotificationIfNotExists(
                newSupport,
                complaint,
                type,
                reassigned
                        ? "Complaint #" +
                          complaint.getId() +
                          " has been reassigned to you."
                        : "Complaint #" +
                          complaint.getId() +
                          " has been assigned to you."
        );

        /*
         * OLD SUPPORT USER
         *
         * Only during reassignment.
         */
        if (reassigned) {

            createNotificationIfNotExists(
                    previousSupport,
                    complaint,
                    NotificationType.COMPLAINT_REASSIGNED,
                    "Complaint #" +
                            complaint.getId() +
                            " has been reassigned to another support user."
            );
        }

        /*
         * COMPLAINT CREATOR
         */
        User creator =
                complaint.getCreatedBy();

        if (creator != null) {

            createNotificationIfNotExists(
                    creator,
                    complaint,
                    type,
                    reassigned
                            ? "Your complaint #" +
                              complaint.getId() +
                              " has been reassigned to " +
                              newSupport.getName() +
                              "."
                            : "Your complaint #" +
                              complaint.getId() +
                              " has been assigned to " +
                              newSupport.getName() +
                              "."
            );
        }

        /*
         * SUPERVISORS
         */
        List<User> supervisors =
                userRepository.findByRole(
                        Role.SUPERVISOR
                );

        for (User supervisor : supervisors) {

            createNotificationIfNotExists(
                    supervisor,
                    complaint,
                    type,
                    reassigned
                            ? "Complaint #" +
                              complaint.getId() +
                              " was reassigned to " +
                              newSupport.getName() +
                              "."
                            : "Complaint #" +
                              complaint.getId() +
                              " was assigned to " +
                              newSupport.getName() +
                              "."
            );
        }
    }

    /*
     * =========================================================
     * STATUS CHANGED
     * =========================================================
     */

    public void notifyStatusChanged(
            Complaint complaint,
            User changedBy,
            String oldStatus,
            String newStatus) {

        /*
         * USER / COMPLAINT CREATOR
         */
        User creator =
                complaint.getCreatedBy();

        if (creator != null) {

            createNotificationIfNotExists(
                    creator,
                    complaint,
                    NotificationType.STATUS_CHANGED,
                    "Your complaint #" +
                            complaint.getId() +
                            " status changed from " +
                            oldStatus +
                            " to " +
                            newStatus +
                            "."
            );
        }

        /*
         * SUPPORT USER
         *
         * Don't send the notification back to the
         * support user who performed the change.
         */
        User support =
                complaint.getAssignedTo();

        if (support != null &&
                !sameUser(support, changedBy)) {

            createNotificationIfNotExists(
                    support,
                    complaint,
                    NotificationType.STATUS_CHANGED,
                    "Complaint #" +
                            complaint.getId() +
                            " status changed from " +
                            oldStatus +
                            " to " +
                            newStatus +
                            "."
            );
        }

        /*
         * SUPERVISORS
         */
        List<User> supervisors =
                userRepository.findByRole(
                        Role.SUPERVISOR
                );

        for (User supervisor : supervisors) {

            if (sameUser(supervisor, changedBy)) {
                continue;
            }

            createNotificationIfNotExists(
                    supervisor,
                    complaint,
                    NotificationType.STATUS_CHANGED,
                    "Complaint #" +
                            complaint.getId() +
                            " status changed from " +
                            oldStatus +
                            " to " +
                            newStatus +
                            "."
            );
        }
    }

    /*
     * =========================================================
     * SLA BREACH
     * =========================================================
     */

    public void createSlaBreachNotifications(
            Complaint complaint) {

        /*
         * USER
         */
        User creator =
                complaint.getCreatedBy();

        createNotificationIfNotExists(
                creator,
                complaint,
                NotificationType.SLA_BREACH,
                "SLA breached for your complaint #" +
                        complaint.getId() +
                        ": " +
                        complaint.getTitle()
        );

        /*
         * SUPPORT
         */
        User support =
                complaint.getAssignedTo();

        if (support != null) {

            createNotificationIfNotExists(
                    support,
                    complaint,
                    NotificationType.SLA_BREACH,
                    "SLA breached for assigned complaint #" +
                            complaint.getId() +
                            ": " +
                            complaint.getTitle()
            );
        }

        /*
         * SUPERVISOR
         */
        List<User> supervisors =
                userRepository.findByRole(
                        Role.SUPERVISOR
                );

        System.out.println(
                "SUPERVISORS FOUND: " +
                        supervisors.size()
        );

        for (User supervisor : supervisors) {

            createNotificationIfNotExists(
                    supervisor,
                    complaint,
                    NotificationType.SLA_BREACH,
                    "SLA breached for complaint #" +
                            complaint.getId() +
                            ": " +
                            complaint.getTitle()
            );
        }

        /*
         * ADMIN
         *
         * SLA breach is an important system event.
         */
        List<User> admins =
                userRepository.findByRole(
                        Role.ADMIN
                );

        for (User admin : admins) {

            createNotificationIfNotExists(
                    admin,
                    complaint,
                    NotificationType.SLA_BREACH,
                    "SLA breach detected for complaint #" +
                            complaint.getId() +
                            ": " +
                            complaint.getTitle()
            );
        }
    }

    /*
     * =========================================================
     * GET MY NOTIFICATIONS
     * =========================================================
     */

    public List<NotificationResponse> getMyNotifications(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /*
     * =========================================================
     * CONVERT ENTITY -> RESPONSE
     * =========================================================
     */

    private NotificationResponse toResponse(
            Notification notification) {

        NotificationResponse response =
                new NotificationResponse();

        response.setId(
                notification.getId()
        );

        if (notification.getComplaint() != null) {

            response.setComplaintId(
                    notification
                            .getComplaint()
                            .getId()
            );
        }

        response.setType(
                notification.getType()
        );

        response.setMessage(
                notification.getMessage()
        );

        response.setRead(
                notification.isRead()
        );

        response.setCreatedAt(
                notification.getCreatedAt()
        );

        return response;
    }

    /*
     * =========================================================
     * MARK AS READ
     * =========================================================
     */

    public void markAsRead(
            Long notificationId,
            String email) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        /*
         * SECURITY:
         * A user can only modify their own notification.
         */
        if (!notification
                .getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You cannot update this notification"
            );
        }

        notification.setRead(true);

        notificationRepository.save(
                notification
        );
    }

    /*
     * =========================================================
     * USER COMPARISON
     * =========================================================
     */

    private boolean sameUser(
            User first,
            User second) {

        return first != null &&
                second != null &&
                first.getId() != null &&
                first.getId().equals(
                        second.getId()
                );
    }
    /*
     * =========================================================
     * COMMENT ADDED
     * =========================================================
     */

    public void notifyCommentAdded(
            Complaint complaint,
            User commenter) {

        if (complaint == null || commenter == null) {
            return;
        }

        /*
         * IMPORTANT:
         * Do not use existsByUserAndComplaintAndType()
         * for COMMENT_ADDED because a complaint can have
         * many different comments.
         *
         * Each new comment should generate a new notification
         * for the relevant users.
         */

        /*
         * -----------------------------------------------------
         * COMPLAINT CREATOR
         * -----------------------------------------------------
         *
         * Notify the complaint creator unless they
         * are the person who added the comment.
         */
        User creator = complaint.getCreatedBy();

        if (creator != null &&
                !sameUser(creator, commenter)) {

            createCommentNotification(
                    creator,
                    complaint,
                    "New comment added to your complaint #" +
                            complaint.getId() +
                            "."
            );
        }

        /*
         * -----------------------------------------------------
         * ASSIGNED SUPPORT USER
         * -----------------------------------------------------
         *
         * Notify assigned support unless they
         * added the comment themselves.
         */
        User support = complaint.getAssignedTo();

        if (support != null &&
                !sameUser(support, commenter)) {

            createCommentNotification(
                    support,
                    complaint,
                    "New comment added to complaint #" +
                            complaint.getId() +
                            " assigned to you."
            );
        }

        /*
         * -----------------------------------------------------
         * SUPERVISORS
         * -----------------------------------------------------
         *
         * Notify supervisors about complaint activity.
         * Do not notify a supervisor who wrote the comment.
         */
        List<User> supervisors =
                userRepository.findByRole(
                        Role.SUPERVISOR
                );

        for (User supervisor : supervisors) {

            if (sameUser(supervisor, commenter)) {
                continue;
            }

            createCommentNotification(
                    supervisor,
                    complaint,
                    "New comment added to complaint #" +
                            complaint.getId() +
                            "."
            );
        }

        /*
         * -----------------------------------------------------
         * ADMIN
         * -----------------------------------------------------
         *
         * Admin does not receive every normal comment.
         */
    }

    /*
     * =========================================================
     * CREATE COMMENT NOTIFICATION
     * =========================================================
     */

    private void createCommentNotification(
            User user,
            Complaint complaint,
            String message) {

        if (user == null || complaint == null) {
            return;
        }

        Notification notification =
                new Notification();

        notification.setUser(user);
        notification.setComplaint(complaint);
        notification.setType(
                NotificationType.COMMENT_ADDED
        );
        notification.setMessage(message);

        notificationRepository.save(
                notification
        );
    }
}