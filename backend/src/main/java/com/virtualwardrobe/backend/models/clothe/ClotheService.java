package com.virtualwardrobe.backend.models.clothe;

import com.virtualwardrobe.backend.models.clothe.clotheDTO.ClotheDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClotheService {

    @Autowired
    private ClotheRepositorie repo;

    public void crear(ClotheDTO dto, int userId) {
        Clothe c = new Clothe();
        c.setUserId(userId);
        c.setName(dto.getName());
        c.setFitId(dto.getFitId());
        c.setImage_url(dto.getImage_url());
        c.setMaterialId(dto.getMaterialId());
        c.setSizeId(dto.getSizeId());
        c.setTypeId(dto.getTypeId());
        c.setColorId(dto.getColorId());
        c.setPreferenceLevel(dto.getPreferenceLevel());
        repo.save(c);
    }

    public void modificar(int id, ClotheDTO dto, int userId) {
        Clothe c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Error 404: prenda no encontrada"));

        if (c.getUserId() != userId) {
            throw new RuntimeException("Error 401: No tenés permiso para editar esta prenda");
        }
        c.setName(dto.getName());
        c.setFitId(dto.getFitId());
        c.setImage_url(dto.getImage_url());
        c.setMaterialId(dto.getMaterialId());
        c.setSizeId(dto.getSizeId());
        c.setTypeId(dto.getTypeId());
        c.setColorId(dto.getColorId());
        c.setPreferenceLevel(dto.getPreferenceLevel());
        repo.save(c);
    }

    public void eliminar(int id, int userId) {
        Clothe c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Error 404: prenda no encontrada"));

        if (c.getUserId() != userId) {
            throw new RuntimeException("Error 401: No tenés permiso para eliminar esta prenda");
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
        dto.setColorId(c.getColorId());
        dto.setPreferenceLevel(dto.getPreferenceLevel());
        return dto;
    }

    public List<Clothe> listarPorUserId(int userId) {
        return repo.findByUserId(userId);
    }


    public List<Clothe> filtrar(int userId, Integer typeId, Integer sizeId,
                                Integer materialId, Integer fitId, Integer colorId, Integer preferenceLevel, String name) {
        return repo.findByUserId(userId).stream()
                .filter(c -> typeId == null || c.getTypeId() == typeId)
                .filter(c -> sizeId == null || c.getSizeId() == sizeId)
                .filter(c -> materialId == null || c.getMaterialId() == materialId)
                .filter(c -> fitId == null || c.getFitId() == fitId)
                .filter(c -> colorId == null || c.getColorId() == colorId)
                .filter(c -> preferenceLevel == null || c.getPreferenceLevel() == preferenceLevel)
                .filter(c -> name == null || c.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }
}