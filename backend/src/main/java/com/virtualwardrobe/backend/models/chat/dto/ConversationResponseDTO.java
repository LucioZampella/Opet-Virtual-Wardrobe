package com.virtualwardrobe.backend.models.chat.dto;

import com.virtualwardrobe.backend.models.store.storeListing.StoreStatus;
import lombok.Data;

import java.time.LocalDateTime;

// Lo que necesita el frontend para mostrar una conversación en la bandeja y en el encabezado del chat.
@Data
public class ConversationResponseDTO {
    private int id;

    // Publicación (puede venir vacía si la publicación fue eliminada)
    private int listingId;
    private String clotheName;
    private String clotheImageUrl;
    private Double price;
    private StoreStatus listingStatus;
    private boolean listingAvailable;

    // Participantes
    private int buyerId;
    private int sellerId;
    private int otherUserId;
    private String otherUsername;
    private String otherAvatarUrl;
    private boolean currentUserIsSeller;

    // Estado
    private MessageResponseDTO lastMessage;
    private long unreadCount;
    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;
}
