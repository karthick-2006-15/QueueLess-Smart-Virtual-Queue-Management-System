package com.queueless.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_desks")
public class ServiceDesk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, length = 10)
    private String prefix;

    private String description;

    @Column(nullable = false)
    private String counterNumber;

    private String location;

    @Column(nullable = false)
    private Integer averageServiceTimeMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceStatus status = ServiceStatus.OPEN;

    private LocalDateTime createdAt;

    public ServiceDesk() {
        this.createdAt = LocalDateTime.now();
    }

    public ServiceDesk(String name, String prefix, String description, String counterNumber, 
                       String location, Integer averageServiceTimeMinutes, ServiceStatus status) {
        this.name = name;
        this.prefix = prefix;
        this.description = description;
        this.counterNumber = counterNumber;
        this.location = location;
        this.averageServiceTimeMinutes = averageServiceTimeMinutes;
        this.status = status != null ? status : ServiceStatus.OPEN;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCounterNumber() {
        return counterNumber;
    }

    public void setCounterNumber(String counterNumber) {
        this.counterNumber = counterNumber;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getAverageServiceTimeMinutes() {
        return averageServiceTimeMinutes;
    }

    public void setAverageServiceTimeMinutes(Integer averageServiceTimeMinutes) {
        this.averageServiceTimeMinutes = averageServiceTimeMinutes;
    }

    public ServiceStatus getStatus() {
        return status;
    }

    public void setStatus(ServiceStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
