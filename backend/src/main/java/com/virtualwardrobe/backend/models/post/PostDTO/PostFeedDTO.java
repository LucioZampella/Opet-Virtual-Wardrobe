package com.virtualwardrobe.backend.models.post.PostDTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Setter
@Getter
public class PostFeedDTO {
    private String descripcion;
    private Integer clothesId;
    private Integer outfitId;
    private LocalDate fechaCreacion;
    private Integer score;
}
