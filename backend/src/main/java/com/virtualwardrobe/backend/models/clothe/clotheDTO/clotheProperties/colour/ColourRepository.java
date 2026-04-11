package com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.colour;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColourRepository extends JpaRepository<Colour, Long> {}
