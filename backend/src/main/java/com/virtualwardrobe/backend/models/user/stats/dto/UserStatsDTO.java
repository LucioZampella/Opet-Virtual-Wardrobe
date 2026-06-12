package com.virtualwardrobe.backend.models.user.stats.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDTO {

    private int userId;
    private int totalClothes;
    private int totalOutfits;

    private List<CategoryStatDTO> byType;
    private List<CategoryStatDTO> bySize;
    private List<CategoryStatDTO> byMaterial;
    private List<CategoryStatDTO> byFit;
    private List<CategoryStatDTO> byColor;


    private double avgPreferenceLevel;
    private List<CategoryStatDTO> byPreferenceRange;

    private List<ClotheFrequencyDTO> topClothesByOutfitUsage;
    private double avgOutfitCoincidenceLevel;
}
