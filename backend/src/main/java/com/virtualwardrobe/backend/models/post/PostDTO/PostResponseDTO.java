package com.virtualwardrobe.backend.models.post.PostDTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class PostResponseDTO {
    private int id;
    private String caption;
    private String type;
    private String image_url;
    private String title;
    private String username;
    private double score;
}
