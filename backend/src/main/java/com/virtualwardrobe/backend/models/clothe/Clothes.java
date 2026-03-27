package com.virtualwardrobe.backend.models.clothe;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity

@Table (name = "Clothes")
public class Clothes
{
    @jakarta.persistence.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column
    private int clothes_id;
    private int user_id;

    @NotBlank(message = "Debe ingresar un name")
    private String name;


    private String url_model;
    private String image_url;

    @NotBlank(message = "Debe ingresar un tipo")
    private int type_id;
    @NotBlank(message = "Debe ingresar un talle")
    private int size_id;
    @NotBlank(message = "Debe ingresar un material")
    private int material_id;
    @NotBlank(message = "Debe ingresar un corte")
    private int fit_id;

    private int preference_level;



}
