package com.virtualwardrobe.backend.models.friends.CRUD;

import com.virtualwardrobe.backend.models.notification.CRUD.NotificationService;
import com.virtualwardrobe.backend.models.user.User;
import com.virtualwardrobe.backend.security.JwtUtil;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private FriendsService service;

    @GetMapping
    public ResponseEntity<?> getAllFriendsOfUser(
            @RequestHeader("Authorization") String authHeader) {
        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        return  ResponseEntity.ok(service.findAllFriendsOfUser(userId));
    }
    @PostMapping("/follow")
    public ResponseEntity<?> createFollower(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody FollowRequest body) {
        System.out.println("llego al controller ");
        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
        service.create(body.getFollowerId(), body.getFollowingId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/unfollow")
    public ResponseEntity<?> deleteFollower(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam int followerId,
            @RequestParam int followingId) {
        System.out.println("Llegueee");
        service.reject(followerId, followingId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accept")
    public ResponseEntity<?> acceptFollower(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam int followerId,
            @RequestParam int followingId) {
        System.out.println("Llegueee");
        service.accept(followerId, followingId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkFollowing(
            @RequestParam int followerId,
            @RequestParam int followingId) {
        boolean result = service.isFollowing(followerId, followingId);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/status")
    public ResponseEntity<?> getFollowStatus(
            @RequestParam int followerId,
            @RequestParam int followingId) {
        Optional<Follower> follower = service.findByFollowerIdAndFollowingId(followerId, followingId);
        if (follower.isEmpty()) return ResponseEntity.ok(Map.of("status", "none"));
        if (!follower.get().isStatus()) return ResponseEntity.ok(Map.of("status", "pending"));
        return ResponseEntity.ok(Map.of("status", "following"));
    }
    @GetMapping("/is-following")
    public ResponseEntity<Boolean> isFollowing(
            @RequestParam int followerId,
            @RequestParam int followingId) {
        return ResponseEntity.ok(service.isFollowing(followerId, followingId));
    }

}
