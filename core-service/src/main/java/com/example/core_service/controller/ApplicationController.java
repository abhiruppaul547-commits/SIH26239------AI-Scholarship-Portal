package com.example.core_service.controller;

import com.example.core_service.dto.*;
import com.example.core_service.model.ApplicationStatus;
import com.example.core_service.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ApplicationResponseDTO> submitApplication(Authentication auth,
                                                                   @Valid @RequestBody ApplicationRequestDTO req) {
        String email = auth != null ? auth.getName() : "student@sih.gov.in";
        return ResponseEntity.ok(applicationService.submitApplication(email, req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponseDTO>> getMyApplications(Authentication auth) {
        String email = auth != null ? auth.getName() : "student@sih.gov.in";
        return ResponseEntity.ok(applicationService.getUserApplications(email));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ApplicationResponseDTO>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponseDTO> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationResponseDTO> updateStatus(@PathVariable Long id,
                                                               @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        String remarks = body.get("remarks");
        ApplicationStatus status = ApplicationStatus.valueOf(statusStr);
        return ResponseEntity.ok(applicationService.updateStatus(id, status, remarks));
    }

    /**
     * Primary Gateway for AI Document Extraction:
     * Student uploads document to Spring Boot -> Spring Boot calls FastAPI /api/ai/extract-doc,
     * updates student verification state in DB, and returns structured OCR data for auto-fill!
     */
    @PostMapping(value = "/extract-doc", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OcrExtractionResponse> extractAndVerifyDocument(
            Authentication auth,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "document_type", required = false) String docType) {

        String email = (auth != null && auth.getName() != null) ? auth.getName() : "student@sih.gov.in";
        OcrExtractionResponse response = applicationService.verifyDocumentWithAi(email, file, docType);
        return ResponseEntity.ok(response);
    }
}
