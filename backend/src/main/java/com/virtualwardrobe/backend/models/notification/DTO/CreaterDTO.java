package com.virtualwardrobe.backend.models.notification.DTO;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CreaterDTO {
    private String description;
    private String type;
    private int user_id; // -> id del  user que va a recibir la notificaicon no del que la esta creando esa se la pasas
    // -> en la funcion de create
}
