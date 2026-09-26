package com.example.core_service.controller;

import com.example.core_service.dto.StudentProfileDTO;
import com.example.core_service.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class StudentProfileController {

    private final UserService userService;

    public StudentProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<StudentProfileDTO> getMyProfile(Authentication auth) {
        return ResponseEntity.ok(userService.getProfileByEmail(auth.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<StudentProfileDTO> updateMyProfile(Authentication auth,
                                                             @RequestBody StudentProfileDTO dto) {
        return ResponseEntity.ok(userService.updateProfile(auth.getName(), dto));
    }
}
