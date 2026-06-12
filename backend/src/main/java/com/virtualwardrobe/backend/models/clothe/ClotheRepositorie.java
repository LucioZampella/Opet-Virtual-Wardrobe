package com.virtualwardrobe.backend.models.clothe;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.type.ClothesType;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.size.ClothesSize;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.material.ClothesMaterial;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.fit.ClothesFit;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClotheRepositorie extends JpaRepository<Clothe, Long> {

    Optional<Clothe> findById(int id);

    @Query("SELECT DISTINCT c FROM Clothe c LEFT JOIN FETCH c.colorIds WHERE c.user.id = :userId")
    List<Clothe> findByUserId(int userId);
    // devuelve todas las prendas que tengan el id en la lista
    List<Clothe> findByIdIn(List<Integer> ids);

    @Query("SELECT t.name, COUNT(c) FROM Clothe c, ClothesType t WHERE c.typeId = t.id AND c.user.id = :userId GROUP BY t.name ORDER BY COUNT(c) DESC")
    List<Object[]> countByType(@Param("userId") int userId);

    @Query("SELECT s.name, COUNT(c) FROM Clothe c, ClothesSize s WHERE c.sizeId = s.id AND c.user.id = :userId GROUP BY s.name ORDER BY COUNT(c) DESC")
    List<Object[]> countBySize(@Param("userId") int userId);

    @Query("SELECT m.name, COUNT(c) FROM Clothe c, ClothesMaterial m WHERE c.materialId = m.id AND c.user.id = :userId GROUP BY m.name ORDER BY COUNT(c) DESC")
    List<Object[]> countByMaterial(@Param("userId") int userId);

    @Query("SELECT f.name, COUNT(c) FROM Clothe c, ClothesFit f WHERE c.fitId = f.id AND c.user.id = :userId GROUP BY f.name ORDER BY COUNT(c) DESC")
    List<Object[]> countByFit(@Param("userId") int userId);

    @Query("SELECT col.name, COUNT(c) FROM Clothe c JOIN c.colorIds col WHERE c.user.id = :userId GROUP BY col.name ORDER BY COUNT(c) DESC")
    List<Object[]> countByColor(@Param("userId") int userId);

    @Query("SELECT AVG(c.preferenceLevel) FROM Clothe c WHERE c.user.id = :userId")
    Double avgPreferenceLevel(@Param("userId") int userId);

    // Total de prendas
    long countByUserId(int userId);
}
