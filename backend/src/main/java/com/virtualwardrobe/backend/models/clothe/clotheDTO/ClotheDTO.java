package com.virtualwardrobe.backend.models.clothe.clotheDTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

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

    @NotNull(message = "El color no puede estar vacío")
    @Min(1)
    private Integer colorId;

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