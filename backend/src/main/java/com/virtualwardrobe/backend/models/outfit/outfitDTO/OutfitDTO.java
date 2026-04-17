package com.virtualwardrobe.backend.models.outfit.outfitDTO;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OutfitDTO {
    private String name;
    private List<Integer> clothesIds;
}
