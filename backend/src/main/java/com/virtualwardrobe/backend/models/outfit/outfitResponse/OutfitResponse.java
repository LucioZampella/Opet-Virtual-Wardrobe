package com.virtualwardrobe.backend.models.outfit.outfitResponse;

import com.virtualwardrobe.backend.models.clothe.Clothe;
import com.virtualwardrobe.backend.models.user.User;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter

public class OutfitResponse {
    String name;
    User user;
    List<Clothe> clothes;
}
