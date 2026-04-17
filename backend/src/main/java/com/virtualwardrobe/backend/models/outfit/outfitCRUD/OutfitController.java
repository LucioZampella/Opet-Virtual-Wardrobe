package com.virtualwardrobe.backend.models.outfit.outfitCRUD;

import com.virtualwardrobe.backend.models.clothe.Clothe;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.ClotheDTO;
import com.virtualwardrobe.backend.models.outfit.outfitDTO.OutfitDTO;
import com.virtualwardrobe.backend.models.outfit.outfitResponse.OutfitResponse;
import com.virtualwardrobe.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequestMapping("/outfit")
public class OutfitController {

    @Autowired
    private OutfitService service;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> createOutfit(
            @RequestBody @Valid OutfitDTO dto,
            @RequestHeader("Authorization") String authHeader) {

        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));

        service.crear(dto, userId);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOutfit(
            @PathVariable int id,
            @RequestBody @Valid OutfitDTO dto,
            @RequestHeader("Authorization") String authHeader) {

        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));

        service.modificar(dto, id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOutfit(
            @PathVariable int id,
            @RequestHeader("Authorization") String authHeader) {

        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        service.eliminar(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OutfitResponse> findOutfitById(@PathVariable int id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/my-outfits")
    public ResponseEntity<List<Outfit>> getMyOutfit(
            @RequestHeader("Authorization") String authHeader) {
        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(service.listarPorUserId(userId));
    }

}
