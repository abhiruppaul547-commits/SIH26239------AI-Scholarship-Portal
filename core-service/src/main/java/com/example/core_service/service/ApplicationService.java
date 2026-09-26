package com.example.core_service.service;

import com.example.core_service.dto.*;
import com.example.core_service.model.*;
import com.example.core_service.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentProfileRepository profileRepository;
    private final ScholarshipSchemeRepository schemeRepository;
    private final UserRepository userRepository;
    private final AiClientService aiClientService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              StudentProfileRepository profileRepository,
                              ScholarshipSchemeRepository schemeRepository,
                              UserRepository userRepository,
                              AiClientService aiClientService) {
        this.applicationRepository = applicationRepository;
        this.profileRepository = profileRepository;
        this.schemeRepository = schemeRepository;
        this.userRepository = userRepository;
        this.aiClientService = aiClientService;
    }

    @Transactional
    public ApplicationResponseDTO submitApplication(String userEmail, ApplicationRequestDTO req) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found for: " + userEmail));

        ScholarshipScheme scheme = schemeRepository.findById(req.getScholarshipSchemeId())
                .orElseThrow(() -> new IllegalArgumentException("Scholarship scheme not found: " + req.getScholarshipSchemeId()));

        Application app = new Application();
        app.setApplicationNumber("SIH-" + System.currentTimeMillis() % 1000000 + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        app.setStudentProfile(profile);
        app.setScholarshipScheme(scheme);
        app.setStatus(ApplicationStatus.SUBMITTED);
        app.setCasteDocFileName(req.getCasteDocFileName());
        app.setCasteDocUrl(req.getCasteDocUrl());
        app.setIncomeDocFileName(req.getIncomeDocFileName());
        app.setIncomeDocUrl(req.getIncomeDocUrl());
        app.setMarksheetDocFileName(req.getMarksheetDocFileName());
        app.setMarksheetDocUrl(req.getMarksheetDocUrl());
        app.setExtractedOcrData(req.getExtractedOcrData());
        app.setOcrConfidenceScore(req.getOcrConfidenceScore() != null ? req.getOcrConfidenceScore() : 0.95);
        app.setOcrVerified(req.getExtractedOcrData() != null && !req.getExtractedOcrData().isEmpty());
        app.setRemarks("Application submitted successfully. Automated OCR pre-screening completed.");
        app.setAppliedAt(LocalDateTime.now());
        app.setUpdatedAt(LocalDateTime.now());

        app = applicationRepository.save(app);
        return mapToDTO(app);
    }

    @Transactional
    public OcrExtractionResponse verifyDocumentWithAi(String userEmail, MultipartFile file, String docType) {
        OcrExtractionResponse ocrResult = aiClientService.extractDocument(file, docType);

        // Update profile verification status if valid
        if (ocrResult.isSuccess()) {
            profileRepository.findByUserEmail(userEmail).ifPresent(profile -> {
                if ("CASTE".equalsIgnoreCase(docType) || (ocrResult.getCasteCategory() != null && !ocrResult.getCasteCategory().isEmpty())) {
                    if (ocrResult.getCasteCategory() != null) profile.setCategory(ocrResult.getCasteCategory());
                    if (ocrResult.getTribe() != null) profile.setTribeName(ocrResult.getTribe());
                    if (ocrResult.getCertificateNumber() != null) profile.setCasteCertificateNumber(ocrResult.getCertificateNumber());
                    profile.setIsCasteVerified(true);
                }
                if ("INCOME".equalsIgnoreCase(docType) || ocrResult.getIncomeValue() != null) {
                    if (ocrResult.getIncomeValue() != null) profile.setAnnualFamilyIncome(ocrResult.getIncomeValue());
                    if (ocrResult.getCertificateNumber() != null) profile.setIncomeCertificateNumber(ocrResult.getCertificateNumber());
                    profile.setIsIncomeVerified(true);
                }
                profile.setUpdatedAt(LocalDateTime.now());
                profileRepository.save(profile);
            });
        }

        return ocrResult;
    }

    public List<ApplicationResponseDTO> getUserApplications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));
        return applicationRepository.findByStudentProfileUserId(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponseDTO> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ApplicationResponseDTO getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found: " + id));
        return mapToDTO(app);
    }

    @Transactional
    public ApplicationResponseDTO updateStatus(Long id, ApplicationStatus newStatus, String remarks) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found: " + id));

        app.setStatus(newStatus);
        if (remarks != null && !remarks.isEmpty()) {
            app.setRemarks(remarks);
        }
        app.setUpdatedAt(LocalDateTime.now());
        app = applicationRepository.save(app);
        return mapToDTO(app);
    }

    public ApplicationResponseDTO mapToDTO(Application a) {
        ApplicationResponseDTO dto = new ApplicationResponseDTO();
        dto.setId(a.getId());
        dto.setApplicationNumber(a.getApplicationNumber());
        if (a.getStudentProfile() != null) {
            dto.setStudentProfileId(a.getStudentProfile().getId());
            if (a.getStudentProfile().getUser() != null) {
                dto.setStudentName(a.getStudentProfile().getUser().getFullName());
                dto.setStudentEmail(a.getStudentProfile().getUser().getEmail());
            }
            dto.setTribeName(a.getStudentProfile().getTribeName());
            dto.setCategory(a.getStudentProfile().getCategory());
        }
        if (a.getScholarshipScheme() != null) {
            dto.setScholarshipSchemeId(a.getScholarshipScheme().getId());
            dto.setScholarshipTitle(a.getScholarshipScheme().getTitle());
            dto.setScholarshipAmount(a.getScholarshipScheme().getScholarshipAmount());
        }
        dto.setStatus(a.getStatus());
        dto.setCasteDocFileName(a.getCasteDocFileName());
        dto.setIncomeDocFileName(a.getIncomeDocFileName());
        dto.setMarksheetDocFileName(a.getMarksheetDocFileName());
        dto.setExtractedOcrData(a.getExtractedOcrData());
        dto.setOcrConfidenceScore(a.getOcrConfidenceScore());
        dto.setOcrVerified(a.getOcrVerified());
        dto.setRemarks(a.getRemarks());
        dto.setAppliedAt(a.getAppliedAt());
        dto.setUpdatedAt(a.getUpdatedAt());
        return dto;
    }
}
