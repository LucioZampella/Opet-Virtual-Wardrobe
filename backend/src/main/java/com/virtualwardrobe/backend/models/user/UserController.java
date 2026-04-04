package com.virtualwardrobe.backend.models.user;

import com.virtualwardrobe.backend.models.user.response.LoginResponse;
import com.virtualwardrobe.backend.models.user.response.UserResponseDTO;
import com.virtualwardrobe.backend.models.user.userDTO.*;
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
    private JwtUtil jwtUtil;

    @Autowired
    private UserService service;

    @PostMapping("/signup")
    public ResponseEntity<?> createUser(@RequestBody @Valid UserDTO dto) {
        service.crear(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody @Valid UpdateUserDTO user,
                                        @RequestHeader("Authorization") String authHeader) {

            String token = authHeader.replace("Bearer ", "");
            String usernameFromToken = jwtUtil.extraerUsername(token);
            service.modificar(id, user, usernameFromToken);
        return ResponseEntity.ok().build();
        }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id, @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String usernameFromToken = jwtUtil.extraerUsername(token);

        service.eliminar(id, usernameFromToken);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/profile/{id}")
    public  ResponseEntity<UserResponseDTO> findUserById(@PathVariable int id) {
        UserResponseDTO u = service.buscarPorId(id);
        return ResponseEntity.ok().body(u);
    }

    @GetMapping("/list")
    public List<User> getAllUsers() {
        return service.listarTodos();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(service.login(dto));

    }
}
