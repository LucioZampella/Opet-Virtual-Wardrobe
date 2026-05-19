package com.virtualwardrobe.backend.models.clothe.clotheDTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter

public class ClotheResponseDTO {
    int id;
    String image_url;

    public ClotheResponseDTO(int id, String image_url) {
    }
}
