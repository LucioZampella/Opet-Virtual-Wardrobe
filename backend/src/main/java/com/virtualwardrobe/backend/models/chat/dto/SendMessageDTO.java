package com.virtualwardrobe.backend.models.chat.dto;

import com.virtualwardrobe.backend.models.chat.message.Message;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SendMessageDTO {
    @NotBlank(message = "Error 400: El mensaje no puede estar vacío")
    @Size(max = Message.MAX_CONTENT_LENGTH, message = "Error 400: El mensaje no puede superar los 1000 caracteres")
    private String content;
}
