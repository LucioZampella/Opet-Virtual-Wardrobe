package com.virtualwardrobe.backend.models.user.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private int id;
    private String name;
    private String lastName;
    private String username;
    private String bio;
    private String avatar_url;
    // sin password, email, latitude, longitude
}
