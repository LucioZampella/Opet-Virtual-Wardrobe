package com.virtualwardrobe.backend.models.user.userDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserDTO {
    private String name;
    private String lastName;
    private String bio;
    private String avatar_url;
    // sin password, email, latitude, longitude, username
}