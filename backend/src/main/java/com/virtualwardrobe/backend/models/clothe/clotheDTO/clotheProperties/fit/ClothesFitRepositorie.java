package com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.fit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClothesFitRepositorie extends JpaRepository<ClothesFit, Long> {
}
