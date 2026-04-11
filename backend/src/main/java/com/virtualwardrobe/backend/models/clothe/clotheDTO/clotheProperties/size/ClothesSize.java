package com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.size;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Entity
@Table(name = "clothes_size")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClothesSize {
    @jakarta.persistence.Id
    @Id
    @Column(name = "size_id")
    private int id;
    @Column(name = "size_name")
    private String name;

}