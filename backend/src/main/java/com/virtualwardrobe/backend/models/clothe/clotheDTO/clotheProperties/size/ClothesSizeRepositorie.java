package com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.size;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface  ClothesSizeRepositorie extends JpaRepository<ClothesSize, Long> {
}
