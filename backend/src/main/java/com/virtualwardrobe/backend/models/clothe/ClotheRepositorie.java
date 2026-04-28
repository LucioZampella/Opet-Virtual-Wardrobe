package com.virtualwardrobe.backend.models.clothe;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClotheRepositorie extends JpaRepository<Clothe, Long> {

    Optional<Clothe> findById(int id);

    @Query("SELECT DISTINCT c FROM Clothe c LEFT JOIN FETCH c.colorIds WHERE c.user.id = :userId")
    List<Clothe> findByUserId(int userId);
    // devuelve todas las prendas que tengan el id en la lista
    List<Clothe> findByIdIn(List<Integer> ids);
}
