package com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.material;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClothesMaterialRepositorie extends JpaRepository<ClothesMaterial, Long> {
}
