package com.virtualwardrobe.backend.models.user;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
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

@Table(name = "usuarios")
public class User {
    @jakarta.persistence.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column

    private int id;

    @NotBlank(message = "Debe ingresar un username") //-> Se fija que el atributo tenga caracteres validos, si no es asi, muestra el mensaje
    private String username;

    @NotBlank(message = "Debe ingresar un correo electrónico")
    @Email(message = "El email no tiene un formato válido")
    // automaticamnete con el valid me valida que el email este correcto con la sintaxis
    private String email;

    @NotBlank(message = "Debe ingresar una contraseña")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // -> la contraseña nunca escapa del json
    private String password;

    @NotBlank(message = "El nombre no puede estar vacío")
    private String name;

    @NotBlank(message = "El apellido no puede estar vacío")
    private String lastName;

    private String avatar_url;

    private String bio;

    private String ubication;

}