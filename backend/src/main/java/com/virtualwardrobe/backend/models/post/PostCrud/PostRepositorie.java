package com.virtualwardrobe.backend.models.post.PostCrud;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PostRepositorie extends JpaRepository<Post, Long> {
    List<Post> findByUserId(int user_id);
    Optional<Post> findById(int id );
    Page<Post> findAll(Pageable pageable);
    List<Post> findAllByOrderByFechaCreacionDesc();

    @Query("SELECT p FROM Post p WHERE p.clothe IS NOT NULL " +
            "AND (:typeId IS NULL OR p.clothe.typeId = :typeId) " +
            "AND (:sizeId IS NULL OR p.clothe.sizeId = :sizeId) " +
            "AND (:materialId IS NULL OR p.clothe.materialId = :materialId) " +
            "AND (:fitId IS NULL OR p.clothe.fitId = :fitId) " +
            "AND (COALESCE(:colorIds, NULL) IS NULL OR EXISTS (SELECT c FROM p.clothe.colorIds c WHERE c.id IN :colorIds))")
    Page<Post> findFilteredClothes(Integer typeId, Integer sizeId, Integer materialId, Integer fitId, List<Long> colorIds, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Post p JOIN p.outfit o JOIN o.clothes c " +
            "WHERE (:materialId IS NULL OR c.materialId = :materialId) " +
            "AND (:fitId IS NULL OR c.fitId = :fitId) " +
            "AND (COALESCE(:colorIds, NULL) IS NULL OR EXISTS (SELECT col FROM c.colorIds col WHERE col.id IN :colorIds))")
    Page<Post> findFilteredOutfits(Integer materialId, Integer fitId, List<Long> colorIds, Pageable pageable);
}
