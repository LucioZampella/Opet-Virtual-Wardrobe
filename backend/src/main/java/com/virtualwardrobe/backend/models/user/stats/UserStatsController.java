package com.virtualwardrobe.backend.models.user.stats;

import com.virtualwardrobe.backend.models.user.stats.dto.UserStatsDTO;
import com.virtualwardrobe.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class UserStatsController {

    @Autowired
    private UserStatsService statsService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserStatsDTO> getStats(
            @RequestHeader("Authorization") String authHeader
    ) {
        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(statsService.getUserStats(userId));
    }
}
