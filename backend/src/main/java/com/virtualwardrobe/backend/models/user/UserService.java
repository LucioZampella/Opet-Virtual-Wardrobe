package com.virtualwardrobe.backend.models.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class UserService {

//  Es el encargado de la logica. Aca verificare las condiciones que quiero que se cumplan

    @Autowired
    private UserRepositorie repo;

    public User crear(User u) {
        if (repo.findByEmail(u.getEmail()).isPresent()) {
            throw new RuntimeException("Error 409: Email ya existente");
        }
        if (repo.findByUsername(u.getUsername()).isPresent()) {
            throw new RuntimeException("Error 409: Username ya existente"); // -> Manejan el caso en que ya existe
            // ese username/email al querer registrarse
        }
        return repo.save(u);
    }

    public User modificar(int id, User user) {
        User u = repo.findById(id).orElseThrow(() -> new RuntimeException("Error 404: usuario no encontrado"));

        u.setUsername(user.getUsername());
        u.setEmail(user.getEmail());
        u.setPassword(user.getPassword());
        u.setName(user.getName());
        u.setLastName(user.getLastName());
        u.setAvatar_url(user.getAvatar_url());
        u.setBio(user.getBio());
        u.setUbication(user.getUbication());

        return repo.save(u);
    }
    public void eliminar(int id) {
        if (repo.findById(id).isEmpty()) {
            throw new RuntimeException("Error 404: usuario no encontrado");
        }
        repo.deleteById(id);
    }

    public User buscarPorId(int id) {
        return repo.findById(id).orElseThrow(()-> new RuntimeException("Error 404: usuario no encontrado"));
    }
    public List<User> listarTodos() {
        return repo.findAll();
    }

    public User login(String email, String password) {

        User u = repo.findByEmail(email).orElseThrow(() -> new RuntimeException("Error 404: usuario no encontrado"));

        if (!password.equals(u.getPassword())) {
            throw new RuntimeException("Error 401: credenciales inválidas");
        }
        return u;
    }

}
