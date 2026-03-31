package com.virtualwardrobe.backend.models.user.userServices;

import com.virtualwardrobe.backend.models.user.User;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import com.virtualwardrobe.backend.models.user.userDTO.LoginResponse;
import com.virtualwardrobe.backend.models.user.userDTO.UserDTO;
import com.virtualwardrobe.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class UserService {

//  Es el encargado de la logica. Aca verificare las condiciones que quiero que se cumplan

    @Autowired
    private UserRepositorie repo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceimp userDetailsService;

    public User crear(UserDTO dto) {
        // username sin espacios y email en miniscula y sin espacios

        validarTodasLasLongitudes(dto);
        if (repo.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Error 409: Email ya existente");
        }

        if (repo.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Error 409: Username ya existente"); // -> Manejan el caso en que ya existe
            // ese username/email al querer registrarse
        }
        User user = new User();
        user.setUsername(dto.getUsername().trim());
        user.setEmail(dto.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setName(dto.getName());
        user.setLastName(dto.getLastName());
        user.setLatitude(dto.getLatitude());
        user.setLongitude(dto.getLongitude());

        return repo.save(user);
    }

    public User modificar(int id, User user) {

        User u = repo.findById(id).orElseThrow(() -> new RuntimeException("Error 404: usuario no encontrado"));
        // username sin espacios y email en miniscula y sin espacios
        u.setUsername(u.getUsername().trim());
        u.setEmail(u.getEmail().trim().toLowerCase());

        validarTodasLasLongitudes(user);

        repo.findByUsername(user.getUsername())
                .filter(existing -> existing.getId() != id)
                .ifPresent(existing -> { throw new RuntimeException("Error 409: Username ya existente"); });

        repo.findByEmail(user.getEmail())
                .filter(existing -> existing.getId() != id)
                .ifPresent(existing -> { throw new RuntimeException("Error 409: Email ya existente"); });


        // si no hay ningun problema con los datos de mi usuario simplemente cambio los
        u.setUsername(user.getUsername());
        u.setEmail(user.getEmail());
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            u.setPassword(user.getPassword());
        }
        u.setName(user.getName());
        u.setLastName(user.getLastName());
        u.setAvatar_url(user.getAvatar_url());
        u.setBio(user.getBio());
        u.setLatitude(user.getLatitude());
        u.setLongitude(user.getLongitude());

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



    public ResponseEntity<LoginResponse> login(String email, String password) {

        String lowEmail = email.trim().toLowerCase();

        User u = repo.findByEmail(lowEmail).orElseThrow(() -> new RuntimeException("Error 404: usuario no encontrado"));
        UserDetails userDetails = userDetailsService.loadUserByUsername(u.getUsername());

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            LoginResponse e = new LoginResponse(1,"credencial invalida");
            return  ResponseEntity.status(401).body(e);
        }


        String token= jwtUtil.generateToken(userDetails.getUsername());
        int id= repo.findByEmail(email).get().getId();
        LoginResponse e = new LoginResponse(id,token);
        return ResponseEntity.ok().body(e);
    }


    //funcion privada que me chequea todas las longitudes
    private void validarTodasLasLongitudes(UserDTO u){
        validarLongitud(u.getUsername(),"Username",0,255);
        validarLongitud(u.getEmail(),"Email",0,255);
        validarLongitud(u.getPassword(),"Password",0,255);
        validarLongitud(u.getName(),"Name",0,255);
        validarLongitud(u.getLastName(),"Last Name",0,255);
    }
    private void validarTodasLasLongitudes(User u){
        validarLongitud(u.getUsername(),"Username",0,255);
        validarLongitud(u.getEmail(),"Email",0,255);
        validarLongitud(u.getPassword(),"Password",0,255);
        validarLongitud(u.getBio(),"Name",0,500);
        validarLongitud(u.getName(),"Name",0,255);
        validarLongitud(u.getLastName(),"Last Name",0,255);
    }

    // funciones privada que me valida la longitud de mis campos
    private void validarLongitud(String campo, String nombreCampo, int min, int max) {

        if (campo == null) {
            return;
        }
        if (campo.length() < min || campo.length() > max) {
            throw new RuntimeException("Error 400: " + nombreCampo + " debe tener entre " + min + " y " + max + " caracteres");
        }
    }
}
