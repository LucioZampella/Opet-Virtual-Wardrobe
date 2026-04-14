package com.virtualwardrobe.backend.models.clothe;

import com.virtualwardrobe.backend.models.clothe.clotheDTO.ClotheDTO;
import com.virtualwardrobe.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/clothes")
public class ClotheController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private ClotheService service;

    @PostMapping
    public ResponseEntity<?> createClothe(
            @RequestBody @Valid ClotheDTO dto,
            @RequestHeader("Authorization") String authHeader) {

        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        service.crear(dto, userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateClothe(
            @PathVariable int id,
            @RequestBody @Valid ClotheDTO dto,
            @RequestHeader("Authorization") String authHeader) {

        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        service.modificar(id, dto, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClothe(
            @PathVariable int id,
            @RequestHeader("Authorization") String authHeader) {

        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        service.eliminar(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClotheDTO> findClotheById(@PathVariable int id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/my-clothes")
    public ResponseEntity<List<Clothe>> getMyClothe(
            @RequestHeader("Authorization") String authHeader) {

        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(service.listarPorUserId(userId));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Clothe>> filtrar(
            @RequestParam(required = false) Integer typeId,
            @RequestParam(required = false) Integer sizeId,
            @RequestParam(required = false) Integer materialId,
            @RequestParam(required = false) Integer fitId,
            @RequestParam(required = false) List<Long> colourIds,
            @RequestParam(required = false) Integer preferenceLevel,
            @RequestParam(required = false) String name,
            @RequestHeader("Authorization") String authHeader) {

        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        System.out.println("COLORES RECIBIDOS EN BACKEND: " + colourIds); // <-- MIRA LA CONSOLA DE TU BACKEND
        // ...
        return ResponseEntity.ok(service.filtrar(userId, typeId, sizeId, materialId, fitId, colourIds, preferenceLevel, name));
    }
}