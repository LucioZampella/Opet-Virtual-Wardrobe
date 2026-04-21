package com.virtualwardrobe.backend.models.outfit.outfitCRUD;

import com.virtualwardrobe.backend.exceptions.InvalidOutfitException;
import com.virtualwardrobe.backend.exceptions.InvalidStoreException;
import com.virtualwardrobe.backend.exceptions.UnauthorizedActionException;
import com.virtualwardrobe.backend.models.clothe.Clothe;
import com.virtualwardrobe.backend.models.clothe.ClotheRepositorie;
import com.virtualwardrobe.backend.models.outfit.outfitDTO.OutfitDTO;
import com.virtualwardrobe.backend.models.outfit.outfitResponse.OutfitResponse;
import com.virtualwardrobe.backend.models.post.PostCrud.PostRepositorie;
import com.virtualwardrobe.backend.models.store.storeListing.StoreListingRepositorie;
import com.virtualwardrobe.backend.models.user.User;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OutfitService {

    @Autowired
    private OutfitRepositorie repo;

    @Autowired
    private UserRepositorie UserRepo;

    @Autowired
    private ClotheRepositorie clotheRepo;

    @Autowired
    private PostRepositorie PostRepo;


    public void crear(OutfitDTO dto, int id) throws InvalidOutfitException {

        Outfit newOutfit = new Outfit();
        User user = UserRepo.findById(id).get();

        List<Clothe> prendasDelOutfit = clotheRepo.findByIdIn(dto.getClothesIds());
        if (prendasDelOutfit.isEmpty()) {
            throw new InvalidOutfitException("La lista de prendas no puede estar vacía");
        }

        // Calcula el promedio de preference_level de las prendas
        int promedio = (int) prendasDelOutfit.stream()
                .mapToInt(Clothe::getPreferenceLevel)
                .average()
                .orElse(50);

        newOutfit.setName(dto.getName());
        newOutfit.setUser(user);
        newOutfit.setClothes(prendasDelOutfit);
        newOutfit.setLevel_of_coincidence(promedio);  // <-- agregás esto
        repo.save(newOutfit);
    }

    public void modificar(OutfitDTO dto, int id, int userId) throws UnauthorizedActionException, InvalidOutfitException {

        Outfit oldOutfit = repo.findById(id).
                orElseThrow(() -> new InvalidOutfitException("no hay ningun outfit con ese id"));

        if (oldOutfit.getUser().getId() != userId) {
            throw new UnauthorizedActionException("No tienes permiso para editar esta prenda.");
        }

        List<Clothe> prendasDelOutfit =clotheRepo.findByIdIn(dto.getClothesIds());

        if(prendasDelOutfit.isEmpty()) {
            throw new InvalidOutfitException("La lista de prendas no puede estar vacía");
        }
        int promedio = (int) prendasDelOutfit.stream()
                .mapToInt(Clothe::getPreferenceLevel)
                .average()
                .orElse(50);

        oldOutfit.setName(dto.getName());
        oldOutfit.setLevel_of_coincidence(promedio);
        oldOutfit.setClothes(prendasDelOutfit);
        repo.save(oldOutfit);

        }

        public void eliminar(int id, int userId) throws UnauthorizedActionException, InvalidOutfitException {

            Outfit oldOutfit = repo.findById(id).
                    orElseThrow(() -> new InvalidOutfitException("no hay ningun outfit con ese id"));

            if (oldOutfit.getUser().getId() != userId) {
                throw new UnauthorizedActionException("No tienes permiso para editar esta prenda.");
            }

            // Verificar si está en algún outfit
            boolean enTienda = PostRepo.findAll().stream()
                    .anyMatch(s -> s.getId() == id);
            if (enTienda) {
                throw new InvalidStoreException("No podés eliminar esta outfit porque tiene una publicación activa en el perfil. Eliminála primero.");
            }

            repo.delete(oldOutfit);

        }

    public OutfitResponse buscarPorId(int id ) throws InvalidOutfitException{
        Outfit oldOutfit = repo.findById(id).
                orElseThrow(() -> new InvalidOutfitException("no hay ningun outfit con ese id"));

        OutfitResponse outfitResponse = new OutfitResponse();
        outfitResponse.setClothes(oldOutfit.getClothes());
        outfitResponse.setUser(oldOutfit.getUser());
        outfitResponse.setName(oldOutfit.getName());

        return outfitResponse;
    }

    public List<Outfit> listarPorUserId(int userId) {
        return repo.findByUserId(userId);
    }


    }



