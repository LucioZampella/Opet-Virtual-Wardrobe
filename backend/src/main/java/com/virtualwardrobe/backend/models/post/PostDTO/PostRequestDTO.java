package com.virtualwardrobe.backend.models.post.PostDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Data
@Setter
@Getter

public class PostRequestDTO {
    private String descripcion;
    private Integer clothesId; // Opcional
    private Integer outfitId;  // Opcional

    // Getters y Setters
}

