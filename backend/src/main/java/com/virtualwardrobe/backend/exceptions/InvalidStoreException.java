package com.virtualwardrobe.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidStoreException extends RuntimeException {
    public InvalidStoreException(String message) {
        super(message);
    }
}
