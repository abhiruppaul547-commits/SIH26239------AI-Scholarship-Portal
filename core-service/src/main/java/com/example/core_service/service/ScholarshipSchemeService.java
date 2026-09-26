package com.example.core_service.service;

import com.example.core_service.dto.ScholarshipSchemeDTO;
import com.example.core_service.model.ScholarshipScheme;
import com.example.core_service.repository.ScholarshipSchemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScholarshipSchemeService {

    private final ScholarshipSchemeRepository schemeRepository;

    public ScholarshipSchemeService(ScholarshipSchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    public List<ScholarshipSchemeDTO> getAllActiveSchemes() {
        return schemeRepository.findByActiveTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ScholarshipSchemeDTO getSchemeById(Long id) {
        ScholarshipScheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Scholarship scheme not found: " + id));
        return mapToDTO(scheme);
    }

    public ScholarshipSchemeDTO createScheme(ScholarshipSchemeDTO dto) {
        ScholarshipScheme scheme = new ScholarshipScheme();
        copyDtoToEntity(dto, scheme);
        scheme = schemeRepository.save(scheme);
        return mapToDTO(scheme);
    }

    public ScholarshipSchemeDTO updateScheme(Long id, ScholarshipSchemeDTO dto) {
        ScholarshipScheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Scholarship scheme not found: " + id));
        copyDtoToEntity(dto, scheme);
        scheme = schemeRepository.save(scheme);
        return mapToDTO(scheme);
    }

    public void deleteScheme(Long id) {
        schemeRepository.deleteById(id);
    }

    private void copyDtoToEntity(ScholarshipSchemeDTO dto, ScholarshipScheme entity) {
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setProvider(dto.getProvider());
        entity.setCategory(dto.getCategory());
        entity.setTargetCaste(dto.getTargetCaste());
        entity.setMaxIncomeLimit(dto.getMaxIncomeLimit());
        entity.setMinGpaOrPercentage(dto.getMinGpaOrPercentage());
        entity.setScholarshipAmount(dto.getScholarshipAmount());
        entity.setDeadline(dto.getDeadline());
        entity.setRequiredDocuments(dto.getRequiredDocuments());
        entity.setActive(dto.getActive() != null ? dto.getActive() : true);
        entity.setEligibleCourses(dto.getEligibleCourses());
    }

    public ScholarshipSchemeDTO mapToDTO(ScholarshipScheme s) {
        ScholarshipSchemeDTO dto = new ScholarshipSchemeDTO();
        dto.setId(s.getId());
        dto.setTitle(s.getTitle());
        dto.setDescription(s.getDescription());
        dto.setProvider(s.getProvider());
        dto.setCategory(s.getCategory());
        dto.setTargetCaste(s.getTargetCaste());
        dto.setMaxIncomeLimit(s.getMaxIncomeLimit());
        dto.setMinGpaOrPercentage(s.getMinGpaOrPercentage());
        dto.setScholarshipAmount(s.getScholarshipAmount());
        dto.setDeadline(s.getDeadline());
        dto.setRequiredDocuments(s.getRequiredDocuments());
        dto.setActive(s.getActive());
        dto.setEligibleCourses(s.getEligibleCourses());
        return dto;
    }
}
