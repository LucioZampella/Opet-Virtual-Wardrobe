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
    public ResponseEntity<?> updatePostt(
            @PathVariable int id,
            @RequestBody @Valid String dto,
            @RequestHeader("Authorization") String authHeader) {

        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));

        service.modificar(id, dto, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePostt(
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
    public ResponseEntity<List<Post>> getFeedPosts(
            @RequestHeader("Authorization") String authHeader){
            return ResponseEntity.ok(service.obtenerTodas());
    }

}
