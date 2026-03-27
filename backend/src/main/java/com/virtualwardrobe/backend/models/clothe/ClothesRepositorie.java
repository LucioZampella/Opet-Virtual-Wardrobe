package com.virtualwardrobe.backend.models.clothe;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClothesRepositorie extends JpaRepository<Clothes, Integer> {

    Optional<Clothes> findByClotheId(String clotheId);
    Optional<Clothes> findByClotheName(String clotheName);
    Optional<Clothes> findByClotheSize(int clothesize);
    Optional<Clothes> findByClotheType(String clothetype);
    Optional<Clothes> findByClotheMaterial(String material);
    Optional<Clothes> findByClotheFit(String fit);
}
