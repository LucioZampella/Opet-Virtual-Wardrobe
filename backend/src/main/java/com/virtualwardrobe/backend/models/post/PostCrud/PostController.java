package com.virtualwardrobe.backend.models.post.PostCrud;
import com.virtualwardrobe.backend.models.post.PostDTO.PostRequestDTO;
import com.virtualwardrobe.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
            @RequestBody @Valid PostRequestDTO dto,
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

    @GetMapping("/filter")
    public ResponseEntity<Page<Post>> filterPosts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer typeId,
            @RequestParam(required = false) Integer sizeId,
            @RequestParam(required = false) Integer materialId,
            @RequestParam(required = false) Integer fitId,
            @RequestParam(required = false) List<Long> colorIds,
            @PageableDefault(size = 20) Pageable pageable) { // Importa Pageable de spring.data.domain

        return ResponseEntity.ok(service.filtrar(name, typeId, sizeId, materialId, fitId, colorIds, pageable));
    }

}