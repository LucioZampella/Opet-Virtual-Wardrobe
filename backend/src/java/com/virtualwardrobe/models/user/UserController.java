package com.virtualwardrobe.models.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/User")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping
    public User createUser(@RequestBody User user) {
        return service.crear(user);
    }
    @PutMapping
    public User updateUser(@PathVariable Long id,@RequestBody User user) {
        return service.modificar(id,user);
    }
    @DeleteMapping
    public void deleteUser(@PathVariable Long id) {
        service.eliminar(id);
    }
    @GetMapping
    public List<User> getAllUsers() {
        service.
    }
}
