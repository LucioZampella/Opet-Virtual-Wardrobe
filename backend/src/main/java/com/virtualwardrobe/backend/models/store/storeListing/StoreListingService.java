package com.virtualwardrobe.backend.models.store.storeListing;


import com.virtualwardrobe.backend.models.clothe.Clothe;
import com.virtualwardrobe.backend.models.store.storeListing.storeListingDTO.ListingResponseDTO;
import com.virtualwardrobe.backend.models.store.storeListing.storeListingDTO.StoreListingDTO;
import com.virtualwardrobe.backend.models.store.storeListing.storeListingDTO.UpdateListingDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StoreListingService {

    @Autowired
    private StoreListingRepositorie repo;

    public void crear(StoreListingDTO dto, int sellerId) {
        StoreListing ls = new StoreListing();

        ls.setSellerId(sellerId);
        ls.setClothesId(dto.getClothesId());
        ls.setPrice(dto.getPrice());
        ls.setDescription(dto.getDescription());
        ls.setStatus(StoreStatus.ACTIVE);
        ls.setDate(LocalDate.now());
        repo.save(ls);
    }

    public void modificar(int listingId, UpdateListingDTO dto, int sellerId) {
        StoreListing ls = repo.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Error 404: Publicación no encontrada"));

        if (ls.getSellerId() != sellerId) {
            throw new RuntimeException("Error 401: No tenés permiso para editar esta publicación");
        }

        ls.setPrice(dto.getPrice());
        ls.setStatus(dto.getStatus());
        ls.setDescription(dto.getDescription());
        repo.save(ls);
    }

    public void eliminar(int listingId, int sellerId) {
        StoreListing ls = repo.findByListingId(listingId)
                .orElseThrow(() -> new RuntimeException("Error 404: Publicación no encontrada"));

        if (ls.getSellerId() != sellerId) {
            throw new RuntimeException("Error 401: No tenés permiso para eliminar esta publicación");
        }
        repo.deleteById(listingId);
    }

    public ListingResponseDTO buscarPorId(int listingId) {
        StoreListing ls = repo.findByListingId(listingId)
                .orElseThrow(() -> new RuntimeException("Error 404: Publicación no encontrada"));

        ListingResponseDTO dto = new ListingResponseDTO();
        dto.setListingId(ls.getListingId());
        dto.setSellerId(ls.getSellerId());
        dto.setClothesId(ls.getClothesId());
        dto.setPrice(ls.getPrice());
        dto.setDescription(ls.getDescription());
        dto.setStatus(ls.getStatus());
        dto.setDate(ls.getDate());
        return dto;
    }

    public List<StoreListing> listarTodas() {
        return repo.findAllByOrderByDateDesc();
    }

    public List<StoreListing> listarPorUserId(int sellerId) {
        return repo.findBySellerId(sellerId);
    }

    public List<StoreListing> filtrar(double min, double max, Integer typeId, Integer sizeId, Integer materialId,
                                      Integer fitId, List<Long> colorIds, String name) {
        return repo.filterByAll(min, max, typeId, sizeId, materialId, fitId, colorIds, name);
    }
}
