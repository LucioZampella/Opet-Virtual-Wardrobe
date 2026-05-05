package com.virtualwardrobe.backend.models.post.PostCrud;

import com.virtualwardrobe.backend.models.clothe.Clothe;
import com.virtualwardrobe.backend.models.outfit.outfitCRUD.Outfit;
import com.virtualwardrobe.backend.models.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 500)
    private String descripcion;

    @Column(name = "date_of_post")
    private LocalDate fechaCreacion;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @ManyToOne
    @JoinColumn (name = "clothe_id", nullable = true)
    private Clothe clothe;

    @ManyToOne
    @JoinColumn(name = "outfit_id", nullable = true)
    private Outfit outfit;

    public boolean isOutfit(){
        return outfit!=null;
    }

}