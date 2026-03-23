package com.virtualwardrobe.models;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity

//Sirve para desactivar temporalmente el spring security para poder testear correctamente. Spring security basicamente
//se encarga de que no pueda entrar cualquier persona con el url y borre usuarios, acceda a todos los usuarios, etc.
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .formLogin(form -> form.disable()) // <--- AGREGAR ESTO
                .httpBasic(basic -> basic.disable()); // <--- AGREGAR ESTO

        return http.build();
    }
}
