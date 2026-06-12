package com.virtualwardrobe.backend.models.ia.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroqRecommendationResponse {
    private String recommendation;
    private List<LinkedClothe> clothes;
}
