package com.virtualwardrobe.backend.models.notification.CRUD;

import com.virtualwardrobe.backend.models.clothe.Clothe;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepositorie extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.user_id = :userId")
    List<Notification> findByUserId(int userId);
    Optional<Notification> findById(int id);

    @Query("SELECT n FROM Notification n WHERE n.already_read = :alreadyRead AND n.user_id = :userId")
    List<Notification> findByAlreadyReadAndUserId(
            @Param("alreadyRead") boolean alreadyRead,
            @Param("userId") int userId
    );
    @Transactional
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.actor_id = :actorId AND n.user_id = :userId AND n.type = :type")
    void deleteByActorIdAndUserIdAndType(@Param("actorId") int actorId, @Param("userId") int userId, @Param("type") String type);
}
