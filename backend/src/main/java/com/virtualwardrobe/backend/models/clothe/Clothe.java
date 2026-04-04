package com.virtualwardrobe.backend.models.clothe;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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

    @Column(name = "fit_id")
    private int fitId;

    // 0 no esta en favoritos, 1 si
    @Column(name = "preference_level")
    private int preferenceLevel;

}