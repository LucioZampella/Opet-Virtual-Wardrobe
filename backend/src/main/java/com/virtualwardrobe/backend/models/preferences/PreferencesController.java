package com.virtualwardrobe.backend.models.preferences;

import com.virtualwardrobe.backend.models.preferences.auxiliar.AttributeType;
import com.virtualwardrobe.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;

import java.util.List;

@Controller
@RestController
@RequestMapping("/api/preferences")
public class PreferencesController {

    @Autowired
    private PreferencesService preferencesService;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private RequestMappingHandlerAdapter requestMappingHandlerAdapter;

    @GetMapping("/{userId}")
    public ResponseEntity<List<UserPreferences>> obtenerTodas(@RequestHeader("Authorization") String authHeader) {
    int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
    return ResponseEntity.ok(preferencesService.obtenerTodas(userId));
    }

    @GetMapping("/{userId}/{tipo}")
    public ResponseEntity<List<UserPreferences>> obtenerPorTipo(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable AttributeType type) {
        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(preferencesService.obtenerPorType(userId, type));
    }
}