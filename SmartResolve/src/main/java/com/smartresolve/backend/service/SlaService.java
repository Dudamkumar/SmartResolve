package com.smartresolve.backend.service;

import com.smartresolve.backend.entity.Complaint;
import com.smartresolve.backend.enums.ComplaintPriority;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SlaService {

    public int getSlaHours(ComplaintPriority priority) {

        return switch (priority) {

            case LOW -> 72;

            case MEDIUM -> 48;

            case HIGH -> 24;

            case CRITICAL -> 4;
        };
    }

    public LocalDateTime calculateDeadline(
            ComplaintPriority priority,
            LocalDateTime createdAt) {

        int slaHours = getSlaHours(priority);

        return createdAt.plusHours(slaHours);
    }

    public boolean isBreached(Complaint complaint) {

        if (complaint.getResolvedAt() != null) {
            return false;
        }

        return LocalDateTime.now()
                .isAfter(complaint.getSlaDeadline());
    }
}