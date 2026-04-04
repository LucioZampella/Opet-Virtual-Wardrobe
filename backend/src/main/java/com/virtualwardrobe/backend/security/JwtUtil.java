package com.virtualwardrobe.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final String password= "V2lyZXdhcmRyb2JlU2VjcmV0S2V5Rm9ySldUU2lnbmluZzIwMjYhQCM=";

    public String generateToken(String username,int userId) {
        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
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

    public int extraerUserId(String token) {
        return Jwts.parser()
                .setSigningKey(password)
                .parseClaimsJws(token)
                .getBody()
                .get("userId", Integer.class);
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
