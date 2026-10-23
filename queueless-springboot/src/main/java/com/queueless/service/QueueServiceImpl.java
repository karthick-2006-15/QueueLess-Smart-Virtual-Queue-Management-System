package com.queueless.service;

import com.queueless.dto.JoinQueueRequest;
import com.queueless.exception.QueueException;
import com.queueless.model.QueueStatus;
import com.queueless.model.QueueTicket;
import com.queueless.model.ServiceDesk;
import com.queueless.model.ServiceStatus;
import com.queueless.repository.QueueRepository;
import com.queueless.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class QueueServiceImpl implements QueueService {

    private final QueueRepository queueRepository;
    private final ServiceRepository serviceRepository;

    @Autowired
    public QueueServiceImpl(QueueRepository queueRepository, ServiceRepository serviceRepository) {
        this.queueRepository = queueRepository;
        this.serviceRepository = serviceRepository;
    }

    /**
     * BUSINESS RULE 1 & 2 IMPLEMENTATION
     * Rule 1: A user cannot join a queue if the service desk is CLOSED or PAUSED.
     * Rule 2: A student cannot hold more than one active waiting token concurrently.
     * Rule 3: Dynamic token number and estimated wait calculation based on people ahead.
     */
    @Override
    public QueueTicket joinQueue(JoinQueueRequest request) {
        if (request.getServiceId() == null || request.getStudentId() == null || request.getStudentName() == null) {
            throw new QueueException("Service ID, Student ID, and Student Name must be provided");
        }

        // 1. Verify Service Desk Exists
        ServiceDesk desk = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new QueueException("Service desk not found with ID: " + request.getServiceId()));

        // --- BUSINESS RULE 1: Verify Desk is OPEN ---
        if (desk.getStatus() != ServiceStatus.OPEN) {
            throw new QueueException("Cannot join queue: Service desk '" + desk.getName() + "' is currently " + desk.getStatus());
        }

        // --- BUSINESS RULE 2: Prevent Multiple Active Queues for the Same Student ---
        List<QueueStatus> activeStatuses = Arrays.asList(QueueStatus.WAITING, QueueStatus.CALLED);
        Optional<QueueTicket> existingTicket = queueRepository.findByStudentIdAndStatusIn(request.getStudentId(), activeStatuses);
        if (existingTicket.isPresent()) {
            throw new QueueException("Student " + request.getStudentId() + " already holds an active ticket: " 
                    + existingTicket.get().getTokenNumber() + " at " + existingTicket.get().getServiceDesk().getName());
        }

        // --- BUSINESS RULE 3: Dynamic Token Generation & Wait Time Calculation ---
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        long ticketsIssuedToday = queueRepository.countByServiceDeskIdAndJoinedAtAfter(desk.getId(), startOfDay);
        String tokenNumber = String.format("%s-%03d", desk.getPrefix(), ticketsIssuedToday + 1);

        long peopleAhead = queueRepository.countByServiceDeskIdAndStatusIn(desk.getId(), activeStatuses);
        int position = (int) (peopleAhead + 1);
        int estimatedWait = position * desk.getAverageServiceTimeMinutes();

        QueueTicket ticket = new QueueTicket(
                tokenNumber,
                request.getStudentId(),
                request.getStudentName(),
                desk,
                position,
                estimatedWait
        );

        return queueRepository.save(ticket);
    }

    @Override
    public QueueTicket getActiveTicket(String studentId) {
        List<QueueStatus> activeStatuses = Arrays.asList(QueueStatus.WAITING, QueueStatus.CALLED);
        return queueRepository.findByStudentIdAndStatusIn(studentId, activeStatuses)
                .orElseThrow(() -> new QueueException("No active queue ticket found for student ID: " + studentId));
    }

    @Override
    public List<QueueTicket> getWaitingTickets(Long serviceDeskId) {
        List<QueueStatus> waitingStatus = List.of(QueueStatus.WAITING);
        return queueRepository.findByServiceDeskIdAndStatusInOrderByJoinedAtAsc(serviceDeskId, waitingStatus);
    }

    @Override
    public QueueTicket callNextTicket(Long serviceDeskId) {
        // Find first waiting ticket
        List<QueueTicket> waiting = getWaitingTickets(serviceDeskId);
        if (waiting.isEmpty()) {
            throw new QueueException("No students are waiting in line for this desk");
        }

        QueueTicket nextTicket = waiting.get(0);
        nextTicket.setStatus(QueueStatus.CALLED);
        nextTicket.setCalledAt(LocalDateTime.now());
        return queueRepository.save(nextTicket);
    }

    @Override
    public QueueTicket completeTicket(Long ticketId) {
        QueueTicket ticket = queueRepository.findById(ticketId)
                .orElseThrow(() -> new QueueException("Ticket not found with ID: " + ticketId));

        ticket.setStatus(QueueStatus.COMPLETED);
        ticket.setCompletedAt(LocalDateTime.now());
        return queueRepository.save(ticket);
    }

    @Override
    public QueueTicket cancelTicket(Long ticketId) {
        QueueTicket ticket = queueRepository.findById(ticketId)
                .orElseThrow(() -> new QueueException("Ticket not found with ID: " + ticketId));

        if (ticket.getStatus() == QueueStatus.COMPLETED || ticket.getStatus() == QueueStatus.CANCELLED) {
            throw new QueueException("Cannot cancel a ticket that is already " + ticket.getStatus());
        }

        ticket.setStatus(QueueStatus.CANCELLED);
        return queueRepository.save(ticket);
    }

    @Override
    public List<ServiceDesk> getAllServiceDesks() {
        return serviceRepository.findAll();
    }

    @Override
    public ServiceDesk createServiceDesk(ServiceDesk desk) {
        return serviceRepository.save(desk);
    }
}
