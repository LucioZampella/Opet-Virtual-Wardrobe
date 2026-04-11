package com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.type;

import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.colour.Colour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClothesTypeRepositorie extends JpaRepository<ClothesType, Long> {
}
