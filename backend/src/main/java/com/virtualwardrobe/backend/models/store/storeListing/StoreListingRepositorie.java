package com.virtualwardrobe.backend.models.store.storeListing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StoreListingRepositorie extends JpaRepository<StoreListing, Integer> {

    Optional<StoreListing> findById(int listingId);

    List<StoreListing> findBySellerId(int sellerId);

    @Query("SELECT p FROM StoreListing p WHERE " +
            "(:min IS NULL OR p.price >= :min) AND " +
            "(:max IS NULL OR p.price <= :max) AND " +
            "(:typeId IS NULL OR p.clothe.typeId = :typeId) AND" +
            "(:sizeId IS NULL OR p.clothe.sizeId = :sizeId) AND" +
            "(:materialId IS NULL OR p.clothe.materialId = :materialId) AND" +
            "(:fitId IS NULL OR p.clothe.fitId = :fitId) AND" +
            "(:colorId IS NULL OR p.clothe.colorId = :colorId) AND" +
            "(:name IS NULL OR p.clothe.name = :name)")
    List<StoreListing> filterByAll(Double min, Double max, Integer typeId, Integer sizeId, Integer materialId,
                                   Integer fitId, Integer colorId, String name);

    List<StoreListing> findAllByOrderByDateDesc();
}
