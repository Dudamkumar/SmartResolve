package com.smartresolve.backend.scheduler;

import com.smartresolve.backend.entity.Complaint;
import com.smartresolve.backend.enums.ComplaintStatus;
import com.smartresolve.backend.repository.ComplaintRepository;
import com.smartresolve.backend.service.NotificationService;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SlaMonitoringScheduler {

    private final ComplaintRepository complaintRepository;
    private final NotificationService notificationService;

    public SlaMonitoringScheduler(
            ComplaintRepository complaintRepository,
            NotificationService notificationService) {

        this.complaintRepository = complaintRepository;
        this.notificationService = notificationService;
    }

    @Scheduled(fixedRate = 60000)
    public void checkSlaBreaches() {

        LocalDateTime now = LocalDateTime.now();

        System.out.println(
                "SLA SCHEDULER RUNNING: " + now
        );

        List<Complaint> complaints =
                complaintRepository.findAll();

        for (Complaint complaint : complaints) {

            System.out.println(
                    "Complaint ID: " + complaint.getId()
                    + " | Status: " + complaint.getStatus()
                    + " | Deadline: " + complaint.getSlaDeadline()
                    + " | Breached: " + complaint.isSlaBreached()
            );

            if (complaint.getStatus() != ComplaintStatus.CLOSED
                    && complaint.getResolvedAt() == null
                    && complaint.getSlaDeadline() != null
                    && now.isAfter(complaint.getSlaDeadline())) {

                if (!complaint.isSlaBreached()) {
                    complaint.setSlaBreached(true);
                    complaintRepository.saveAndFlush(complaint);

                    System.out.println(
                            "SLA BREACHED: Complaint ID "
                                    + complaint.getId());
                }

                notificationService
                        .createSlaBreachNotifications(complaint);
            }
        }
    }
}