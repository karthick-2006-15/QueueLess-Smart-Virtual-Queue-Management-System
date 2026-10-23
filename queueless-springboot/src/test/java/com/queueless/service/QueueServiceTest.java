package com.queueless.service;

import com.queueless.dto.JoinQueueRequest;
import com.queueless.exception.QueueException;
import com.queueless.model.QueueStatus;
import com.queueless.model.QueueTicket;
import com.queueless.model.ServiceDesk;
import com.queueless.model.ServiceStatus;
import com.queueless.repository.QueueRepository;
import com.queueless.repository.ServiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class QueueServiceTest {

    @Mock
    private QueueRepository queueRepository;

    @Mock
    private ServiceRepository serviceRepository;

    @InjectMocks
    private QueueServiceImpl queueService;

    private ServiceDesk openDesk;
    private ServiceDesk closedDesk;

    @BeforeEach
    void setUp() {
        openDesk = new ServiceDesk("Certificate Office", "CERT", "Certificates", "Counter 2", "Admin Block", 4, ServiceStatus.OPEN);
        openDesk.setId(1L);

        closedDesk = new ServiceDesk("Exam Cell", "EXAM", "Exams", "Counter 3", "Exam Wing", 5, ServiceStatus.CLOSED);
        closedDesk.setId(2L);
    }

    @Test
    @DisplayName("Test Case 1: Successfully join queue when desk is OPEN and student has no active tickets")
    void testJoinQueue_Success() {
        // Arrange
        JoinQueueRequest request = new JoinQueueRequest(1L, "STU-001", "Karthick R");

        when(serviceRepository.findById(1L)).thenReturn(Optional.of(openDesk));
        when(queueRepository.findByStudentIdAndStatusIn(eq("STU-001"), anyList())).thenReturn(Optional.empty());
        when(queueRepository.countByServiceDeskIdAndJoinedAtAfter(eq(1L), any())).thenReturn(5L);
        when(queueRepository.countByServiceDeskIdAndStatusIn(eq(1L), anyList())).thenReturn(2L);

        QueueTicket savedTicket = new QueueTicket("CERT-006", "STU-001", "Karthick R", openDesk, 3, 12);
        savedTicket.setId(101L);
        when(queueRepository.save(any(QueueTicket.class))).thenReturn(savedTicket);

        // Act
        QueueTicket result = queueService.joinQueue(request);

        // Assert
        assertNotNull(result);
        assertEquals("CERT-006", result.getTokenNumber());
        assertEquals(QueueStatus.WAITING, result.getStatus());
        assertEquals("STU-001", result.getStudentId());
        assertEquals(3, result.getPosition());
        assertEquals(12, result.getEstimatedWaitMinutes());

        verify(queueRepository, times(1)).save(any(QueueTicket.class));
    }

    @Test
    @DisplayName("Test Case 2: Business Rule 1 - Reject queue join when Service Desk is CLOSED")
    void testJoinQueue_FailsWhenDeskClosed() {
        // Arrange
        JoinQueueRequest request = new JoinQueueRequest(2L, "STU-002", "Priya P");

        when(serviceRepository.findById(2L)).thenReturn(Optional.of(closedDesk));

        // Act & Assert
        QueueException exception = assertThrows(QueueException.class, () -> {
            queueService.joinQueue(request);
        });

        assertTrue(exception.getMessage().contains("is currently CLOSED"));
        verify(queueRepository, never()).save(any(QueueTicket.class));
    }

    @Test
    @DisplayName("Test Case 3: Business Rule 2 - Prevent student from holding multiple active queue tickets")
    void testJoinQueue_FailsWhenStudentAlreadyHasActiveTicket() {
        // Arrange
        JoinQueueRequest request = new JoinQueueRequest(1L, "STU-003", "Aarav S");

        QueueTicket activeTicket = new QueueTicket("CERT-003", "STU-003", "Aarav S", openDesk, 1, 4);

        when(serviceRepository.findById(1L)).thenReturn(Optional.of(openDesk));
        when(queueRepository.findByStudentIdAndStatusIn(eq("STU-003"), anyList()))
                .thenReturn(Optional.of(activeTicket));

        // Act & Assert
        QueueException exception = assertThrows(QueueException.class, () -> {
            queueService.joinQueue(request);
        });

        assertTrue(exception.getMessage().contains("already holds an active ticket: CERT-003"));
        verify(queueRepository, never()).save(any(QueueTicket.class));
    }
}
