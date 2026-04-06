package com.virtualwardrobe.backend.models.clothe;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "clothes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Clothe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "clothes_id")
    private int id;

    @Column(name = "user_id")
    private int userId;

    @Column(length = 20)
    private String name;

    @Column
    private String url_model;

    @Column
    private String image_url;

    @Column(name = "type_id")
    private int typeId;

    @Column(name = "size_id")
    private int sizeId;

    @Column(name = "material_id")
    private int materialId;

    @Column(name = "color_id")
    private int colorId;

    @Column(name = "fit_id")
    private int fitId;

    // del 1 al 100 que tanto le gusta al user determinada prenda
    @Column(name = "preference_level")
    private int preferenceLevel;

}