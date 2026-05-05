package com.virtualwardrobe.backend.models.post.PostCrud;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PostRepositorie extends JpaRepository<Post, Long> {
    List<Post> findByUserId(int user_id);
    Optional<Post> findById(int id );
    Page<Post> findAll(Pageable pageable);
    List<Post> findAllByOrderByFechaCreacionDesc();
}
