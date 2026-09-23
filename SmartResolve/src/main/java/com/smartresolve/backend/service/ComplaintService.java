package com.smartresolve.backend.service;

import com.smartresolve.backend.dto.complaint.ComplaintAssignmentRequest;
import com.smartresolve.backend.dto.complaint.ComplaintRequest;
import com.smartresolve.backend.dto.complaint.ComplaintResponse;
import com.smartresolve.backend.dto.complaint.ComplaintStatusRequest;
import com.smartresolve.backend.entity.Complaint;
import com.smartresolve.backend.entity.ComplaintHistory;
import com.smartresolve.backend.entity.User;
import com.smartresolve.backend.enums.ComplaintStatus;
import com.smartresolve.backend.repository.ComplaintHistoryRepository;
import com.smartresolve.backend.repository.ComplaintRepository;
import com.smartresolve.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final SlaService slaService;
    private final ComplaintHistoryRepository complaintHistoryRepository;
    private final NotificationService notificationService;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            UserRepository userRepository,
            ComplaintHistoryRepository complaintHistoryRepository,
            SlaService slaService,
            NotificationService notificationService) {

        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.complaintHistoryRepository =
                complaintHistoryRepository;
        this.slaService = slaService;
        this.notificationService =
                notificationService;
    }

    /*
     * =========================================================
     * CREATE COMPLAINT
     * =========================================================
     */

    public ComplaintResponse createComplaint(
            ComplaintRequest request,
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        Complaint complaint =
                new Complaint();

        complaint.setTitle(
                request.getTitle()
        );

        complaint.setDescription(
                request.getDescription()
        );

        complaint.setPriority(
                request.getPriority()
        );

        complaint.setCategory(
                request.getCategory()
        );

        complaint.setStatus(
                ComplaintStatus.OPEN
        );

        complaint.setCreatedBy(user);

        /*
         * First save:
         * generates complaint ID and createdAt.
         */
        Complaint savedComplaint =
                complaintRepository.save(complaint);

        /*
         * Calculate SLA.
         */
        int slaHours =
                slaService.getSlaHours(
                        savedComplaint.getPriority()
                );

        LocalDateTime slaDeadline =
                slaService.calculateDeadline(
                        savedComplaint.getPriority(),
                        savedComplaint.getCreatedAt()
                );

        savedComplaint.setSlaHours(
                slaHours
        );

        savedComplaint.setSlaDeadline(
                slaDeadline
        );

        savedComplaint.setSlaBreached(
                false
        );

        /*
         * Second save:
         * stores SLA information.
         */
        savedComplaint =
                complaintRepository.save(
                        savedComplaint
                );

        /*
         * NEW:
         * Create notifications after the complaint
         * has been successfully stored.
         */
        notificationService.notifyComplaintCreated(
                savedComplaint
        );

        return toResponse(
                savedComplaint
        );
    }

    /*
     * =========================================================
     * GET ALL COMPLAINTS
     * =========================================================
     */

    public List<ComplaintResponse> getAllComplaints() {

        return complaintRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /*
     * =========================================================
     * GET COMPLAINT BY ID
     * =========================================================
     */

    public ComplaintResponse getComplaintById(
            Long id) {

        Complaint complaint =
                complaintRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Complaint not found"
                                )
                        );

        return toResponse(
                complaint
        );
    }

    /*
     * =========================================================
     * GET MY COMPLAINTS
     * =========================================================
     */

    public List<ComplaintResponse> getMyComplaints(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return complaintRepository
                .findByCreatedById(
                        user.getId()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /*
     * =========================================================
     * GET ASSIGNED COMPLAINTS
     * =========================================================
     */

    public List<ComplaintResponse> getAssignedComplaints(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return complaintRepository
                .findByAssignedToId(
                        user.getId()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /*
     * =========================================================
     * ASSIGN / REASSIGN COMPLAINT
     * =========================================================
     */

    public ComplaintResponse assignComplaint(
            Long complaintId,
            ComplaintAssignmentRequest request) {

        Complaint complaint =
                complaintRepository.findById(
                        complaintId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Complaint not found"
                        )
                );

        User supportUser =
                userRepository.findById(
                        request.getAssignedToId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Support user not found"
                        )
                );

        if (!supportUser
                .getRole()
                .name()
                .equals("SUPPORT")) {

            throw new RuntimeException(
                    "Selected user is not a SUPPORT user"
            );
        }

        /*
         * Store old support user BEFORE replacing it.
         */
        User previousSupport =
                complaint.getAssignedTo();

        /*
         * If the same support user is selected again,
         * don't create another notification.
         */
        if (previousSupport != null &&
                previousSupport.getId() != null &&
                previousSupport.getId().equals(
                        supportUser.getId()
                )) {

            return toResponse(
                    complaint
            );
        }

        /*
         * Assign new support user.
         */
        complaint.setAssignedTo(
                supportUser
        );

        Complaint savedComplaint =
                complaintRepository.save(
                        complaint
                );

        /*
         * Reload complaint so relationships are available.
         */
        Complaint updatedComplaint =
                complaintRepository.findById(
                        savedComplaint.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Complaint not found"
                        )
                );

        /*
         * NEW:
         * Notify USER + SUPPORT + SUPERVISOR.
         */
        notificationService.notifyComplaintAssigned(
                updatedComplaint,
                previousSupport,
                supportUser
        );

        return toResponse(
                updatedComplaint
        );
    }

    /*
     * =========================================================
     * UPDATE STATUS
     * =========================================================
     */

    public ComplaintResponse updateStatus(
            Long complaintId,
            ComplaintStatusRequest request,
            String email) {

        Complaint complaint =
                complaintRepository.findById(
                        complaintId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Complaint not found"
                        )
                );

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        ComplaintStatus currentStatus =
                complaint.getStatus();

        ComplaintStatus newStatus =
                request.getStatus();

        /*
         * OPEN -> IN_PROGRESS
         */
        if (currentStatus ==
                        ComplaintStatus.OPEN &&
                newStatus !=
                        ComplaintStatus.IN_PROGRESS) {

            throw new RuntimeException(
                    "OPEN complaint can only move to IN_PROGRESS"
            );
        }

        /*
         * IN_PROGRESS -> RESOLVED
         */
        if (currentStatus ==
                        ComplaintStatus.IN_PROGRESS &&
                newStatus !=
                        ComplaintStatus.RESOLVED) {

            throw new RuntimeException(
                    "IN_PROGRESS complaint can only move to RESOLVED"
            );
        }

        /*
         * RESOLVED -> CLOSED
         */
        if (currentStatus ==
                        ComplaintStatus.RESOLVED &&
                newStatus !=
                        ComplaintStatus.CLOSED) {

            throw new RuntimeException(
                    "RESOLVED complaint can only move to CLOSED"
            );
        }

        /*
         * Create history BEFORE changing status.
         */
        ComplaintHistory history =
                new ComplaintHistory();

        history.setComplaint(
                complaint
        );

        history.setChangedBy(
                user
        );

        history.setOldStatus(
                currentStatus
        );

        history.setNewStatus(
                newStatus
        );

        complaintHistoryRepository.save(
                history
        );

        /*
         * Update complaint.
         */
        complaint.setStatus(
                newStatus
        );

        if (newStatus ==
                ComplaintStatus.RESOLVED) {

            complaint.setResolvedAt(
                    LocalDateTime.now()
            );
        }

        Complaint savedComplaint =
                complaintRepository.save(
                        complaint
                );

        /*
         * NEW:
         * Notify USER + assigned SUPPORT +
         * other SUPERVISORS.
         */
        notificationService.notifyStatusChanged(
                savedComplaint,
                user,
                currentStatus.name(),
                newStatus.name()
        );

        return toResponse(
                savedComplaint
        );
    }

    /*
     * =========================================================
     * CONVERT ENTITY -> RESPONSE
     * =========================================================
     */

    private ComplaintResponse toResponse(
            Complaint complaint) {

        ComplaintResponse response =
                new ComplaintResponse();

        response.setId(
                complaint.getId()
        );

        response.setTitle(
                complaint.getTitle()
        );

        response.setDescription(
                complaint.getDescription()
        );

        response.setStatus(
                complaint.getStatus()
        );

        response.setPriority(
                complaint.getPriority()
        );

        response.setCategory(
                complaint.getCategory()
        );

        /*
         * Created by
         */
        if (complaint.getCreatedBy() != null) {

            response.setCreatedById(
                    complaint.getCreatedBy().getId()
            );

            response.setCreatedByName(
                    complaint.getCreatedBy().getName()
            );

            response.setCreatedByEmail(
                    complaint.getCreatedBy().getEmail()
            );
        }

        /*
         * Assigned support user
         */
        if (complaint.getAssignedTo() != null) {

            response.setAssignedToId(
                    complaint.getAssignedTo().getId()
            );

            response.setAssignedToName(
                    complaint.getAssignedTo().getName()
            );

            response.setAssignedToEmail(
                    complaint.getAssignedTo().getEmail()
            );
        }

        response.setCreatedAt(
                complaint.getCreatedAt()
        );

        response.setUpdatedAt(
                complaint.getUpdatedAt()
        );

        response.setResolvedAt(
                complaint.getResolvedAt()
        );

        response.setSlaHours(
                complaint.getSlaHours()
        );

        response.setSlaDeadline(
                complaint.getSlaDeadline()
        );

        response.setSlaBreached(
                complaint.isSlaBreached()
        );

        return response;
    }
}