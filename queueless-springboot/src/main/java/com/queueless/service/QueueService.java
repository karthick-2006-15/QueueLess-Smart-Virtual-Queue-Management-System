package com.queueless.service;

import com.queueless.dto.JoinQueueRequest;
import com.queueless.model.QueueTicket;
import com.queueless.model.ServiceDesk;

import java.util.List;

public interface QueueService {
    QueueTicket joinQueue(JoinQueueRequest request);
    QueueTicket getActiveTicket(String studentId);
    List<QueueTicket> getWaitingTickets(Long serviceDeskId);
    QueueTicket callNextTicket(Long serviceDeskId);
    QueueTicket completeTicket(Long ticketId);
    QueueTicket cancelTicket(Long ticketId);
    List<ServiceDesk> getAllServiceDesks();
    ServiceDesk createServiceDesk(ServiceDesk desk);
}
