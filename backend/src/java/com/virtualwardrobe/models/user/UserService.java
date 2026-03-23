package com.virtualwardrobe.models.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class UserService {
//Es el encargado de la logica es decir aca verificare las conidicones que quiere que se cumplan
    @Autowired
    private UserRepositorie repo;

    public User crear(User u) {
        return repo.save(u);
    }

    public User modificar(Long id, User user) {
        User u = repo.findById(id).orElseThrow(() -> new RuntimeException("erorr 400: usuario no encontrado"));
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
    public void eliminar(Long id) {
        repo.deleteById(id);
    }

    public User buscarPorId(Long id) {
        return repo.findById(id).orElseThrow(()-> new RuntimeException("error 400: usuario no existente"));
    }
    public List<User> listarTodos() {
        return repo.findAll();
    }

}
