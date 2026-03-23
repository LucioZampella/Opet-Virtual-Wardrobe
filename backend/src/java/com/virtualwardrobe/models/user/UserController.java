package com.virtualwardrobe.models.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/User")
//Recibe y responde las peticiones de http
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping
    public User createUser(@RequestBody User user) {
        return service.crear(user);
    }
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id,@RequestBody User user) {
        return service.modificar(id,user);
    }
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        service.eliminar(id);
    }
    @GetMapping
    public User findUserById(@PathVariable Long id) {
        return service.buscarPorId(id);
    }
    public List<User> getAllUsers() {
        return service.listarTodos();
    }

}
