package com.queueless.controller;

import com.queueless.dto.ApiResponse;
import com.queueless.model.ServiceDesk;
import com.queueless.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    private final QueueService queueService;

    @Autowired
    public ServiceController(QueueService queueService) {
        this.queueService = queueService;
    }

    /**
     * REST Endpoint: Get all service desks
     * GET /api/services
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceDesk>>> getAllServiceDesks() {
        List<ServiceDesk> desks = queueService.getAllServiceDesks();
        return ResponseEntity.ok(ApiResponse.success("Service desks retrieved", desks));
    }

    /**
     * REST Endpoint: Create new service desk
     * POST /api/services
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ServiceDesk>> createServiceDesk(@RequestBody ServiceDesk desk) {
        ServiceDesk created = queueService.createServiceDesk(desk);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Service desk created successfully", created));
    }
}
