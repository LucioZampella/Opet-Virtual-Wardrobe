package com.virtualwardrobe.backend.models.post.PostDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Data
@Setter
@Getter

public class PostDTO {
    @NotBlank(message = "La descripción no puede estar vacía")
    private String descripcion;

    @NotNull(message = "Debes seleccionar un outfit")
    private Integer outfitId;

}