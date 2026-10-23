package com.queueless.repository;

import com.queueless.model.QueueStatus;
import com.queueless.model.QueueTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueueRepository extends JpaRepository<QueueTicket, Long> {

    // Find active tickets for a student (e.g. WAITING or CALLED)
    Optional<QueueTicket> findByStudentIdAndStatusIn(String studentId, List<QueueStatus> statuses);

    // Find all waiting/called tickets for a desk ordered by arrival
    List<QueueTicket> findByServiceDeskIdAndStatusInOrderByJoinedAtAsc(Long serviceDeskId, List<QueueStatus> statuses);

    // Count tickets issued today for sequential token generation
    long countByServiceDeskIdAndJoinedAtAfter(Long serviceDeskId, LocalDateTime startOfDay);

    // Count active people ahead
    long countByServiceDeskIdAndStatusIn(Long serviceDeskId, List<QueueStatus> statuses);

    // Find all past tickets for a student
    List<QueueTicket> findByStudentIdOrderByJoinedAtDesc(String studentId);
}
