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

    @PostMapping(value = "/tts", produces = "audio/mpeg")
    public ResponseEntity<byte[]> textToSpeech(@RequestBody Map<String, String> body) {
        String text = body.getOrDefault("text", "");
        String language = body.getOrDefault("language", "en");
        byte[] audioBytes = aiClientService.generateTtsAudio(text, language);
        if (audioBytes == null || audioBytes.length == 0) {
            return ResponseEntity.noContent().build();
        }
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.valueOf("audio/mpeg"));
        headers.setContentLength(audioBytes.length);
        return new ResponseEntity<>(audioBytes, headers, org.springframework.http.HttpStatus.OK);
    }
}
