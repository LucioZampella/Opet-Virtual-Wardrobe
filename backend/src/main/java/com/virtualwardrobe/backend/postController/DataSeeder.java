package com.virtualwardrobe.backend.postController;

import com.virtualwardrobe.backend.models.clothe.ClotheRepositorie;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private TestPostsController testController;

    @Autowired
    private UserRepositorie userRepo;

    @Autowired
    private ClotheRepositorie clotheRepo;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--------------------------------------------");
        System.out.println("VERIFICANDO DATOS PARA SEEDER...");

        // Verificamos si ya hay posts para no duplicar cada vez que reiniciás
        // (Opcional: podés comentar este 'if' si querés que siempre cargue)
        long cantidadActual = userRepo.count();

        if (cantidadActual > 0) {
            System.out.println("Ejecutando Seeder automático de posts...");
            try {
                // Llamamos directamente al método del controlador
                testController.seedPosts(100, 50);
                System.out.println("SEEDER COMPLETADO: 100 posts creados.");
            } catch (Exception e) {
                System.err.println("ERROR EN SEEDER: " + e.getMessage());
            }
        } else {
            System.out.println("No se ejecutó el seeder porque no hay usuarios o prendas base.");
        }
        System.out.println("--------------------------------------------");
    }
}