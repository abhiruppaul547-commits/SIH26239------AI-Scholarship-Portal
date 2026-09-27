package com.example.core_service.config;

import com.example.core_service.model.*;
import com.example.core_service.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final ScholarshipSchemeRepository schemeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentProfileRepository profileRepository,
                           ScholarshipSchemeRepository schemeRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.schemeRepository = schemeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Admin
        if (!userRepository.existsByEmail("admin@sih.gov.in")) {
            User admin = new User(
                    "admin@sih.gov.in",
                    passwordEncoder.encode("admin123"),
                    "Ministry Admin (Tribal Welfare)",
                    "+91 9876543210",
                    Role.ADMIN
            );
            userRepository.save(admin);
            log.info("Default Admin user created: admin@sih.gov.in");
        }

        // 2. Seed Demo Student
        if (!userRepository.existsByEmail("student@sih.gov.in")) {
            User student = new User(
                    "student@sih.gov.in",
                    passwordEncoder.encode("student123"),
                    "Birsa Soren",
                    "+91 9123456780",
                    Role.STUDENT
            );
            student = userRepository.save(student);

            StudentProfile profile = new StudentProfile();
            profile.setUser(student);
            profile.setGender("Male");
            profile.setDateOfBirth(LocalDate.of(2003, 7, 15));
            profile.setCategory("ST");
            profile.setTribeName("Santhal");
            profile.setAnnualFamilyIncome(120000.0);
            profile.setState("Jharkhand");
            profile.setDistrict("Ranchi");
            profile.setPincode("834001");
            profile.setInstitutionName("National Institute of Technology Jamshedpur");
            profile.setCourse("B.Tech Computer Science");
            profile.setCurrentYear("3rd Year");
            profile.setGpaOrPercentage(82.5);
            profile.setBankAccountNumber("349281729012");
            profile.setBankIfsc("SBIN0001234");
            profile.setAadhaarNumber("5678-1234-9012");
            profile.setCasteCertificateNumber("JH-ST-2022-8921");
            profile.setIncomeCertificateNumber("JH-INC-2023-4412");
            profile.setIsCasteVerified(true);
            profile.setIsIncomeVerified(true);
            profile.setUpdatedAt(LocalDateTime.now());
            profileRepository.save(profile);
            log.info("Default Demo Student created: student@sih.gov.in");
        }

        // 3. Seed Realistic Tribal Scholarship Schemes
        if (schemeRepository.count() == 0) {
            ScholarshipScheme s1 = new ScholarshipScheme();
            s1.setTitle("National Fellowship and Scholarship for Higher Education of ST Students");
            s1.setDescription("Central Sector Scheme covering full tuition fee, living allowance, and contingency grant for Scheduled Tribe students pursuing M.Phil, Ph.D, and professional graduate courses.");
            s1.setProvider("Ministry of Tribal Affairs, Govt. of India");
            s1.setCategory("Higher Education");
            s1.setTargetCaste("ST");
            s1.setMaxIncomeLimit(600000.0);
            s1.setMinGpaOrPercentage(55.0);
            s1.setScholarshipAmount(28000.0);
            s1.setDeadline(LocalDate.now().plusMonths(3));
            s1.setRequiredDocuments("ST Caste Certificate, Family Income Certificate, College Admission Offer Letter, Graduation Marksheet, Bank Passbook");
            s1.setActive(true);
            s1.setEligibleCourses("B.Tech, MBBS, MBA, M.Phil, Ph.D, Master's Degree");
            schemeRepository.save(s1);

            ScholarshipScheme s2 = new ScholarshipScheme();
            s2.setTitle("Post-Matric Scholarship for Scheduled Tribe (ST) Students");
            s2.setDescription("Financial assistance to tribal students studying at post-matriculation or post-secondary stage to enable them to complete their education.");
            s2.setProvider("Ministry of Tribal Affairs & State Tribal Welfare Departments");
            s2.setCategory("Post-Matric");
            s2.setTargetCaste("ST");
            s2.setMaxIncomeLimit(250000.0);
            s2.setMinGpaOrPercentage(50.0);
            s2.setScholarshipAmount(15000.0);
            s2.setDeadline(LocalDate.now().plusMonths(2));
            s2.setRequiredDocuments("Valid ST Caste Certificate, Annual Income Certificate, Class 10/12 Marksheet, Fee Receipt");
            s2.setActive(true);
            s2.setEligibleCourses("Class 11, Class 12, ITI, Polytechnic Diploma, General Degree Courses");
            schemeRepository.save(s2);

            ScholarshipScheme s3 = new ScholarshipScheme();
            s3.setTitle("Top Class Education for Scheduled Tribe Students");
            s3.setDescription("Promoting qualitative education among ST students by providing full financial support in premier notified institutions including IITs, NITs, IIMs, and AIIMS.");
            s3.setProvider("Ministry of Tribal Affairs, Govt. of India");
            s3.setCategory("Top Class");
            s3.setTargetCaste("ST");
            s3.setMaxIncomeLimit(600000.0);
            s3.setMinGpaOrPercentage(60.0);
            s3.setScholarshipAmount(85000.0);
            s3.setDeadline(LocalDate.now().plusMonths(4));
            s3.setRequiredDocuments("ST Tribe Certificate, Competent Authority Income Certificate, JEE/NEET/CAT Scorecard, Institute ID Card");
            s3.setActive(true);
            s3.setEligibleCourses("B.Tech (IIT/NIT), MBBS (AIIMS), MBA (IIM), National Law Universities");
            schemeRepository.save(s3);

            ScholarshipScheme s4 = new ScholarshipScheme();
            s4.setTitle("Pre-Matric Scholarship for Tribal Children (Class IX & X)");
            s4.setDescription("Aimed at supporting tribal parents to send children to secondary school to curb dropouts among ST children between Classes 9 and 10.");
            s4.setProvider("Ministry of Tribal Affairs");
            s4.setCategory("Pre-Matric");
            s4.setTargetCaste("ST");
            s4.setMaxIncomeLimit(200000.0);
            s4.setMinGpaOrPercentage(45.0);
            s4.setScholarshipAmount(4500.0);
            s4.setDeadline(LocalDate.now().plusMonths(1));
            s4.setRequiredDocuments("ST Certificate, Income Certificate from Gram Panchayat/Tahasildar, Class 8 Marksheet");
            s4.setActive(true);
            s4.setEligibleCourses("Class 9, Class 10");
            schemeRepository.save(s4);

            ScholarshipScheme s5 = new ScholarshipScheme();
            s5.setTitle("National Overseas Scholarship Scheme for Tribal Students");
            s5.setDescription("Full financial support to selected ST candidates for pursuing Master's level courses and Ph.D abroad in Engineering, Management, Agriculture, and Medicine.");
            s5.setProvider("Ministry of Tribal Affairs, Govt. of India");
            s5.setCategory("Overseas Fellowship");
            s5.setTargetCaste("ST");
            s5.setMaxIncomeLimit(800000.0);
            s5.setMinGpaOrPercentage(60.0);
            s5.setScholarshipAmount(250000.0);
            s5.setDeadline(LocalDate.now().plusMonths(5));
            s5.setRequiredDocuments("Valid Passport, ST Certificate, Income Tax Return / Income Certificate, Foreign University Unconditional Offer, IELTS/TOEFL Scorecard");
            s5.setActive(true);
            s5.setEligibleCourses("Master's and Ph.D programs at accredited universities abroad");
            schemeRepository.save(s5);

            log.info("Initialized 5 official Tribal Scholarship Schemes");
        }
    }
}
