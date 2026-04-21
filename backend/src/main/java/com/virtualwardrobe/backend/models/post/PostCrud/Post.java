package com.virtualwardrobe.backend.models.post.PostCrud;

import com.virtualwardrobe.backend.models.outfit.outfitCRUD.Outfit;
import com.virtualwardrobe.backend.models.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "posts")
public class Post {

    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 500)
    private String descripcion;

    @Column(name = "date_of_post")
    private LocalDate fechaCreacion;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @ManyToOne
    @JoinColumn(name = "outfit_id", nullable = false)
    private Outfit outfit;


}