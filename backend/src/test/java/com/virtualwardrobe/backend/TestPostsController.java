package com.virtualwardrobe.backend;

import com.virtualwardrobe.backend.models.clothe.Clothe;
import com.virtualwardrobe.backend.models.clothe.ClotheRepositorie;
import com.virtualwardrobe.backend.models.outfit.outfitCRUD.Outfit;
import com.virtualwardrobe.backend.models.outfit.outfitCRUD.OutfitRepositorie;
import com.virtualwardrobe.backend.models.post.PostCrud.Post;
import com.virtualwardrobe.backend.models.post.PostCrud.PostRepositorie;
import com.virtualwardrobe.backend.models.user.User;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/test")
public class TestPostsController {

    @Autowired
    private UserRepositorie userRepo;

    @Autowired
    private PostRepositorie postRepo;

    @Autowired
    private ClotheRepositorie clotheRepo;

    @Autowired
    private OutfitRepositorie outfitRepo;

    private final Random random = new Random();

    private static final List<String> DESCRIPCIONES = List.of(
            "Outfit re contra picado ya sabes gato", "El re outfit", "Uno que sabe como vestirse ee",
            "Papoi"
    );

    @PostMapping("/seed-posts")
    public ResponseEntity<String> seedPosts(
            @RequestParam(defaultValue = "200") int cantidad,
            @RequestParam(defaultValue = "50") int porcentajeOutfits
    ) {
        List<User> users = userRepo.findAll();
        List<Clothe> clothes = clotheRepo.findAll();
        List<Outfit> outfits = outfitRepo.findAll();

        if (users.isEmpty())   return ResponseEntity.badRequest().body("No hay usuarios");
        if (clothes.isEmpty()) return ResponseEntity.badRequest().body("No hay prendas — cargá algunas primero");

        List<Post> posts = new ArrayList<>();

        for (int i = 0; i < cantidad; i++) {
            Post post = new Post();

            post.setUser(users.get(random.nextInt(users.size())));
            post.setDescripcion(DESCRIPCIONES.get(random.nextInt(DESCRIPCIONES.size())) + " #" + i);
            post.setFechaCreacion(
                    LocalDate.now().minusDays(random.nextInt(365))
            );

            boolean hacerOutfit = !outfits.isEmpty() && random.nextInt(100) < porcentajeOutfits;

            if (hacerOutfit) {
                post.setOutfit(outfits.get(random.nextInt(outfits.size())));
                post.setClothe(null);
            } else {
                post.setClothe(clothes.get(random.nextInt(clothes.size())));
                post.setOutfit(null);
            }

            posts.add(post);
        }

        postRepo.saveAll(posts);

        long totalOutfits = posts.stream().filter(Post::isOutfit).count();
        long totalPrendas = cantidad - totalOutfits;

        return ResponseEntity.ok(String.format(
                "Creados %d posts: %d de outfits, %d de prendas sueltas",
                cantidad, totalOutfits, totalPrendas
        ));
    }

    @DeleteMapping("/clear-posts")
    public ResponseEntity<String> clearPosts() {
        long total = postRepo.count();
        postRepo.deleteAll();
        return ResponseEntity.ok("Eliminados " + total + " posts");
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        List<Post> todos = postRepo.findAll();
        long outfits = todos.stream().filter(Post::isOutfit).count();
        return ResponseEntity.ok(Map.of(
                "total",   todos.size(),
                "outfits", outfits,
                "prendas", todos.size() - outfits
        ));
    }
}