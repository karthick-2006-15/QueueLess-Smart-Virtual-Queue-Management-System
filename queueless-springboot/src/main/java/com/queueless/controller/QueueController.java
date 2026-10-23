package com.queueless.controller;

import com.queueless.dto.ApiResponse;
import com.queueless.dto.JoinQueueRequest;
import com.queueless.model.QueueTicket;
import com.queueless.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/queues")
@CrossOrigin(origins = "*")
public class QueueController {

    private final QueueService queueService;

    @Autowired
    public QueueController(QueueService queueService) {
        this.queueService = queueService;
    }

    /**
     * REST Endpoint 1: Join virtual queue
     * POST /api/queues/join
     */
    @PostMapping("/join")
    public ResponseEntity<ApiResponse<QueueTicket>> joinQueue(@RequestBody JoinQueueRequest request) {
        QueueTicket ticket = queueService.joinQueue(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Successfully joined the virtual queue!", ticket));
    }

    /**
     * REST Endpoint 2: Get active queue ticket for a student
     * GET /api/queues/active/{studentId}
     */
    @GetMapping("/active/{studentId}")
    public ResponseEntity<ApiResponse<QueueTicket>> getActiveTicket(@PathVariable String studentId) {
        QueueTicket ticket = queueService.getActiveTicket(studentId);
        return ResponseEntity.ok(ApiResponse.success("Active ticket retrieved", ticket));
    }

    /**
     * REST Endpoint 3: Get waiting list for a counter
     * GET /api/queues/waiting/{serviceDeskId}
     */
    @GetMapping("/waiting/{serviceDeskId}")
    public ResponseEntity<ApiResponse<List<QueueTicket>>> getWaitingTickets(@PathVariable Long serviceDeskId) {
        List<QueueTicket> waiting = queueService.getWaitingTickets(serviceDeskId);
        return ResponseEntity.ok(ApiResponse.success("Waiting list retrieved", waiting));
    }

    /**
     * REST Endpoint 4: Staff calls next waiting student
     * POST /api/queues/call-next/{serviceDeskId}
     */
    @PostMapping("/call-next/{serviceDeskId}")
    public ResponseEntity<ApiResponse<QueueTicket>> callNextTicket(@PathVariable Long serviceDeskId) {
        QueueTicket ticket = queueService.callNextTicket(serviceDeskId);
        return ResponseEntity.ok(ApiResponse.success("Next student called to counter", ticket));
    }

    /**
     * REST Endpoint 5: Complete service
     * POST /api/queues/{ticketId}/complete
     */
    @PostMapping("/{ticketId}/complete")
    public ResponseEntity<ApiResponse<QueueTicket>> completeTicket(@PathVariable Long ticketId) {
        QueueTicket ticket = queueService.completeTicket(ticketId);
        return ResponseEntity.ok(ApiResponse.success("Service marked as completed", ticket));
    }

    /**
     * REST Endpoint 6: Cancel ticket
     * DELETE /api/queues/{ticketId}/cancel
     */
    @DeleteMapping("/{ticketId}/cancel")
    public ResponseEntity<ApiResponse<QueueTicket>> cancelTicket(@PathVariable Long ticketId) {
        QueueTicket ticket = queueService.cancelTicket(ticketId);
        return ResponseEntity.ok(ApiResponse.success("Queue ticket cancelled", ticket));
    }
}
