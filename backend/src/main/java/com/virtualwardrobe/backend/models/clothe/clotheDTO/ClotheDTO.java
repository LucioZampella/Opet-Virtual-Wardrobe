package com.virtualwardrobe.backend.models.clothe.clotheDTO;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ClotheDTO {
    @Min(value = 1, message = "El nombre no puede ser vacio")
    @Max(value = 50, message = "El nombre no puede superar los 100 caracteres ")
    private String name;

    @NotNull(message = "Debe ingresar un tipo")
    @Min(value = 1, message = "Debe ingresar un tipo")
    private Integer typeId;

    @NotNull(message = "El material no puede estar vacío")
    @Min(value = 1, message = "Debe ingresar un material")
    private Integer materialId;

    @NotEmpty(message = "Debe elegir por lo menos  un color ")
    private List<Long> colorIds;

    @NotNull(message = "El talle no puede estar vacío")
    @Min(value = 1, message = "Debe ingresar un talle")
    private Integer sizeId;

    @NotNull(message = "El fit no puede estar vacío")
    @Min(value = 1, message = "Debe ingresar un fit")
    private Integer fitId;

    @NotBlank(message = "Debe tener una foto")
    private String image_url;

    @Min(value = 1, message = "El nivel de preferencia debe ser al menos 1")
    @Max(value = 100, message = "El nivel de preferencia no puede superar 100")
    private int preferenceLevel;
}