package com.virtualwardrobe.backend.models.store.storeListing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StoreListingRepositorie extends JpaRepository<StoreListing, Integer> {

    Optional<StoreListing> findByListingId(int listingId);

    List<StoreListing> findBySellerId(int sellerId);

    @Query("SELECT DISTINCT p FROM StoreListing p " +
                  "LEFT JOIN p.clothe.colorIds c " + // Hacemos join para acceder a los colores
                  "WHERE (:min IS NULL OR p.price >= :min) AND " +
                  "(:max IS NULL OR p.price <= :max) AND " +
                  "(:typeId IS NULL OR p.clothe.typeId = :typeId) AND " +
                  "(:sizeId IS NULL OR p.clothe.sizeId = :sizeId) AND " +
                  "(:materialId IS NULL OR p.clothe.materialId = :materialId) AND " +
                  "(:fitId IS NULL OR p.clothe.fitId = :fitId) AND " +
            "(COALESCE(:colorIds, NULL) IS NULL OR c.id IN :colorIds) AND " + // Usamos el ID del color
                  "(:name IS NULL OR p.clothe.name LIKE CONCAT('%', :name, '%'))")
    List<StoreListing> filterByAll(Double min, Double max, Integer typeId, Integer sizeId, Integer materialId,
                                   Integer fitId, List<Long> colorIds, String name);

    List<StoreListing> findAllByOrderByDateDesc();
}
