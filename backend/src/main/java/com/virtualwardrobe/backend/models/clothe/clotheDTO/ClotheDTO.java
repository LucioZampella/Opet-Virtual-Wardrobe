package com.virtualwardrobe.backend.models.clothe.clotheDTO;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ClotheDTO {
    @NotBlank(message = "El nombre no puede estar vacío")
    private String name;

    @NotNull(message = "Debe ingresar un tipo")
    @Min(1)
    private Integer typeId;

    @NotNull(message = "El material no puede estar vacío")
    @Min(1)
    private Integer materialId;

    @NotEmpty(message = "La lista de colores no puede estar vacía")
    private List<Long> colourIds;

    @NotNull(message = "El talle no puede estar vacío")
    @Min(1)
    private Integer sizeId;

    @NotNull(message = "El fit no puede estar vacío")
    @Min(1)
    private Integer fitId;

    @NotBlank(message = "Debe tener una foto")
    private String image_url;

    @Min(value = 1, message = "El nivel de preferencia debe ser al menos 1")
    @Max(value = 100, message = "El nivel de preferencia no puede superar 100")
    private int preferenceLevel;
}