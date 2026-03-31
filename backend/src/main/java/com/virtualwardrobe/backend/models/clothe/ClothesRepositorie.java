package com.virtualwardrobe.backend.models.clothe;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClothesRepositorie extends JpaRepository<Clothes, Integer> {

    @Query(value="SELECT * FROM Clothes WHERE clothes_id = :id", nativeQuery = true)
    List<Clothes> listarPrendasDeUsuario(@Param("id") int id);


}
