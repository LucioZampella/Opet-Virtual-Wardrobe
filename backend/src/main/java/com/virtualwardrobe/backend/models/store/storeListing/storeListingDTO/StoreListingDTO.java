package com.virtualwardrobe.backend.models.store.storeListing.storeListingDTO;

import com.virtualwardrobe.backend.models.store.storeListing.StoreStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoreListingDTO {

    @NotBlank(message = "Debe elegir una prenda para vender")
    private int clothesId;

    @NotBlank(message = "Debe asignar un precio")
    @Min(1)
    @Max(10000000)
    private double price;

    @NotBlank(message = "Debe describir su producto")
    private String description;


}
