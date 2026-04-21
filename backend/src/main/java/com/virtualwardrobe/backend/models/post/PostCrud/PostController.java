package com.virtualwardrobe.backend.models.post.PostCrud;

import com.virtualwardrobe.backend.models.post.PostDTO.PostDTO;
import com.virtualwardrobe.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService service;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestBody @Valid PostDTO dto,
            @RequestHeader("Authorization") String authHeader) {
        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        service.crear(dto, userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
                                         @PathVariable int id,
                                         @RequestBody String nuevaDescripcion,
                                         @RequestHeader("Authorization") String authHeader) {
        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        service.modificar(id, nuevaDescripcion, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable int id,
            @RequestHeader("Authorization") String authHeader) {
        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        service.eliminar(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-posts")
    public ResponseEntity<List<Post>> getMyPosts(
            @RequestHeader("Authorization") String authHeader) {
        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(service.obtenerPorUsuario(userId));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<Post>> getFeedPosts() {
        return ResponseEntity.ok(service.obtenerTodas());
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable int userId) {
        return ResponseEntity.ok(service.obtenerPorUsuario(userId));
    }
}