package com.virtualwardrobe.backend;

//
// es el encargado de dar las excepciones globales y dar el  mensaje de los errores contemplados en el backend
//


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)

    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        String mensaje = e.getMessage();
        if (mensaje.startsWith("Error 404")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mensaje);
        } else if (mensaje.startsWith("Error 409")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(mensaje);
        } else if (mensaje.startsWith("Error 400")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mensaje);
        } else if (mensaje.startsWith("Error 401")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mensaje);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(mensaje);
    }
}

