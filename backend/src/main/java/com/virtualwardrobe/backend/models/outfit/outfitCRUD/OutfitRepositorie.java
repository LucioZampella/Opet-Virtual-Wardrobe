package com.virtualwardrobe.backend.models.outfit.outfitCRUD;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OutfitRepositorie extends JpaRepository<Outfit, Long> {

        Optional<Outfit> findById(int id);
        List<Outfit> findByUserId(int id);
}
