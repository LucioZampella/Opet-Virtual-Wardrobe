package com.virtualwardrobe.backend.models.user.userDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter  // solo getters
@Setter

public class UserDTO {
    private String username;
    private String email;
    // si no pongo not blank se me genera un hash con una contraseña vacia que no deberia poder pasar
    @NotBlank(message = "Debe ingresar una contraseña")
    private String password;

    private String name;

    private String lastName;

    private Double latitude;

    private Double longitude;
}
