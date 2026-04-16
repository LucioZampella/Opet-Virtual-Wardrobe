package com.virtualwardrobe.backend.models.clothe;

import com.virtualwardrobe.backend.models.clothe.clotheDTO.ClotheDTO;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.color.Color;
import com.virtualwardrobe.backend.models.clothe.clotheDTO.clotheProperties.color.ColorRepository;
import com.virtualwardrobe.backend.models.user.User;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClotheService {

    @Autowired
    private ClotheRepositorie repo;

    @Autowired
    private ColorRepository colorRepository;


    @Autowired
    private UserRepositorie UserRepo;

    public void crear(ClotheDTO dto, int userId) {
        Clothe c = new Clothe();
        User user= UserRepo.findById(userId).get();

        if (dto.getColorIds() != null && !dto.getColorIds().isEmpty()) {
            List<Color> colorIds = colorRepository.findAllById(dto.getColorIds());
            c.setColorIds(colorIds);
        }
        c.setUser(user);
        c.setName(dto.getName());
        c.setFitId(dto.getFitId());
        c.setImage_url(dto.getImage_url());
        c.setMaterialId(dto.getMaterialId());
        c.setSizeId(dto.getSizeId());
        c.setTypeId(dto.getTypeId());
        c.setPreferenceLevel(dto.getPreferenceLevel());
        repo.save(c);
    }

    public void modificar(int id, ClotheDTO dto, int userId) {
        Clothe c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Error 404: prenda no encontrada"));

        if (c.getUser().getId() != userId) {
            throw new RuntimeException("Error 401: No tenés permiso para editar esta prenda");
        }
        if (dto.getColorIds() != null && !dto.getColorIds().isEmpty()) {
            List<Color> colorIds = colorRepository.findAllById(dto.getColorIds());
            c.setColorIds(colorIds);
        }

        c.setName(dto.getName());
        c.setFitId(dto.getFitId());
        c.setImage_url(dto.getImage_url());
        c.setMaterialId(dto.getMaterialId());
        c.setSizeId(dto.getSizeId());
        c.setTypeId(dto.getTypeId());
        c.setPreferenceLevel(dto.getPreferenceLevel());
        repo.save(c);
    }

    public void eliminar(int id, int userId) {
        Clothe c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Error 404: prenda no encontrada"));
        if (c.getUser().getId() != userId) {
            throw new RuntimeException("Error 401: No tenés permiso para editar esta prenda");
        }

        repo.deleteById(id);
    }

    public ClotheDTO buscarPorId(int id) {
        Clothe c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Error 404: prenda no encontrada"));

        ClotheDTO dto = new ClotheDTO();
        dto.setName(c.getName());
        dto.setFitId(c.getFitId());
        dto.setImage_url(c.getImage_url());
        dto.setMaterialId(c.getMaterialId());
        dto.setSizeId(c.getSizeId());
        dto.setTypeId(c.getTypeId());
        List<Color> colors = colorRepository.findAllById(dto.getColorIds());
        c.setColorIds(colors);
        dto.setPreferenceLevel(dto.getPreferenceLevel());
        return dto;
    }

    public List<Clothe> listarPorUserId(int userId) {
        return repo.findByUserId(userId);
    }


    public List<Clothe> filtrar(int userId, Integer typeId, Integer sizeId,
                                Integer materialId, Integer fitId,
                                List<Long> colorIds,
                                Integer preferenceLevel, String name) {

        return repo.findByUserId(userId).stream()
                .filter(c -> typeId == null || c.getTypeId() == typeId)
                .filter(c -> sizeId == null || c.getSizeId() == sizeId)
                .filter(c -> materialId == null || c.getMaterialId() == materialId)
                .filter(c -> fitId == null || c.getFitId() == fitId)
                .filter(c -> preferenceLevel == null || c.getPreferenceLevel() == preferenceLevel)
                .filter(c -> name == null || c.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(c -> colorIds == null || colorIds.isEmpty() ||
                        c.getColorIds().stream()
                                .anyMatch(color -> colorIds.contains(color.getId())))
                .collect(Collectors.toList());
    }
}