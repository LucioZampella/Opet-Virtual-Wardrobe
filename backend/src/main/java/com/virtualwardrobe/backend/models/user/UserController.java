package com.virtualwardrobe.backend.models.user;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
//Recibe y responde las peticiones de http
public class UserController {

    @Autowired
    private UserService service;

    @PutMapping("/signup")
    public User createUser(@RequestBody @Valid User user) {
        return service.crear(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable int id,@RequestBody User user) {
        return service.modificar(id,user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        service.eliminar(id);
    }

    @GetMapping("/{id}")
    public User findUserById(@PathVariable int id) { return service.buscarPorId(id); }

    @GetMapping("/list")
    public List<User> getAllUsers() {
        return service.listarTodos();
    }

    @PostMapping("/login")
    @CrossOrigin(origins = "http://localhost:5173")
    public User login(@RequestBody LoginRequest req) {
        return service.login(req.getEmail(), req.getPassword());
    }

}
