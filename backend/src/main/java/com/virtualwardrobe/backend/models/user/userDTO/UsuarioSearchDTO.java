package com.virtualwardrobe.backend.models.user.userDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioSearchDTO {
    private Integer id;
    private String username;
    private String name;
    private String avatar_url;
}