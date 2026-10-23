package com.queueless.repository;

import com.queueless.model.ServiceDesk;
import com.queueless.model.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceDesk, Long> {
    Optional<ServiceDesk> findByName(String name);
    List<ServiceDesk> findByStatus(ServiceStatus status);
}
