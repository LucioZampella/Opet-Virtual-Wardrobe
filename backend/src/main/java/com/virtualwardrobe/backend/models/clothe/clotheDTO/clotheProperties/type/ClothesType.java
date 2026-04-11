package com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.type;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Entity
@Table(name = "clothes_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClothesType {
    @jakarta.persistence.Id
    @Id
    @Column(name = "type_id")
    private int id;
    @Column(name = "type_name")
    private String name;

}