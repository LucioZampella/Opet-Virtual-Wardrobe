package com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.fit;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Entity
@Table(name = "clothes_fit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClothesFit {
    @jakarta.persistence.Id
    @Id
    @Column(name = "fit_id")
    private int id;
    @Column(name = "fit_name")
    private String name;

}