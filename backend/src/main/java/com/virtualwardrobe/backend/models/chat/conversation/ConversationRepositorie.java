package com.virtualwardrobe.backend.models.chat.conversation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepositorie extends JpaRepository<Conversation, Integer> {

    Optional<Conversation> findByListingIdAndBuyerId(int listingId, int buyerId);

    // Todas las conversaciones donde participa el usuario, la más reciente primero.
    @Query("SELECT c FROM Conversation c " +
            "WHERE c.buyerId = :userId OR c.sellerId = :userId " +
            "ORDER BY COALESCE(c.lastMessageAt, c.createdAt) DESC")
    List<Conversation> findAllByParticipant(@Param("userId") int userId);
}
