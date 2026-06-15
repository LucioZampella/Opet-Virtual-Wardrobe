package com.virtualwardrobe.backend.models.post.PostCrud;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PostRepositorie extends JpaRepository<Post, Long> {
    List<Post> findByUserId(int user_id);
    Optional<Post> findById(int id );
    Page<Post> findAll(Pageable pageable);
    List<Post> findAllByOrderByFechaCreacionDesc();

    @Query("SELECT p FROM Post p WHERE p.clothe IS NOT NULL " +
            "AND (:name IS NULL OR LOWER(p.clothe.name) LIKE LOWER(CONCAT('%', CAST(:name AS string), '%')) OR LOWER(p.descripcion) LIKE LOWER(CONCAT('%', CAST(:name AS string), '%'))) " +
            "AND (:typeId IS NULL OR p.clothe.typeId = :typeId) " +
            "AND (:sizeId IS NULL OR p.clothe.sizeId = :sizeId) " +
            "AND (:materialId IS NULL OR p.clothe.materialId = :materialId) " +
            "AND (:fitId IS NULL OR p.clothe.fitId = :fitId) " +
            "AND (:colorIds IS NULL OR EXISTS " +
            "(SELECT 1 FROM Color col WHERE col.id IN :colorIds AND col MEMBER OF p.clothe.colorIds))")
    Page<Post> findFilteredClothes(
            @Param("name") String name,
            @Param("typeId") Integer typeId,
            @Param("sizeId") Integer sizeId,
            @Param("materialId") Integer materialId,
            @Param("fitId") Integer fitId,
            @Param("colorIds") List<Long> colorIds,
            Pageable pageable);

        @Query("SELECT DISTINCT p FROM Post p JOIN p.outfit o JOIN o.clothes c " +
                "WHERE (:name IS NULL OR LOWER(o.name) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :name, '%'))) " +
                "AND (:materialId IS NULL OR c.materialId = :materialId) " +
                "AND (:fitId IS NULL OR c.fitId = :fitId) " +
                "AND (:colorIds IS NULL OR EXISTS " +
                "(SELECT 1 FROM Color col WHERE col.id IN :colorIds AND col MEMBER OF c.colorIds))")
        Page<Post> findFilteredOutfits(
                @Param("name") String name,
                @Param("materialId") Integer materialId,
                @Param("fitId") Integer fitId,
                @Param("colorIds") List<Long> colorIds,
                Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.user.id IN :amigoIds")
    Page<Post> findByUserIdIn(List<Integer> amigoIds, Pageable pageable);

    @Query(value = """
    SELECT DISTINCT p.id, p.user_id, p.descripcion, p.date_of_post, p.clothe_id, p.outfit_id
    FROM posts p
    JOIN clothes c ON c.clothes_id = p.clothe_id
    WHERE p.clothe_id IS NOT NULL
    AND (:name IS NULL OR LOWER(c.name) LIKE LOWER('%' || CAST(:name AS text) || '%') OR LOWER(p.descripcion) LIKE LOWER('%' || CAST(:name AS text) || '%'))
    AND (:typeId IS NULL OR c.type_id = :typeId)
    AND (:sizeId IS NULL OR c.size_id = :sizeId)
    AND (:materialId IS NULL OR c.material_id = :materialId)
    AND (:fitId IS NULL OR c.fit_id = :fitId)
    AND (-1 = ANY(CAST(ARRAY[:colorIds] AS bigint[])) OR EXISTS (SELECT 1 FROM clothe_colours cc WHERE cc.clothes_id = c.clothes_id AND cc.colour_id IN (:colorIds)))
    UNION
    SELECT DISTINCT p.id, p.user_id, p.descripcion, p.date_of_post, p.clothe_id, p.outfit_id
    FROM posts p
    JOIN outfit o ON o.outfit_id = p.outfit_id
    JOIN outfit_items oi ON oi.outfit_id = o.outfit_id
    JOIN clothes c ON c.clothes_id = oi.clothes_id
    WHERE p.outfit_id IS NOT NULL
    AND (:name IS NULL OR LOWER(o.name) LIKE LOWER('%' || CAST(:name AS text) || '%') OR LOWER(p.descripcion) LIKE LOWER('%' || CAST(:name AS text) || '%'))
    AND (:materialId IS NULL OR c.material_id = :materialId)
    AND (:fitId IS NULL OR c.fit_id = :fitId)
    AND (-1 = ANY(CAST(ARRAY[:colorIds] AS bigint[])) OR EXISTS (SELECT 1 FROM clothe_colours cc WHERE cc.clothes_id = c.clothes_id AND cc.colour_id IN (:colorIds)))
    ORDER BY date_of_post DESC
    """,
            countQuery = """
    SELECT COUNT(*) FROM (
        SELECT DISTINCT p.id FROM posts p JOIN clothes c ON c.clothes_id = p.clothe_id
        WHERE p.clothe_id IS NOT NULL
        AND (:name IS NULL OR LOWER(c.name) LIKE LOWER('%' || CAST(:name AS text) || '%') OR LOWER(p.descripcion) LIKE LOWER('%' || CAST(:name AS text) || '%'))
        AND (:typeId IS NULL OR c.type_id = :typeId)
        AND (:sizeId IS NULL OR c.size_id = :sizeId)
        AND (:materialId IS NULL OR c.material_id = :materialId)
        AND (:fitId IS NULL OR c.fit_id = :fitId)
        AND (-1 = ANY(CAST(ARRAY[:colorIds] AS bigint[])) OR EXISTS (SELECT 1 FROM clothe_colours cc WHERE cc.clothes_id = c.clothes_id AND cc.colour_id IN (:colorIds)))
        UNION
        SELECT DISTINCT p.id FROM posts p JOIN outfit o ON o.outfit_id = p.outfit_id
        JOIN outfit_items oi ON oi.outfit_id = o.outfit_id JOIN clothes c ON c.clothes_id = oi.clothes_id
        WHERE p.outfit_id IS NOT NULL
        AND (:name IS NULL OR LOWER(o.name) LIKE LOWER('%' || CAST(:name AS text) || '%') OR LOWER(p.descripcion) LIKE LOWER('%' || CAST(:name AS text) || '%'))
        AND (:materialId IS NULL OR c.material_id = :materialId)
        AND (:fitId IS NULL OR c.fit_id = :fitId)
        AND (-1 = ANY(CAST(ARRAY[:colorIds] AS bigint[])) OR EXISTS (SELECT 1 FROM clothe_colours cc WHERE cc.clothes_id = c.clothes_id AND cc.colour_id IN (:colorIds)))
    ) total
    """,
            nativeQuery = true)
    Page<Post> findFiltered(
            @Param("name") String name,
            @Param("typeId") Integer typeId,
            @Param("sizeId") Integer sizeId,
            @Param("materialId") Integer materialId,
            @Param("fitId") Integer fitId,
            @Param("colorIds") List<Long> colorIds,
            Pageable pageable);
}
