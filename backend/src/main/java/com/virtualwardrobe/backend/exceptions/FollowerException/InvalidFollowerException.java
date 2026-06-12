package com.virtualwardrobe.backend.exceptions.FollowerException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidFollowerException extends RuntimeException{
    public InvalidFollowerException(String message) {
        super(message);
    }
}
