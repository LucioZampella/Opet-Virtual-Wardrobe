package com.virtualwardrobe.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidClotheException extends RuntimeException {
    public InvalidClotheException(String message) {
        super(message);
    }
}