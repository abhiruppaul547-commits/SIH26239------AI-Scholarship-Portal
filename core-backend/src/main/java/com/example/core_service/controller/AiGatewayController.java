package com.example.core_service.controller;

import com.example.core_service.service.AiClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiGatewayController {

    private final AiClientService aiClientService;

    public AiGatewayController(AiClientService aiClientService) {
        this.aiClientService = aiClientService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chatWithVernacularAi(@RequestBody Map<String, String> body) {
        String message = body.getOrDefault("message", "");
        String language = body.getOrDefault("language", "en");
        String context = body.getOrDefault("context", "SIH26239 Tribal Scholarship Portal");

        Map<String, Object> reply = aiClientService.chatWithAssistant(message, language, context);
        return ResponseEntity.ok(reply);
    }
}
