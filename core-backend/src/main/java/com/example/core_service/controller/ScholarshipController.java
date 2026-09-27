package com.example.core_service.controller;

import com.example.core_service.dto.RecommendationResponse;
import com.example.core_service.dto.ScholarshipSchemeDTO;
import com.example.core_service.model.StudentProfile;
import com.example.core_service.model.User;
import com.example.core_service.repository.StudentProfileRepository;
import com.example.core_service.repository.UserRepository;
import com.example.core_service.service.AiClientService;
import com.example.core_service.service.ScholarshipSchemeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scholarships")
public class ScholarshipController {

    private final ScholarshipSchemeService schemeService;
    private final AiClientService aiClientService;
    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;

    public ScholarshipController(ScholarshipSchemeService schemeService,
                                 AiClientService aiClientService,
                                 UserRepository userRepository,
                                 StudentProfileRepository profileRepository) {
        this.schemeService = schemeService;
        this.aiClientService = aiClientService;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @GetMapping
    public ResponseEntity<List<ScholarshipSchemeDTO>> getAllSchemes() {
        return ResponseEntity.ok(schemeService.getAllActiveSchemes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScholarshipSchemeDTO> getSchemeById(@PathVariable Long id) {
        return ResponseEntity.ok(schemeService.getSchemeById(id));
    }

    @PostMapping
    public ResponseEntity<ScholarshipSchemeDTO> createScheme(@RequestBody ScholarshipSchemeDTO dto) {
        return ResponseEntity.ok(schemeService.createScheme(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScholarshipSchemeDTO> updateScheme(@PathVariable Long id,
                                                             @RequestBody ScholarshipSchemeDTO dto) {
        return ResponseEntity.ok(schemeService.updateScheme(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheme(@PathVariable Long id) {
        schemeService.deleteScheme(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/recommended")
    public ResponseEntity<RecommendationResponse> getRecommendations(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            // Provide guest recommendations
            StudentProfile guestProfile = new StudentProfile();
            guestProfile.setCategory("ST");
            guestProfile.setAnnualFamilyIncome(150000.0);
            return ResponseEntity.ok(aiClientService.recommendSchemes(guestProfile));
        }

        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> {
                    StudentProfile p = new StudentProfile();
                    p.setUser(user);
                    p.setCategory("ST");
                    return p;
                });

        return ResponseEntity.ok(aiClientService.recommendSchemes(profile));
    }
}
