package com.virtualwardrobe.backend.models.notification.CRUD;

import com.virtualwardrobe.backend.models.clothe.Clothe;
import com.virtualwardrobe.backend.models.clothe.ClotheService;
import com.virtualwardrobe.backend.security.JwtUtil;
import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private NotificationService service;

    @GetMapping("/my-notifications")
    public ResponseEntity<List<Notification>> getMyNotifications(
            @RequestHeader("Authorization") String authHeader) {

        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(service.getAllNotifications(userId));
    }

    @GetMapping("/my-notifications-not-read")
    public ResponseEntity<List<Notification>> getMyNotificationsNotRead(
            @RequestHeader("Authorization") String authHeader) {
        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        return ResponseEntity.ok(service.getAllNotificationsNotRead(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable int id,
            @RequestHeader("Authorization") String authHeader) {

        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        service.delete(id,userId);
        return ResponseEntity.ok().build();
    }
    
}
