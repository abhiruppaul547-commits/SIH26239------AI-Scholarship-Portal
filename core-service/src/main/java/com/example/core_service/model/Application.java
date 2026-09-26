package com.example.core_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String applicationNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "scholarship_scheme_id", nullable = false)
    private ScholarshipScheme scholarshipScheme;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    private String casteDocFileName;
    private String casteDocUrl;

    private String incomeDocFileName;
    private String incomeDocUrl;

    private String marksheetDocFileName;
    private String marksheetDocUrl;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String extractedOcrData;

    private Double ocrConfidenceScore;

    private Boolean ocrVerified = false;

    @Column(length = 2000)
    private String remarks;

    private LocalDateTime appliedAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Application() {}

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

    public StudentProfile getStudentProfile() {
        return studentProfile;
    }

    public void setStudentProfile(StudentProfile studentProfile) {
        this.studentProfile = studentProfile;
    }

    public ScholarshipScheme getScholarshipScheme() {
        return scholarshipScheme;
    }

    public void setScholarshipScheme(ScholarshipScheme scholarshipScheme) {
        this.scholarshipScheme = scholarshipScheme;
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

    public String getCasteDocUrl() {
        return casteDocUrl;
    }

    public void setCasteDocUrl(String casteDocUrl) {
        this.casteDocUrl = casteDocUrl;
    }

    public String getIncomeDocFileName() {
        return incomeDocFileName;
    }

    public void setIncomeDocFileName(String incomeDocFileName) {
        this.incomeDocFileName = incomeDocFileName;
    }

    public String getIncomeDocUrl() {
        return incomeDocUrl;
    }

    public void setIncomeDocUrl(String incomeDocUrl) {
        this.incomeDocUrl = incomeDocUrl;
    }

    public String getMarksheetDocFileName() {
        return marksheetDocFileName;
    }

    public void setMarksheetDocFileName(String marksheetDocFileName) {
        this.marksheetDocFileName = marksheetDocFileName;
    }

    public String getMarksheetDocUrl() {
        return marksheetDocUrl;
    }

    public void setMarksheetDocUrl(String marksheetDocUrl) {
        this.marksheetDocUrl = marksheetDocUrl;
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
