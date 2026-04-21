package com.virtualwardrobe.backend.models.post.PostCrud;

import com.virtualwardrobe.backend.exceptions.InvalidOutfitException;
import com.virtualwardrobe.backend.exceptions.InvalidPostException;
import com.virtualwardrobe.backend.exceptions.UnauthorizedActionException;
import com.virtualwardrobe.backend.models.outfit.outfitCRUD.Outfit;
import com.virtualwardrobe.backend.models.outfit.outfitCRUD.OutfitRepositorie;
import com.virtualwardrobe.backend.models.post.PostDTO.PostDTO;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepositorie postRepositorie;

    @Autowired
    private OutfitRepositorie outfitRepository;

    @Autowired
    private UserRepositorie userRepository;

    // 1. CREAR
    public void crear(PostDTO dto, int userId) {
        // Validamos que el outfit exista
        Outfit outfit = outfitRepository.findById(dto.getOutfitId())
                .orElseThrow(() -> new InvalidOutfitException("Outfit no encontrado"));

        // Validamos que el outfit sea del usuario )
        if (outfit.getUser().getId() != userId) {
            throw new UnauthorizedActionException("No tienes permiso para publicar este outfit");
        }

        Post pub = new Post();
        pub.setFechaCreacion(LocalDate.now());
        pub.setDescripcion(dto.getDescripcion());
        pub.setUser(userRepository.getReferenceById(userId));
        pub.setOutfit(outfit);

        postRepositorie.save(pub);
    }

    // agarramo todos los posts
    public List<Post> obtenerTodas() {
        return postRepositorie.findAllByOrderByFechaCreacionDesc();
    }

    // agarrmo todos los posts de un usuario
    public List<Post> obtenerPorUsuario(int userId) {
        return postRepositorie.findByUserId(userId);
    }

    //4  acuatalizamo la descripcion
    public void modificar(int id, String nuevaDescripcion, int userId) {
        Post pub = postRepositorie.findById(id)
                .orElseThrow(() -> new InvalidPostException("Publicación no encontrada"));

        if (pub.getUser().getId() != userId) {
            throw new UnauthorizedActionException("No eres el dueño de esta publicación");
        }

        pub.setDescripcion(nuevaDescripcion);
        postRepositorie.save(pub);
    }

    // elikmino una publicacion
    public void eliminar(Integer id, int userId) {
        Post pub = postRepositorie.findById(id)
                .orElseThrow(() -> new InvalidPostException("Publicación no encontrada"));

        if (pub.getUser().getId() != userId) {
            throw new UnauthorizedActionException("No puedes eliminar una publicación ajena");
        }

        postRepositorie.delete(pub);
    }
}