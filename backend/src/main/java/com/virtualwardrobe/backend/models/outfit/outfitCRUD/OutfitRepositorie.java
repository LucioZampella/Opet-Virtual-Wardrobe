package com.virtualwardrobe.backend.models.outfit.outfitCRUD;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OutfitRepositorie extends JpaRepository<Outfit, Long> {

        Optional<Outfit> findById(int id);
        List<Outfit> findByUserId(int id);

        @Query("""
    SELECT c.id, c.name, c.image_url, COUNT(o)
    FROM Outfit o JOIN o.clothes c
    WHERE o.user.id = :userId
    GROUP BY c.id, c.name, c.image_url
    ORDER BY COUNT(o) DESC
    """)
        List<Object[]> topClothesByUsage(@Param("userId") int userId, Pageable pageable);

        @Query("SELECT AVG(o.level_of_coincidence) FROM Outfit o WHERE o.user.id = :userId")
        Double avgCoincidenceLevel(@Param("userId") int userId);

        long countByUserId(int userId);
}
