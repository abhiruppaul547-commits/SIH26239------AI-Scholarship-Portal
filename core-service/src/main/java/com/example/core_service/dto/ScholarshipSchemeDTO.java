package com.example.core_service.dto;

import java.time.LocalDate;

public class ScholarshipSchemeDTO {
    private Long id;
    private String title;
    private String description;
    private String provider;
    private String category;
    private String targetCaste;
    private Double maxIncomeLimit;
    private Double minGpaOrPercentage;
    private Double scholarshipAmount;
    private LocalDate deadline;
    private String requiredDocuments;
    private Boolean active;
    private String eligibleCourses;

    public ScholarshipSchemeDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTargetCaste() {
        return targetCaste;
    }

    public void setTargetCaste(String targetCaste) {
        this.targetCaste = targetCaste;
    }

    public Double getMaxIncomeLimit() {
        return maxIncomeLimit;
    }

    public void setMaxIncomeLimit(Double maxIncomeLimit) {
        this.maxIncomeLimit = maxIncomeLimit;
    }

    public Double getMinGpaOrPercentage() {
        return minGpaOrPercentage;
    }

    public void setMinGpaOrPercentage(Double minGpaOrPercentage) {
        this.minGpaOrPercentage = minGpaOrPercentage;
    }

    public Double getScholarshipAmount() {
        return scholarshipAmount;
    }

    public void setScholarshipAmount(Double scholarshipAmount) {
        this.scholarshipAmount = scholarshipAmount;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getRequiredDocuments() {
        return requiredDocuments;
    }

    public void setRequiredDocuments(String requiredDocuments) {
        this.requiredDocuments = requiredDocuments;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getEligibleCourses() {
        return eligibleCourses;
    }

    public void setEligibleCourses(String eligibleCourses) {
        this.eligibleCourses = eligibleCourses;
    }
}
