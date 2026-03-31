package com.virtualwardrobe.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.apache.catalina.User;

import java.util.Date;

public class JwtUtil {

    private final String password= "definir contraseña";

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(SignatureAlgorithm.HS256, password)
                .compact();

    }
    public String extraerUsername(String token) {
        return Jwts.parser()
                .setSigningKey(password)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    public boolean validateToken(String token, String username) {
        return extraerUsername(token).equals(username) && !estaExpirado(token);
    }
    private boolean estaExpirado(String token) {
        return Jwts.parser()
                .setSigningKey(password)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration()
                .before(new Date());
    }
}
