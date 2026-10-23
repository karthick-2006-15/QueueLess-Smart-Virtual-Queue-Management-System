package com.queueless;

import com.queueless.model.QueueStatus;
import com.queueless.model.QueueTicket;
import com.queueless.model.ServiceDesk;
import com.queueless.model.ServiceStatus;
import com.queueless.repository.QueueRepository;
import com.queueless.repository.ServiceRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class QueueLessApplication {

    public static void main(String[] args) {
        SpringApplication.run(QueueLessApplication.class, args);
    }

    /**
     * Demonstrates repository operations (Save, Read, Update, Delete, FindById, Derived Query Methods)
     * as covered in the Data Layer lab tutorial.
     */
    @Bean
    public CommandLineRunner initDatabase(ServiceRepository serviceRepository, QueueRepository queueRepository) {
        return args -> {
            System.out.println("\n========================================================");
            System.out.println("--- DEMO STEP: SPRING DATA JPA REPOSITORY OPERATIONS ---");
            System.out.println("========================================================");

            // 1. SAVE & READ (Entities pre-population)
            ServiceDesk certDesk = new ServiceDesk(
                    "Certificate Office", "CERT", "Degree, transcripts, bonafide & ID cards",
                    "Counter 2", "Admin Block, Ground Floor", 4, ServiceStatus.OPEN
            );
            serviceRepository.save(certDesk);

            ServiceDesk accDesk = new ServiceDesk(
                    "Accounts Section", "ACC", "Tuition fees, scholarships, and fee clearance",
                    "Counter 1", "Admin Block, 1st Floor", 6, ServiceStatus.OPEN
            );
            serviceRepository.save(accDesk);

            ServiceDesk examDesk = new ServiceDesk(
                    "Examination Cell", "EXAM", "Hall tickets and grade sheet revaluation",
                    "Counter 3", "Exam Wing, 2nd Floor", 5, ServiceStatus.CLOSED
            );
            serviceRepository.save(examDesk);

            System.out.println("1. [Save & Read] Total service desks saved: " + serviceRepository.count());
            serviceRepository.findAll().forEach(desk -> 
                System.out.println("   - ID: " + desk.getId() + " | Desk: " + desk.getName() + " [" + desk.getStatus() + "]")
            );

            // 2. UPDATE OPERATION
            examDesk.setDescription("Updated: Hall tickets, grade cards & semester marksheet clearance");
            serviceRepository.save(examDesk);
            System.out.println("2. [Update] Successfully updated description for: " + examDesk.getName());

            // 3. FIND BY ID
            serviceRepository.findById(certDesk.getId()).ifPresent(found -> 
                System.out.println("3. [Find By ID] Found desk ID " + found.getId() + ": " + found.getName() + " at " + found.getCounterNumber())
            );

            // 4. SAVE & RETRIEVE SECOND ENTITY (QueueTicket)
            QueueTicket sampleTicket = new QueueTicket("CERT-001", "2024-CSE-01", "Karthick R", certDesk, 1, 4);
            queueRepository.save(sampleTicket);
            System.out.println("4. [Save Ticket] Created initial token: " + sampleTicket.getTokenNumber() + " for student: " + sampleTicket.getStudentName());

            // 5. DERIVED QUERY METHOD (findByServiceDeskIdAndStatusInOrderByJoinedAtAsc)
            List<QueueStatus> waitingStatuses = List.of(QueueStatus.WAITING);
            List<QueueTicket> waitingList = queueRepository.findByServiceDeskIdAndStatusInOrderByJoinedAtAsc(certDesk.getId(), waitingStatuses);
            System.out.println("5. [Derived Query] Found " + waitingList.size() + " active tickets waiting for " + certDesk.getName());
            waitingList.forEach(t -> 
                System.out.println("   - Token: " + t.getTokenNumber() + " | Position: #" + t.getPosition() + " | Est. Wait: " + t.getEstimatedWaitMinutes() + " mins")
            );

            System.out.println("========================================================\n");
        };
    }
}
