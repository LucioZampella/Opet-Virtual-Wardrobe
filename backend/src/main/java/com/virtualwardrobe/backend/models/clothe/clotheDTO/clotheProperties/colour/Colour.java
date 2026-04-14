package com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.colour;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.virtualwardrobe.backend.models.clothe.Clothe;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name="colours")
public class Colour {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;

    private String name;

    @JsonIgnoreProperties("colours") // O @JsonIgnore
    @ManyToMany(mappedBy = "colours")
    private List<Clothe> clothes;


    public Colour(String nombre) {
        this.name = nombre;
    }

    public Colour() {
    }
}
