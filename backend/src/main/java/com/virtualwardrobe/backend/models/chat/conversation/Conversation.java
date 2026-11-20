package com.virtualwardrobe.backend.models.chat.conversation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.virtualwardrobe.backend.models.store.storeListing.StoreListing;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Una conversación entre un comprador y el vendedor de una publicación.
// Un comprador tiene un único chat por publicación (restricción única listing_id + buyer_id).
@Entity
@Table(
        name = "conversation",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_conversation_listing_buyer",
                columnNames = {"listing_id", "buyer_id"}
        ),
        indexes = {
                @Index(name = "idx_conversation_buyer", columnList = "buyer_id"),
                @Index(name = "idx_conversation_seller", columnList = "seller_id")
        }
)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conversation_id")
    private int id;

    // Solo lectura: permite mostrar la prenda en el chat sin duplicar datos.
    // @JsonIgnore evita serializar el proxy lazy; la prenda se expone desde un DTO.
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", insertable = false, updatable = false)
    private StoreListing listing;

    @Column(name = "listing_id", nullable = false)
    private int listingId;

    @Column(name = "buyer_id", nullable = false)
    private int buyerId;

    @Column(name = "seller_id", nullable = false)
    private int sellerId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Se actualiza con cada mensaje para ordenar la bandeja de entrada.
    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    public boolean isParticipant(int userId) {
        return userId == buyerId || userId == sellerId;
    }

    public int getOtherParticipant(int userId) {
        return userId == buyerId ? sellerId : buyerId;
    }
}
