package com.virtualwardrobe.backend.models.preferences;

import com.virtualwardrobe.backend.models.clothe.Clothe;
import com.virtualwardrobe.backend.models.clothe.ClotheRepositorie;
import com.virtualwardrobe.backend.models.preferences.auxiliar.AttributeType;
import com.virtualwardrobe.backend.models.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PreferencesService {

    @Autowired
    private PreferencesRepositorie repo;

    @Autowired
    private ClotheRepositorie clotheRepo;

    public void recalcularPreferences(User user) {
        List<Clothe> wardrobe = clotheRepo.findByUserId(user.getId());

        if (wardrobe.isEmpty()) return;

        recalcularPorType(user, wardrobe, AttributeType.TYPES);
        recalcularPorType(user, wardrobe, AttributeType.COLORS);
        recalcularPorType(user, wardrobe, AttributeType.FITS);
        recalcularPorType(user, wardrobe, AttributeType.SIZES);
        recalcularPorType(user, wardrobe, AttributeType.MATERIALS);

    }
    public List<UserPreferences> obtenerTodas(Integer userId) {
        return repo.findByUser_UserId(userId);
    }

    public List<UserPreferences> obtenerPorType(Integer userId, AttributeType type) {
        return repo.findByUser_UserIdAndAttributeType(userId, type);
    }


    public void eliminarTodas(Integer userId) {
        List<UserPreferences> preferences = repo.findByUser_UserId(userId);
        repo.deleteAll(preferences);
    }


    private void recalcularPorType(User user, List<Clothe> wardrobe, AttributeType type) {
        Map<Integer, Integer> scoreMap = new HashMap<>();
        int totalScore = 0;

        for (Clothe clothe : wardrobe) {
            List<Integer> attributeIds = obtenerAttributeId(clothe, type);
            for (Integer attributeId : attributeIds) {
                int coincidence = clothe.getPreferenceLevel();
                scoreMap.merge(attributeId, coincidence, Integer::sum);
                totalScore += coincidence;
            }

            if (totalScore == 0) return;

            int finalTotal = totalScore;
            scoreMap.forEach((attributeId, rawScore) -> {
                int normalizedScore = (rawScore * 100) / finalTotal;
                guardarYOActualizar(user, type, attributeId, normalizedScore);

            });
        }
    }

    private void guardarYOActualizar(User user, AttributeType type, Integer attributeId, Integer score) {

        Optional<UserPreferences> existing = repo.findByUser_UserIdAndAttributeTypeAndAttributeId(
                user.getId(), type, attributeId
        );

        UserPreferences preference;
        if (existing.isPresent()) {
            preference = existing.get();
        } else {
            preference = new UserPreferences();
            preference.setUser(user);
            preference.setAttributeType(type);
            preference.setAttributeId(attributeId);
        }

        preference.setScore(score);
        preference.setUpdatedAt(LocalDateTime.now());
        repo.save(preference);
    }

    public List<Integer> obtenerAttributeId(Clothe clothe, AttributeType type) {
        return switch (type) {
            case TYPES -> List.of(clothe.getTypeId());
            case COLORS -> clothe.getColorIds().stream().map(color -> color.getId()).toList();
            case FITS -> List.of(clothe.getFitId());
            case SIZES -> List.of(clothe.getSizeId());
            case MATERIALS -> List.of(clothe.getMaterialId());
        };
    }
}
