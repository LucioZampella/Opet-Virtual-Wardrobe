package com.virtualwardrobe.backend.models.user;

import com.virtualwardrobe.backend.models.user.userDTO.LoginRequestDTO;
import com.virtualwardrobe.backend.models.user.userDTO.LoginResponse;
import com.virtualwardrobe.backend.models.user.userDTO.UserDTO;
import com.virtualwardrobe.backend.models.user.userServices.UserService;
import com.virtualwardrobe.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
//Recibe y responde las peticiones de http
public class UserController {



    @Autowired
    private UserService service;

    @PostMapping("/signup")
    public ResponseEntity<?> createUser(@RequestBody @Valid UserDTO dto) {
        service.crear(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody @Valid User user) {

        service.modificar(id, user);
        return ResponseEntity.ok().build();
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
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequestDTO dto) {
        return service.login(dto.getEmail(), dto.getPassword());
    }

}
