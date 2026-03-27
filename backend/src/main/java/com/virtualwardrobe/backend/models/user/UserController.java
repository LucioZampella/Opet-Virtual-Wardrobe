package com.virtualwardrobe.backend.models.user;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
//Recibe y responde las peticiones de http
public class UserController {

    @Autowired
    private UserService service;
    @PostMapping("/signup")
    public User createUser(@RequestBody @Valid User user) {
        return service.crear(user);
    }

    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable int id,@RequestBody User user) {
        return service.modificar(id,user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        service.eliminar(id);
    }

    @GetMapping("/profile/{id}")
    public User findUserById(@PathVariable int id) { return service.buscarPorId(id); }

    @GetMapping("/list")
    public List<User> getAllUsers() {
        return service.listarTodos();
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest req) {
        return service.login(req.getEmail(), req.getPassword());
    }

}
