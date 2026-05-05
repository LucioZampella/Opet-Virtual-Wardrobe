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

    @GetMapping("/filter")
    public ResponseEntity<Page<PostResponseDTO>> filtrar(
            @RequestParam(required = false) Integer typeId,
            @RequestParam(required = false) Integer sizeId,
            @RequestParam(required = false) Integer materialId,
            @RequestParam(required = false) Integer fitId,
            @RequestParam(required = false) List<Long> colorIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("Authorization") String authHeader) {

            int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(searchFeedService.generarConFiltros(typeId, sizeId, materialId, fitId, colorIds, userId, page, size));
        }
}