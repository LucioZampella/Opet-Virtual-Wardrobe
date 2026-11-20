package com.virtualwardrobe.backend.models.chat.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartConversationDTO {
    @NotNull(message = "Error 400: La publicación es obligatoria")
    private Integer listingId;
}
