package com.virtualwardrobe.models.store;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreListing {
    private int listing_id;
    private int clothes_id;
    private int seller_id;
    private int price;
    private String bio;
    private String status;
    private Dated date_listed;
}
