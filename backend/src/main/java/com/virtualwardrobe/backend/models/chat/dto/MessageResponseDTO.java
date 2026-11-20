package com.virtualwardrobe.backend.models.chat.dto;

import com.virtualwardrobe.backend.models.chat.message.Message;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageResponseDTO {
    private int id;
    private int conversationId;
    private int senderId;
    private String content;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;

    public static MessageResponseDTO from(Message m) {
        MessageResponseDTO dto = new MessageResponseDTO();
        dto.setId(m.getId());
        dto.setConversationId(m.getConversationId());
        dto.setSenderId(m.getSenderId());
        dto.setContent(m.getContent());
        dto.setSentAt(m.getSentAt());
        dto.setReadAt(m.getReadAt());
        return dto;
    }
}
