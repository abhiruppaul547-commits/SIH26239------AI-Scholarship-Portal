package com.example.core_service.repository;

import com.example.core_service.model.Application;
import com.example.core_service.model.ApplicationStatus;
import com.example.core_service.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentProfile(StudentProfile studentProfile);
    List<Application> findByStudentProfileUserId(Long userId);
    Optional<Application> findByApplicationNumber(String applicationNumber);
    List<Application> findByStatus(ApplicationStatus status);
}
