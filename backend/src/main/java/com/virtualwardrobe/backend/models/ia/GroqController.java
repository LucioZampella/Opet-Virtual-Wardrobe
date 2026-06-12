package com.virtualwardrobe.backend.models.ia;

import com.virtualwardrobe.backend.models.ia.response.GroqRecommendationResponse;
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
    public ResponseEntity<GroqRecommendationResponse> getRecommendation(
            @RequestBody Map<String, String> payload,
            @RequestHeader("Authorization") String authHeader) {
        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));

        String input = payload.get("input");
        if (payload.get("lat") == null || payload.get("lon") == null) {
            return ResponseEntity.badRequest().body(new GroqRecommendationResponse(null, null));
        }
        double lat = Double.parseDouble(payload.get("lat").toString());
        double lon = Double.parseDouble(payload.get("lon").toString());

        if (input == null || input.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new GroqRecommendationResponse(null, null));
        }

        GroqRecommendationResponse response = geminiService.getRecommendation(input, userId,lat,lon);
        return ResponseEntity.ok(response);
    }
}