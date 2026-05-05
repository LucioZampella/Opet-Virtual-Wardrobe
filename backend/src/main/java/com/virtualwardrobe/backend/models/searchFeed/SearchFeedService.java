package com.virtualwardrobe.backend.models.searchFeed;

import com.virtualwardrobe.backend.models.post.PostCrud.Post;
import com.virtualwardrobe.backend.models.post.PostCrud.PostRepositorie;
import com.virtualwardrobe.backend.models.post.PostDTO.PostResponseDTO;
import com.virtualwardrobe.backend.models.preferences.PreferencesService;
import com.virtualwardrobe.backend.models.preferences.UserPreferences;
import com.virtualwardrobe.backend.models.clothe.Clothe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class SearchFeedService {

    @Autowired
    private PostRepositorie postRepo;

    @Autowired
    private PreferencesService preferencesService;

    public Page<PostResponseDTO> generarFeed(Integer userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaCreacion").descending());
        Page<Post> postPage = postRepo.findAll(pageable); //--> Dado un size, cargamos simplente
        // los n post que van a estar antes de que se tenga que recargar otra vez scrolleando

        List<PostResponseDTO> dtos = postPage.getContent().stream()
                .map(post -> {
                    double score = calcularScore(post, preferencesService.obtenerTodas(userId));
                    return convertToDto(post, score);
                })
                .sorted(Comparator.comparingDouble(PostResponseDTO::getScore).reversed())
                .toList();

        return new PageImpl<>(dtos, pageable, postPage.getTotalElements());
    }

    private double calcularScore(Post post, List<UserPreferences> prefs) {
        double totalScore = 0.0;
        
        if (post.getOutfit() != null) { //--> Si es un outfit
            for (Clothe prenda : post.getOutfit().getClothes()) {
                totalScore += evaluarPrenda(prenda, prefs);
            }
        }
        
        else if (post.getClothe() != null) { //--> Si es una clothe
            totalScore += evaluarPrenda(post.getClothe(), prefs);
        }

        return totalScore;
    }

    private double evaluarPrenda(Clothe prenda, List<UserPreferences> prefs) {
        double points = 0;

        for (UserPreferences pref : prefs) {
            boolean coincidence = false;
            double weight = 0.0;

            switch (pref.getAttributeType()) {
                case TYPES -> {
                    coincidence = prenda.getTypeId() == (pref.getAttributeId());
                    weight = 5.0;
                }

                case FITS -> {
                    coincidence = prenda.getFitId() == pref.getAttributeId();
                    weight = 2.0;
                }

                case COLORS -> {
                    coincidence = prenda.getColorIds().stream().anyMatch(c -> c.getId() == pref.getAttributeId());
                    weight = 1.5;
                }

                case SIZES -> {
                    coincidence = prenda.getSizeId() == pref.getAttributeId();
                    weight = 1.0;
                }

                case MATERIALS -> {
                    coincidence = prenda.getMaterialId() == pref.getAttributeId();
                    weight = 0.5;
                }

            }

            if (coincidence) {
                points += (pref.getScore() * weight);
            }
        }
        return points;
    }

    private PostResponseDTO convertToDto(Post post, double score) {
        PostResponseDTO dto = new PostResponseDTO();

        dto.setId(post.getId());
        dto.setCaption(post.getDescripcion());
        dto.setScore(score);

        if (post.getOutfit() != null) {
            dto.setType("OUTFIT");
            dto.setContent(post.getOutfit());
        } else if (post.getClothe() != null) {
            dto.setType("CLOTHES");
            dto.setContent(post.getClothe());
        }

        return dto;
    }
}