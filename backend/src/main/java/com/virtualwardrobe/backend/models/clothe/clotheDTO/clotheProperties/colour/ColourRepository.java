package com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.colour;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColourRepository extends JpaRepository<Colour, Long> {

    @Override
    List<Colour> findAllById(Iterable<Long> longs);

}
