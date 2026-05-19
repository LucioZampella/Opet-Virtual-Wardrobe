package com.virtualwardrobe.backend.models.notification.CRUD;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private int id;


    @Column(name = "user_id")
    private int user_id;


    @Column(name = "actor_id")
    private int actor_id;

    @Column(name= "type")
    private String type;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(name="already_read")
    private boolean already_read;
    @Column(name= "date")
    private LocalDateTime date;
}


