package com.virtualwardrobe.backend.models.user;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


//Habla con la base de datos

@Repository
public interface UserRepositorie extends JpaRepository<User, Integer> {

    // Save() --> guarda un usuario o actualiza
    Optional<User> findById(int id);

    List<User> findAll();

    //deleteById(id) --> elimina el usuario con el id
    //existsById(id) --> verifica si existe
    Optional<User> findByEmail(String email); //--> Optional para evitar que explote en caso de null
    Optional<User> findByUsername(String username);

}


