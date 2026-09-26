package com.example.core_service.dto;

import com.example.core_service.model.ApplicationStatus;
import java.time.LocalDateTime;

public class ApplicationResponseDTO {
    private Long id;
    private String applicationNumber;
    private Long studentProfileId;
    private String studentName;
    private String studentEmail;
    private String tribeName;
    private String category;
    private Long scholarshipSchemeId;
    private String scholarshipTitle;
    private Double scholarshipAmount;
    private ApplicationStatus status;
    private String casteDocFileName;
    private String incomeDocFileName;
    private String marksheetDocFileName;
    private String extractedOcrData;
    private Double ocrConfidenceScore;
    private Boolean ocrVerified;
    private String remarks;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    public ApplicationResponseDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public Long getStudentProfileId() {
        return studentProfileId;
    }

    public void setStudentProfileId(Long studentProfileId) {
        this.studentProfileId = studentProfileId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getTribeName() {
        return tribeName;
    }

    public void setTribeName(String tribeName) {
        this.tribeName = tribeName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getScholarshipSchemeId() {
        return scholarshipSchemeId;
    }

    public void setScholarshipSchemeId(Long scholarshipSchemeId) {
        this.scholarshipSchemeId = scholarshipSchemeId;
    }

    public String getScholarshipTitle() {
        return scholarshipTitle;
    }

    public void setScholarshipTitle(String scholarshipTitle) {
        this.scholarshipTitle = scholarshipTitle;
    }

    public Double getScholarshipAmount() {
        return scholarshipAmount;
    }

    public void setScholarshipAmount(Double scholarshipAmount) {
        this.scholarshipAmount = scholarshipAmount;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getCasteDocFileName() {
        return casteDocFileName;
    }

    public void setCasteDocFileName(String casteDocFileName) {
        this.casteDocFileName = casteDocFileName;
    }

    public String getIncomeDocFileName() {
        return incomeDocFileName;
    }

    public void setIncomeDocFileName(String incomeDocFileName) {
        this.incomeDocFileName = incomeDocFileName;
    }

    public String getMarksheetDocFileName() {
        return marksheetDocFileName;
    }

    public void setMarksheetDocFileName(String marksheetDocFileName) {
        this.marksheetDocFileName = marksheetDocFileName;
    }

    public String getExtractedOcrData() {
        return extractedOcrData;
    }

    public void setExtractedOcrData(String extractedOcrData) {
        this.extractedOcrData = extractedOcrData;
    }

    public Double getOcrConfidenceScore() {
        return ocrConfidenceScore;
    }

    public void setOcrConfidenceScore(Double ocrConfidenceScore) {
        this.ocrConfidenceScore = ocrConfidenceScore;
    }

    public Boolean getOcrVerified() {
        return ocrVerified;
    }

    public void setOcrVerified(Boolean ocrVerified) {
        this.ocrVerified = ocrVerified;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
