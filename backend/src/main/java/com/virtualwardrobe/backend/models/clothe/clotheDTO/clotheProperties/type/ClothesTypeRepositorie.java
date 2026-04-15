package com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.type;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClothesTypeRepositorie extends JpaRepository<ClothesType, Long> {
}
