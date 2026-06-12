package com.virtualwardrobe.backend.models.user.stats;

import com.virtualwardrobe.backend.models.clothe.ClotheRepositorie;
import com.virtualwardrobe.backend.models.outfit.outfitCRUD.OutfitRepositorie;
import com.virtualwardrobe.backend.models.user.stats.dto.CategoryStatDTO;
import com.virtualwardrobe.backend.models.user.stats.dto.UserStatsDTO;
import com.virtualwardrobe.backend.models.user.stats.dto.ClotheFrequencyDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserStatsService {

    @Autowired
    private ClotheRepositorie clotheRepo;

    @Autowired
    private OutfitRepositorie outfitRepo;

    public UserStatsDTO getUserStats(int userId) {
        UserStatsDTO userStats = new UserStatsDTO();
        userStats.setUserId(userId);

        userStats.setTotalClothes((int) clotheRepo.countByUserId(userId));
        userStats.setTotalOutfits((int) outfitRepo.countByUserId(userId));

        userStats.setByColor(toStatsList(clotheRepo.countByColor(userId), userStats.getTotalClothes()));
        userStats.setByFit(toStatsList(clotheRepo.countByFit(userId), userStats.getTotalClothes()));
        userStats.setByType(toStatsList(clotheRepo.countByType(userId), userStats.getTotalClothes()));
        userStats.setBySize(toStatsList(clotheRepo.countBySize(userId), userStats.getTotalClothes()));
        userStats.setByMaterial(toStatsList(clotheRepo.countByMaterial(userId), userStats.getTotalClothes()));

        Double avgPref = clotheRepo.avgPreferenceLevel(userId);
        userStats.setAvgPreferenceLevel(avgPref != null ? avgPref : 0.0);

        Pageable top5 = PageRequest.of(0, 5);
        userStats.setTopClothesByOutfitUsage(toClotheFrequencyList(outfitRepo.topClothesByUsage(userId, top5)));

        Double avgCoinc = outfitRepo.avgCoincidenceLevel(userId);
        userStats.setAvgOutfitCoincidenceLevel(avgCoinc != null ? avgCoinc : 0.0);

        return userStats;
    }


    private List<CategoryStatDTO> toStatsList(List<Object[]> raw, int total) {
        return raw.stream()
                .map(row -> {
                    String label = String.valueOf(row[0]);
                    long count = ((Number) row[1]).longValue();
                    double percentage = total > 0 ? (count * 100.0) / total : 0.0;
                    return new CategoryStatDTO(label, count, percentage);
                })
                .toList();
    }

    private List<ClotheFrequencyDTO> toClotheFrequencyList(List<Object[]> raw) {
        return raw.stream()
                .map(row -> new ClotheFrequencyDTO(
                        ((Number) row[0]).intValue(),
                        (String) row[1],
                        (String) row[2],
                        ((Number) row[3]).longValue()
                ))
                .toList();
    }
}
