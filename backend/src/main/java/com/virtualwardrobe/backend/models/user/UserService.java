package com.virtualwardrobe.backend.models.user;

import org.springframework.beans.factory.annotation.Autowired;
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

    public User crear(User u) {
        // username sin espacios y email en miniscula y sin espacios
        u.setUsername(u.getUsername().trim());
        u.setEmail(u.getEmail().trim().toLowerCase());

        validarTodasLasLongitudes(u);
        if (repo.findByEmail(u.getEmail()).isPresent()) {
            throw new RuntimeException("Error 409: Email ya existente");
        }

        if (repo.findByUsername(u.getUsername()).isPresent()) {
            throw new RuntimeException("Error 409: Username ya existente"); // -> Manejan el caso en que ya existe
            // ese username/email al querer registrarse
        }
        u.setPassword(passwordEncoder.encode(u.getPassword()));
        return repo.save(u);
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

    public User login(String email, String password) {

        String lowEmail = email.trim().toLowerCase();

        User u = repo.findByEmail(lowEmail).orElseThrow(() -> new RuntimeException("Error 404: usuario no encontrado"));

        if (!passwordEncoder.matches(password, u.getPassword())) {
            throw new RuntimeException("Error 401: credenciales inválidas");
        }
        return u;
    }


    //funcion privada que me chequea todas las longitudes
    private void validarTodasLasLongitudes(User u){
        validarLongitud(u.getUsername(),"Username",0,255);
        validarLongitud(u.getEmail(),"Email",0,255);
        validarLongitud(u.getPassword(),"Password",0,255);
        validarLongitud(u.getBio(),"Bio",0,255);
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
