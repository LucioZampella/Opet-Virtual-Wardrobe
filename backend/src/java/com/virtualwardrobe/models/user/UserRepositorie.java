package com.virtualwardrobe.models.user;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.ListCrudRepository;

//Habla con la base de datos

@Repository
public interface UserRepositorie extends JpaRepository<User, Long>{

    // Save() --> guarda un ususario o actualiza
    //findById(id) --> busca por id
    //findAll --> Trae todo los usuarios
    //deleteById(id) --> elimina el usuario con el id
    //existsById(id) --> verifica si existe

}


