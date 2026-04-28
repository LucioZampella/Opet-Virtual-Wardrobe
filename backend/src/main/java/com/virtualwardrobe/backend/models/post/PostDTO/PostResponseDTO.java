package com.virtualwardrobe.backend.models.post.PostDTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
// El DTO que devuelves al Frontend (para el Feed)
public class PostResponseDTO {
    private int id;
    private String caption;
    private String type; // "CLOTHES" o "OUTFIT"
    private Object content; // Aquí irá el detalle de la prenda o el outfit

    // Getters y Setters
}
