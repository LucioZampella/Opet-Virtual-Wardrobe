package com.virtualwardrobe.backend.models.store.storeListing.storeListingDTO;

import com.virtualwardrobe.backend.models.store.storeListing.StoreStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ListingResponseDTO {
    private int listingId;
    private int sellerId;
    private int clothesId;
    private double price;
    private String description;
    private StoreStatus status;
    private LocalDate date;
}
