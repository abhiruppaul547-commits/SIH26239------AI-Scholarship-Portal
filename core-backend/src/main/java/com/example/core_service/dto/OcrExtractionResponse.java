package com.example.core_service.dto;

import java.util.Map;

public class OcrExtractionResponse {
    private boolean success;
    private String documentType;
    private String name;
    private String casteCategory;
    private String tribe;
    private Double incomeValue;
    private String certificateNumber;
    private String issueDate;
    private String issuingAuthority;
    private Double confidence;
    private String rawText;
    private Map<String, Object> metadata;

    public OcrExtractionResponse() {}

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCasteCategory() {
        return casteCategory;
    }

    public void setCasteCategory(String casteCategory) {
        this.casteCategory = casteCategory;
    }

    public String getTribe() {
        return tribe;
    }

    public void setTribe(String tribe) {
        this.tribe = tribe;
    }

    public Double getIncomeValue() {
        return incomeValue;
    }

    public void setIncomeValue(Double incomeValue) {
        this.incomeValue = incomeValue;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public String getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(String issueDate) {
        this.issueDate = issueDate;
    }

    public String getIssuingAuthority() {
        return issuingAuthority;
    }

    public void setIssuingAuthority(String issuingAuthority) {
        this.issuingAuthority = issuingAuthority;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getRawText() {
        return rawText;
    }

    public void setRawText(String rawText) {
        this.rawText = rawText;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }
}
