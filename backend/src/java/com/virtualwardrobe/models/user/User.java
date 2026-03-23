package com.virtualwardrobe.models.user;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

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

    private long id;


    private String username;


    private String email;


    private String password;


    private String Name;


    private String lastName;


    private String avatar_url;


    private String bio;


    private String ubication;


}