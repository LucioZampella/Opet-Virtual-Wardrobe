package com.virtualwardrobe.backend.models.user.userDTO;

import lombok.Getter;
import lombok.Setter;

@Getter  // solo getters
@Setter

public class UserDTO {
    private String username;
    private String email;
    private String password;
    private String name;
    private String lastName;
    private Double latitude;
    private Double longitude;

}
