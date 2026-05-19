package com.virtualwardrobe.backend.models.clothe;

import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.color.Color;
import com.virtualwardrobe.backend.models.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;


    @Column
    private String name;

    @Column
    private String url_model;

    @Column(name = "image_url")
    private String image_url;

    @Column(name = "type_id")
    private int typeId;

    @Column(name = "size_id")
    private int sizeId;

    @Column(name = "material_id")
    private int materialId;

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
    private List<Color> colorIds;
    }

