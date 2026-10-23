package com.queueless.dto;

public class JoinQueueRequest {
    private Long serviceId;
    private String studentId;
    private String studentName;

    public JoinQueueRequest() {
    }

    public JoinQueueRequest(Long serviceId, String studentId, String studentName) {
        this.serviceId = serviceId;
        this.studentId = studentId;
        this.studentName = studentName;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
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
}
