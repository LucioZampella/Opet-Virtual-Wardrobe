package com.virtualwardrobe.backend.exceptions.ConversationException;

// Se lanza cuando alguien que no es comprador ni vendedor intenta acceder a una conversación.
public class ConversationAccessDeniedException extends RuntimeException {
    public ConversationAccessDeniedException(String message) {
        super(message);
    }
}
