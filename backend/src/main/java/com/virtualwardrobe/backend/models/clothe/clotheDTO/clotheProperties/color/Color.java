package com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.color;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.virtualwardrobe.backend.models.clothe.Clothe;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name="colours")
public class Color {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;

    private String name;

    @JsonIgnoreProperties("colorIds")
    @ManyToMany(mappedBy = "colorIds")
    private List<Clothe> clothes;


    public Color(String nombre) {
        this.name = nombre;
    }

    public Color() {
    }
}
