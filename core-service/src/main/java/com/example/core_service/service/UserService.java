package com.example.core_service.service;

import com.example.core_service.dto.*;
import com.example.core_service.model.Role;
import com.example.core_service.model.StudentProfile;
import com.example.core_service.model.User;
import com.example.core_service.repository.StudentProfileRepository;
import com.example.core_service.repository.UserRepository;
import com.example.core_service.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public UserService(UserRepository userRepository,
                       StudentProfileRepository studentProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + req.getEmail());
        }

        User user = new User(
                req.getEmail(),
                passwordEncoder.encode(req.getPassword()),
                req.getFullName(),
                req.getPhone(),
                req.getRole() != null ? req.getRole() : Role.STUDENT
        );
        user = userRepository.save(user);

        if (user.getRole() == Role.STUDENT) {
            StudentProfile profile = new StudentProfile();
            profile.setUser(user);
            profile.setCategory(req.getCategory() != null ? req.getCategory() : "ST");
            profile.setTribeName(req.getTribeName());
            profile.setAnnualFamilyIncome(req.getAnnualFamilyIncome());
            profile.setUpdatedAt(LocalDateTime.now());
            studentProfileRepository.save(profile);
            user.setStudentProfile(profile);
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }

    public AuthResponse login(AuthRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }

    public StudentProfileDTO getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    StudentProfile newP = new StudentProfile();
                    newP.setUser(user);
                    return studentProfileRepository.save(newP);
                });

        return mapToProfileDTO(profile, user);
    }

    @Transactional
    public StudentProfileDTO updateProfile(String email, StudentProfileDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        if (dto.getFullName() != null) {
            user.setFullName(dto.getFullName());
        }
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone());
        }
        userRepository.save(user);

        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    StudentProfile newP = new StudentProfile();
                    newP.setUser(user);
                    return newP;
                });

        if (dto.getDateOfBirth() != null) profile.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getGender() != null) profile.setGender(dto.getGender());
        if (dto.getCategory() != null) profile.setCategory(dto.getCategory());
        if (dto.getTribeName() != null) profile.setTribeName(dto.getTribeName());
        if (dto.getAnnualFamilyIncome() != null) profile.setAnnualFamilyIncome(dto.getAnnualFamilyIncome());
        if (dto.getState() != null) profile.setState(dto.getState());
        if (dto.getDistrict() != null) profile.setDistrict(dto.getDistrict());
        if (dto.getPincode() != null) profile.setPincode(dto.getPincode());
        if (dto.getInstitutionName() != null) profile.setInstitutionName(dto.getInstitutionName());
        if (dto.getCourse() != null) profile.setCourse(dto.getCourse());
        if (dto.getCurrentYear() != null) profile.setCurrentYear(dto.getCurrentYear());
        if (dto.getGpaOrPercentage() != null) profile.setGpaOrPercentage(dto.getGpaOrPercentage());
        if (dto.getBankAccountNumber() != null) profile.setBankAccountNumber(dto.getBankAccountNumber());
        if (dto.getBankIfsc() != null) profile.setBankIfsc(dto.getBankIfsc());
        if (dto.getAadhaarNumber() != null) profile.setAadhaarNumber(dto.getAadhaarNumber());
        if (dto.getCasteCertificateNumber() != null) profile.setCasteCertificateNumber(dto.getCasteCertificateNumber());
        if (dto.getIncomeCertificateNumber() != null) profile.setIncomeCertificateNumber(dto.getIncomeCertificateNumber());
        if (dto.getIsCasteVerified() != null) profile.setIsCasteVerified(dto.getIsCasteVerified());
        if (dto.getIsIncomeVerified() != null) profile.setIsIncomeVerified(dto.getIsIncomeVerified());
        profile.setUpdatedAt(LocalDateTime.now());

        profile = studentProfileRepository.save(profile);
        return mapToProfileDTO(profile, user);
    }

    private StudentProfileDTO mapToProfileDTO(StudentProfile p, User u) {
        StudentProfileDTO dto = new StudentProfileDTO();
        dto.setId(p.getId());
        dto.setUserId(u.getId());
        dto.setFullName(u.getFullName());
        dto.setEmail(u.getEmail());
        dto.setPhone(u.getPhone());
        dto.setDateOfBirth(p.getDateOfBirth());
        dto.setGender(p.getGender());
        dto.setCategory(p.getCategory());
        dto.setTribeName(p.getTribeName());
        dto.setAnnualFamilyIncome(p.getAnnualFamilyIncome());
        dto.setState(p.getState());
        dto.setDistrict(p.getDistrict());
        dto.setPincode(p.getPincode());
        dto.setInstitutionName(p.getInstitutionName());
        dto.setCourse(p.getCourse());
        dto.setCurrentYear(p.getCurrentYear());
        dto.setGpaOrPercentage(p.getGpaOrPercentage());
        dto.setBankAccountNumber(p.getBankAccountNumber());
        dto.setBankIfsc(p.getBankIfsc());
        dto.setAadhaarNumber(p.getAadhaarNumber());
        dto.setCasteCertificateNumber(p.getCasteCertificateNumber());
        dto.setIncomeCertificateNumber(p.getIncomeCertificateNumber());
        dto.setIsCasteVerified(p.getIsCasteVerified());
        dto.setIsIncomeVerified(p.getIsIncomeVerified());
        return dto;
    }
}
