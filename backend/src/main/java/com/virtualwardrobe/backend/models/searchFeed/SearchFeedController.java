package com.virtualwardrobe.backend.models.searchFeed;

import com.virtualwardrobe.backend.models.post.PostDTO.PostResponseDTO;
import com.virtualwardrobe.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<Page<PostResponseDTO>> getFeed(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
            Page<PostResponseDTO> feed = searchFeedService.generarFeed(userId, page, size);
            return ResponseEntity.ok(feed);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}