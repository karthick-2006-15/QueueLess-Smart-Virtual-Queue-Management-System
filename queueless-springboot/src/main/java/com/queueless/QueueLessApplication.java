package com.queueless;

import com.queueless.model.ServiceDesk;
import com.queueless.model.ServiceStatus;
import com.queueless.repository.ServiceRepository;
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
     * Pre-populates the in-memory H2 database with campus service counters on startup.
     */
    @Bean
    public CommandLineRunner initDatabase(ServiceRepository serviceRepository) {
        return args -> {
            if (serviceRepository.count() == 0) {
                serviceRepository.save(new ServiceDesk(
                        "Certificate Office", "CERT", "Degree, transcripts, bonafide & ID cards",
                        "Counter 2", "Admin Block, Ground Floor", 4, ServiceStatus.OPEN
                ));

                serviceRepository.save(new ServiceDesk(
                        "Accounts Section", "ACC", "Tuition fees, scholarships, and fee clearance",
                        "Counter 1", "Admin Block, 1st Floor", 6, ServiceStatus.OPEN
                ));

                serviceRepository.save(new ServiceDesk(
                        "IT Help Desk", "IT", "Campus WiFi setup, portal password resets",
                        "Counter 4", "Tech Hub, Room 104", 5, ServiceStatus.OPEN
                ));

                serviceRepository.save(new ServiceDesk(
                        "Central Library", "LIB", "Book issuance, returns, and digital repository",
                        "Circulation Desk", "Central Library, Block C", 3, ServiceStatus.OPEN
                ));

                serviceRepository.save(new ServiceDesk(
                        "Examination Cell", "EXAM", "Hall tickets and grade sheet revaluation",
                        "Counter 3", "Exam Wing, 2nd Floor", 5, ServiceStatus.CLOSED
                ));

                System.out.println("✅ QueueLess: Pre-loaded 5 sample campus service desks into H2 in-memory database.");
            }
        };
    }
}
