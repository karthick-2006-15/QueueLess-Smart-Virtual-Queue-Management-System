package com.queueless.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue_tickets")
public class QueueTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String tokenNumber;

    @Column(nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String studentName;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "service_desk_id", nullable = false)
    private ServiceDesk serviceDesk;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QueueStatus status = QueueStatus.WAITING;

    private Integer position;

    private Integer estimatedWaitMinutes;

    private LocalDateTime joinedAt;

    private LocalDateTime calledAt;

    private LocalDateTime completedAt;

    public QueueTicket() {
        this.joinedAt = LocalDateTime.now();
    }

    public QueueTicket(String tokenNumber, String studentId, String studentName, 
                       ServiceDesk serviceDesk, Integer position, Integer estimatedWaitMinutes) {
        this.tokenNumber = tokenNumber;
        this.studentId = studentId;
        this.studentName = studentName;
        this.serviceDesk = serviceDesk;
        this.position = position;
        this.estimatedWaitMinutes = estimatedWaitMinutes;
        this.status = QueueStatus.WAITING;
        this.joinedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTokenNumber() {
        return tokenNumber;
    }

    public void setTokenNumber(String tokenNumber) {
        this.tokenNumber = tokenNumber;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public ServiceDesk getServiceDesk() {
        return serviceDesk;
    }

    public void setServiceDesk(ServiceDesk serviceDesk) {
        this.serviceDesk = serviceDesk;
    }

    public QueueStatus getStatus() {
        return status;
    }

    public void setStatus(QueueStatus status) {
        this.status = status;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Integer getEstimatedWaitMinutes() {
        return estimatedWaitMinutes;
    }

    public void setEstimatedWaitMinutes(Integer estimatedWaitMinutes) {
        this.estimatedWaitMinutes = estimatedWaitMinutes;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public LocalDateTime getCalledAt() {
        return calledAt;
    }

    public void setCalledAt(LocalDateTime calledAt) {
        this.calledAt = calledAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
