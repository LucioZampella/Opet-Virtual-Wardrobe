package com.virtualwardrobe.backend.models.outfit.outfitCRUD;

import com.virtualwardrobe.backend.models.clothe.Clothe;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.color.Color;
import com.virtualwardrobe.backend.models.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "outfit")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Outfit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "outfit_id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column ( name = "name")
    private String name;


    @Column (name="level_of_coincidence")
    // is public() -> cambiado por hacer un
    private int level_of_coincidence;
    //-> prom de preferences  0<malo<40<medio<70<bueno<=100

    @ManyToMany
    @JoinTable(
            name="outfit_items",
            joinColumns = @JoinColumn(name= "outfit_id"),
            inverseJoinColumns = @JoinColumn(name = "clothes_id")
            // creo la tabla "outfit_items" donde estaran en como columnas  el outfit_id y el clothes_id
    )

    private List<Clothe> clothes;
}



