package com.virtualwardrobe.backend.models.store.storeListing;

import com.virtualwardrobe.backend.models.clothe.Clothe;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "Store_Listing")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "listing_id")
    private int listingId;

    @ManyToOne
    @JoinColumn(name = "clothes_id", insertable = false, updatable = false)
    private Clothe clothe;

    @Column(name = "clothes_id")
    private int clothesId;

    @Column(name = "seller_id")
    private int sellerId;

    @Column(name = "price")
    private double price;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StoreStatus status;

    @Column(name = "date_listed")
    private LocalDate date;

}

