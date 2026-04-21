package com.virtualwardrobe.backend.models.user.userServices;

import com.virtualwardrobe.backend.exceptions.InvalidUserException;
import com.virtualwardrobe.backend.exceptions.UnauthorizedActionException;
import com.virtualwardrobe.backend.models.user.User;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import com.virtualwardrobe.backend.models.user.response.LoginResponse;
import com.virtualwardrobe.backend.models.user.response.UserResponseDTO;
import com.virtualwardrobe.backend.models.user.userDTO.*;
import com.virtualwardrobe.backend.security.CustomUserDetails;
import com.virtualwardrobe.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
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

    public void crear(UserDTO dto) {
        // username sin espacios y email en minuscula y sin espacios

        validarTodasLasLongitudes(dto);
        if (repo.findByEmail(dto.getEmail()).isPresent()) {
            throw new InvalidUserException("Email ya existente");
        }

        if (repo.findByUsername(dto.getUsername()).isPresent()) {
            throw new InvalidUserException("Username ya existente"); // -> Manejan el caso en que ya existe
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
        repo.save(user);
    }

    public void modificar(int id, UpdateUserDTO user, String usernameFromToken) {

        User u = repo.findById(id).orElseThrow(() -> new InvalidUserException("usuario no encontrado"));

        if (!u.getUsername().equals(usernameFromToken)) {
            throw new UnauthorizedActionException("No tenés permiso para editar este usuario");
        }
        validarTodasLasLongitudesUpdate(user);
        u.setName(user.getName());
        u.setLastName(user.getLastName());
        u.setBio(user.getBio());
        u.setAvatar_url(user.getAvatar_url());
        repo.save(u);
    }

    public void eliminar(int id,String usernameFromToken) {
        User u = repo.findById(id)
                .orElseThrow(() -> new InvalidUserException(" usuario no encontrado"));

        if (!u.getUsername().equals(usernameFromToken)) {
            throw new UnauthorizedActionException("No tenés permiso para eliminar este usuario");
        }
        repo.deleteById(id);
    }

    public UserResponseDTO buscarPorId(int id) {
        User user = repo.findById(id)
                .orElseThrow(() -> new InvalidUserException("usuario no encontrado"));
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setLastName(user.getLastName());
        dto.setUsername(user.getUsername());
        dto.setBio(user.getBio());
        dto.setAvatar_url(user.getAvatar_url());
        return dto;
    }


    public List<User> listarTodos() {
        return repo.findAll();
    }



    public LoginResponse login(LoginRequestDTO loginDTO) {

        // Si el username no existe, loadUserByUsername ya lanza UsernameNotFoundException
        CustomUserDetails userDetails = userDetailsService.loadUserByUsername(loginDTO.getUsername());

        // Si la contraseña no coincide, lanzás vos la excepción
        if (!passwordEncoder.matches(loginDTO.getPassword(), userDetails.getPassword())) {
            throw new BadCredentialsException("Contraseña incorrecta");
        }

        String token = jwtUtil.generateToken(loginDTO.getUsername(),userDetails.getId());
        // no hace falta tirar una expceion pq loadByUsername ya lo tira


        return new LoginResponse(userDetails.getId(), token);
    }

    // -----------------------------------Funciones privadas ----------------------------------------//

    //funcion privada que me chequea todas las longitudes
    private void validarTodasLasLongitudes(UserDTO u){
        validarLongitud(u.getUsername(),"Username",0,255);
        validarLongitud(u.getEmail(),"Email",0,255);
        validarLongitud(u.getPassword(),"Password",0,255);
        validarLongitud(u.getName(),"Name",0,255);
        validarLongitud(u.getLastName(),"Last Name",0,255);
    }
    private void validarTodasLasLongitudesUpdate(UpdateUserDTO u){
        validarLongitud(u.getBio(),"Bio",0,500);
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
