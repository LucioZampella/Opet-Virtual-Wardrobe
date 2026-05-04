package com.virtualwardrobe.backend.models.searchFeed;

import com.virtualwardrobe.backend.models.post.PostDTO.PostResponseDTO;
import com.virtualwardrobe.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feed")
public class SearchFeedController {

    @Autowired
    private SearchFeedService searchFeedService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/{userId}")
    public ResponseEntity<List<PostResponseDTO>> getFeed(
            @RequestHeader("Authorization") String authHeader) {
        try {
            int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
            List<PostResponseDTO> feed = searchFeedService.generarFeed(userId);
            return ResponseEntity.ok(feed);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}