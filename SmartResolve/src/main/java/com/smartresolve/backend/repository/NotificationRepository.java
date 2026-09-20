package com.smartresolve.backend.repository;

import com.smartresolve.backend.entity.Complaint;
import com.smartresolve.backend.entity.Notification;
import com.smartresolve.backend.entity.User;
import com.smartresolve.backend.enums.NotificationType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    boolean existsByUserAndComplaintAndType(
            User user,
            Complaint complaint,
            NotificationType type);
}