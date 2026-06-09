package com.virtualwardrobe.backend.models.gemini;

import com.virtualwardrobe.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gemini")
public class GroqController {

    @Autowired
    private GroqService geminiService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/recommendation")
    public ResponseEntity<String> getRecommendation(
            @RequestBody Map<String, String> payload,
            @RequestHeader("Authorization") String authHeader) {
        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));

        String input = payload.get("input");

        if (input == null || input.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El mensaje de entrada no puede estar vacío.");
        }

        String recomendacion = geminiService.getRecommendation(input, userId);
        return ResponseEntity.ok(recomendacion);
    }
}