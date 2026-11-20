package com.virtualwardrobe.backend.models.chat.message;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.virtualwardrobe.backend.models.chat.conversation.Conversation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Un mensaje dentro de una conversación. read_at queda en null hasta que el receptor lo lee.
@Entity
@Table(
        name = "message",
        indexes = @Index(name = "idx_message_conversation_sent", columnList = "conversation_id, sent_at")
)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {

    public static final int MAX_CONTENT_LENGTH = 1000;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private int id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", insertable = false, updatable = false)
    private Conversation conversation;

    @Column(name = "conversation_id", nullable = false)
    private int conversationId;

    @Column(name = "sender_id", nullable = false)
    private int senderId;

    @Column(name = "content", nullable = false, length = MAX_CONTENT_LENGTH)
    private String content;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;
}
