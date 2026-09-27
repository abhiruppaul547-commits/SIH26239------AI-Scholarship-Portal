package com.example.core_service.controller;

import com.example.core_service.dto.AuthRequest;
import com.example.core_service.dto.AuthResponse;
import com.example.core_service.dto.RegisterRequest;
import com.example.core_service.dto.StudentProfileDTO;
import com.example.core_service.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(userService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        return ResponseEntity.ok(userService.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<StudentProfileDTO> getMe(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.getProfileByEmail(auth.getName()));
    }
}
