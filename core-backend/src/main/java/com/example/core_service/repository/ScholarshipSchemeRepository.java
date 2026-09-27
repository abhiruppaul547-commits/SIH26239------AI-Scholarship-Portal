package com.example.core_service.repository;

import com.example.core_service.model.ScholarshipScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScholarshipSchemeRepository extends JpaRepository<ScholarshipScheme, Long> {
    List<ScholarshipScheme> findByActiveTrue();
    List<ScholarshipScheme> findByTargetCasteContainingIgnoreCaseOrTargetCasteIgnoreCase(String caste1, String caste2);
}
