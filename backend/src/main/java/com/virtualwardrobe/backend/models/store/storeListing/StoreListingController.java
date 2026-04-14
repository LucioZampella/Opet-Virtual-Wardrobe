package com.virtualwardrobe.backend.models.store.storeListing;


import com.virtualwardrobe.backend.models.clothe.Clothe;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.ClotheDTO;
import com.virtualwardrobe.backend.models.store.storeListing.storeListingDTO.ListingResponseDTO;
import com.virtualwardrobe.backend.models.store.storeListing.storeListingDTO.StoreListingDTO;
import com.virtualwardrobe.backend.models.store.storeListing.storeListingDTO.StoreListingFilterDTO;
import com.virtualwardrobe.backend.models.store.storeListing.storeListingDTO.UpdateListingDTO;
import com.virtualwardrobe.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/store")
public class StoreListingController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private StoreListingService service;

    @PostMapping
    public ResponseEntity<?> createListing(
            @RequestBody @Valid StoreListingDTO dto,
            @RequestHeader("Authorization") String authHeader) {

        int sellerId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        service.crear(dto, sellerId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{listingId}")
    public ResponseEntity<?> updateListing(
            @PathVariable int listingId,
            @RequestBody @Valid UpdateListingDTO dto,
            @RequestHeader("Authorization") String authHeader) {

        int sellerId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        service.modificar(listingId, dto, sellerId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{listingId}")
    public ResponseEntity<?> deleteListing(
            @PathVariable int listingId,
            @RequestHeader("Authorization") String authHeader) {

        int sellerId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        service.eliminar(listingId, sellerId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/home")
    public ResponseEntity<List<StoreListing>> getAllListings() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{listingId}")
    public ResponseEntity<ListingResponseDTO> findListingById(@PathVariable int listingId) {
        return ResponseEntity.ok(service.buscarPorId(listingId));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<StoreListing>> filtrar (
            @RequestParam(required = false) Double min,
            @RequestParam(required = false) Double max,
            @RequestParam(required = false) Integer typeId,
            @RequestParam(required = false) Integer sizeId,
            @RequestParam(required = false) Integer materialId,
            @RequestParam(required = false) Integer fitId,
            @RequestParam(required = false) List<Long> colorIds,
            @RequestParam(required = false) String name,
    @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(service.filtrar(min, max, typeId, sizeId, materialId, fitId, colorIds, name));
    }
}


