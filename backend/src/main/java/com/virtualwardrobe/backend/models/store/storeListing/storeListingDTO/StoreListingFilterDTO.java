package com.virtualwardrobe.backend.models.store.storeListing.storeListingDTO;

import com.virtualwardrobe.backend.models.store.storeListing.StoreStatus;

import java.time.LocalDate;

public class StoreListingFilterDTO {
    private int listingId;
    private int sellerId;
    private int clothesId;
    private double price;
    private String description;
    private StoreStatus status;
}
