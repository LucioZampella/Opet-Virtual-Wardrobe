package com.virtualwardrobe.backend.models.clothe;

import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.colour.Colour;
import com.virtualwardrobe.backend.models.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


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

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

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

    @ManyToMany
    @JoinTable(
        name="clothe_colours",
        joinColumns = @JoinColumn(name= "clothes_id"),
            inverseJoinColumns = @JoinColumn(name = "colour_id")
            // creo la tabla "clothe_colours" donde estaran en como columnas  el clothe_id y el colour_id
    )
    private List<Colour> colours;
    }

