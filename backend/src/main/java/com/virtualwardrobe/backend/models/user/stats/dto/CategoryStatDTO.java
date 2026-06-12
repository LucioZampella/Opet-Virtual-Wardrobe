package com.virtualwardrobe.backend.models.user.stats.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryStatDTO {
    private String label;
    private long count;
    private double percentage;
}
