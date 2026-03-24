package com.virtualwardrobe.backend.models;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Clothes {
    private int clothes_id;
    private int user_id;
    private String name;
    private String url_model;
    private String image_url;
    private int type_id;
    private int size_id;
    private int material_id;
    private int fit_id;
    private int preference_level;

}
