package com.virtualwardrobe.models.user;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//Funcion de Lombok que genera un getter, setter, toString, etc para
// todos los atributos que pongamos en la clase
//Los args lo que hacen es generar dos constructores, uno sin ningun atributo
// y otro con todos los atributos


@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity

//Representa la tabla en la db

@Table(name="User")
public class User {
    @jakarta.persistence.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column

    private int id;

    @NotBlank(message = "Debe ingresar un username") //-> Se fija que el atributo tenga caracteres validos, si no es asi, muestra el mensaje
    private String username;

    @NotBlank(message = "Debe ingresar un correo electrónico")
    private String email;

    @NotBlank(message = "Debe ingresar una contraseña")
    private String password;

    @NotBlank(message = "El nombre no puede estar vacío")
    private String Name;

    @NotBlank(message = "El apellido no puede estar vacío")
    private String lastName;


    private String avatar_url;


    private String bio;


    private String ubication;


}