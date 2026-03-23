package com.virtualwardrobe.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Outfit {
    private int outfit_id;
    private int user_id;
    private boolean is_public;
    private int level_of_coicidence;
}
