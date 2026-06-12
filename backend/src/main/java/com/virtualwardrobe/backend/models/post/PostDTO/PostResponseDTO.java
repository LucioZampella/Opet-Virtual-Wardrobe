package com.virtualwardrobe.backend.models.post.PostDTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class PostResponseDTO {
    private int id;
    private int userId;
    private String caption;
    private String type;
    private String avatarUrl;
    private List<String> clothesImages;
    private String image_url;
    private String title;
    private String username;
    private double score;
}
