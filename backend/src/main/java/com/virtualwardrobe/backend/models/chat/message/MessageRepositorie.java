package com.virtualwardrobe.backend.models.chat.message;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepositorie extends JpaRepository<Message, Integer> {

    // Página más reciente del historial (orden descendente, el service la invierte).
    List<Message> findByConversationIdOrderByIdDesc(int conversationId, Pageable pageable);

    // Página anterior a un mensaje dado, para "cargar mensajes más viejos".
    List<Message> findByConversationIdAndIdLessThanOrderByIdDesc(int conversationId, int beforeId, Pageable pageable);

    Optional<Message> findFirstByConversationIdOrderByIdDesc(int conversationId);

    // Mensajes que el usuario todavía no leyó (los que mandó el otro participante).
    @Query("SELECT COUNT(m) FROM Message m " +
            "WHERE m.conversationId = :conversationId AND m.senderId <> :userId AND m.readAt IS NULL")
    long countUnread(@Param("conversationId") int conversationId, @Param("userId") int userId);

    @Modifying
    @Query("UPDATE Message m SET m.readAt = :readAt " +
            "WHERE m.conversationId = :conversationId AND m.senderId <> :userId AND m.readAt IS NULL")
    int markAsRead(@Param("conversationId") int conversationId,
                   @Param("userId") int userId,
                   @Param("readAt") LocalDateTime readAt);
}
