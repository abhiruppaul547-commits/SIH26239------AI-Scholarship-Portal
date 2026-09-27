package com.example.core_service.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "scholarship_schemes")
public class ScholarshipScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String provider; // e.g., "Ministry of Tribal Affairs, Govt. of India"

    private String category; // Pre-Matric, Post-Matric, Higher Education, Fellowship, Top Class

    private String targetCaste; // "ST", "ALL", etc.

    private Double maxIncomeLimit; // e.g. 250000.0 INR

    private Double minGpaOrPercentage; // e.g. 50.0

    private Double scholarshipAmount; // e.g. 50000.0

    private LocalDate deadline;

    @Column(length = 1000)
    private String requiredDocuments; // Comma separated: "Caste Certificate, Income Certificate, Previous Marksheet"

    private Boolean active = true;

    private String eligibleCourses; // Comma-separated: "Secondary, Higher Secondary, Engineering, Medical, Arts, Science, PhD"

    public ScholarshipScheme() {}

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
