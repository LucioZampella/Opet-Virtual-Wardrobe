package com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.color;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColorRepository extends JpaRepository<Color, Long> {

    @Override
    List<Color> findAllById(Iterable<Long> longs);

}
