package com.example.core_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    private LocalDate dateOfBirth;

    private String gender;

    // Caste Category: ST, SC, OBC, General
    @Column(nullable = false)
    private String category = "ST";

    // Tribal sub-community: Santhal, Gond, Bhil, Munda, Oraon, Bodo, Khasi, etc.
    private String tribeName;

    // Annual family income in INR
    private Double annualFamilyIncome;

    private String state;

    private String district;

    private String pincode;

    private String institutionName;

    private String course;

    private String currentYear;

    private Double gpaOrPercentage;

    private String bankAccountNumber;

    private String bankIfsc;

    private String aadhaarNumber;

    private String casteCertificateNumber;

    private String incomeCertificateNumber;

    private Boolean isCasteVerified = false;

    private Boolean isIncomeVerified = false;

    private LocalDateTime updatedAt = LocalDateTime.now();

    public StudentProfile() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTribeName() {
        return tribeName;
    }

    public void setTribeName(String tribeName) {
        this.tribeName = tribeName;
    }

    public Double getAnnualFamilyIncome() {
        return annualFamilyIncome;
    }

    public void setAnnualFamilyIncome(Double annualFamilyIncome) {
        this.annualFamilyIncome = annualFamilyIncome;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getInstitutionName() {
        return institutionName;
    }

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getCurrentYear() {
        return currentYear;
    }

    public void setCurrentYear(String currentYear) {
        this.currentYear = currentYear;
    }

    public Double getGpaOrPercentage() {
        return gpaOrPercentage;
    }

    public void setGpaOrPercentage(Double gpaOrPercentage) {
        this.gpaOrPercentage = gpaOrPercentage;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getBankIfsc() {
        return bankIfsc;
    }

    public void setBankIfsc(String bankIfsc) {
        this.bankIfsc = bankIfsc;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getCasteCertificateNumber() {
        return casteCertificateNumber;
    }

    public void setCasteCertificateNumber(String casteCertificateNumber) {
        this.casteCertificateNumber = casteCertificateNumber;
    }

    public String getIncomeCertificateNumber() {
        return incomeCertificateNumber;
    }

    public void setIncomeCertificateNumber(String incomeCertificateNumber) {
        this.incomeCertificateNumber = incomeCertificateNumber;
    }

    public Boolean getIsCasteVerified() {
        return isCasteVerified;
    }

    public void setIsCasteVerified(Boolean isCasteVerified) {
        this.isCasteVerified = isCasteVerified;
    }

    public Boolean getIsIncomeVerified() {
        return isIncomeVerified;
    }

    public void setIsIncomeVerified(Boolean isIncomeVerified) {
        this.isIncomeVerified = isIncomeVerified;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
