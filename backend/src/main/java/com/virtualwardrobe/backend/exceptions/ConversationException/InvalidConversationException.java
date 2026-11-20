package com.virtualwardrobe.backend.exceptions.ConversationException;

public class InvalidConversationException extends RuntimeException {
    public InvalidConversationException(String message) {
        super(message);
    }
}
