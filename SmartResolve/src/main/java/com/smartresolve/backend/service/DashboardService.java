package com.smartresolve.backend.service;

import com.smartresolve.backend.dto.dashboard.DashboardResponse;
import com.smartresolve.backend.enums.ComplaintPriority;
import com.smartresolve.backend.enums.ComplaintStatus;
import com.smartresolve.backend.repository.ComplaintRepository;

import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ComplaintRepository complaintRepository;

    public DashboardService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public DashboardResponse getDashboardStats() {

        DashboardResponse response =
                new DashboardResponse();

        response.setTotalComplaints(
                complaintRepository.count());

        response.setOpenComplaints(
                complaintRepository.countByStatus(
                        ComplaintStatus.OPEN));

        response.setInProgressComplaints(
                complaintRepository.countByStatus(
                        ComplaintStatus.IN_PROGRESS));

        response.setResolvedComplaints(
                complaintRepository.countByStatus(
                        ComplaintStatus.RESOLVED));

        response.setClosedComplaints(
                complaintRepository.countByStatus(
                        ComplaintStatus.CLOSED));

        response.setSlaBreachedComplaints(
                complaintRepository.countBySlaBreachedTrue());

        response.setHighPriorityComplaints(
                complaintRepository.countByPriority(
                        ComplaintPriority.HIGH));

        response.setCriticalPriorityComplaints(
                complaintRepository.countByPriority(
                        ComplaintPriority.CRITICAL));

        return response;
    }
}