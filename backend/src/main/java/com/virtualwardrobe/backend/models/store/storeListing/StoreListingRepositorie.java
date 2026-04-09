package com.virtualwardrobe.backend.models.store.storeListing;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoreListingRepositorie extends JpaRepository<StoreListing, Integer> {

    @Override
    Optional<StoreListing> findById(Integer listingId);

    List<StoreListing> findByUserId(Integer sellerId);

    List<StoreListing> findByPriceBetween(double min, double max);
}
