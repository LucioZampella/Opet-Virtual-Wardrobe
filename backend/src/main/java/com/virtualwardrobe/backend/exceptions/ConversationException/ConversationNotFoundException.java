package com.virtualwardrobe.backend.exceptions.ConversationException;

public class ConversationNotFoundException extends RuntimeException {
    public ConversationNotFoundException(String message) {
        super(message);
    }
}
