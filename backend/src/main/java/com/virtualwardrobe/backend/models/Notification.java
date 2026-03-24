package com.virtualwardrobe.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    private int notification_id;
    private int user_id;
    private int actor_id;
    private String type;
    private boolean already_read;
    private Date date;
}
