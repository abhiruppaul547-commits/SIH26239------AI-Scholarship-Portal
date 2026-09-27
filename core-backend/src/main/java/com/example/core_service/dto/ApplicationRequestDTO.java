package com.example.core_service.dto;

import jakarta.validation.constraints.NotNull;

public class ApplicationRequestDTO {
    @NotNull
    private Long scholarshipSchemeId;

    private String casteDocFileName;
    private String casteDocUrl;

    private String incomeDocFileName;
    private String incomeDocUrl;

    private String marksheetDocFileName;
    private String marksheetDocUrl;

    private String extractedOcrData;
    private Double ocrConfidenceScore;

    public ApplicationRequestDTO() {}

    public Long getScholarshipSchemeId() {
        return scholarshipSchemeId;
    }

    public void setScholarshipSchemeId(Long scholarshipSchemeId) {
        this.scholarshipSchemeId = scholarshipSchemeId;
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
}
