package com.virtualwardrobe.backend.models.clothe.clotheDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter  // solo getters
@Setter

public class ClotheDTO {
    @NotBlank(message = "El nombre no puede estar vacío")
    private String name;

    @NotBlank(message = "Debe ingresar un tipo")
    private int typeId;

    @NotBlank(message = "El material  no puede estar vacío")
    private int materialId;

    @NotBlank(message = "El talle  no puede estar vacío")
    private int sizeId;

    @NotBlank(message="El fit no puede estar vacio")
    private int fitId;
    @NotBlank(message="Debe tener una foto ")
    private String image_url;
}
