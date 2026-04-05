package com.virtualwardrobe.backend.models.clothe;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClotheRepositorie extends JpaRepository<Clothe, Integer> {
    Optional<Clothe> findById(int id);
    List<Clothe> findByUserId(int userId);
}
