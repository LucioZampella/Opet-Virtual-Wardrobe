package com.virtualwardrobe.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    private int post_id;
    private int user_id;
    private int content_id;
    private String bio;
    private String text;
    private String image_url;
    private Date post_date;
}
