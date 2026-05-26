//package com.virtualwardrobe.backend.models.friends.CRUD;
//
//import com.virtualwardrobe.backend.models.notification.CRUD.NotificationService;
//import com.virtualwardrobe.backend.models.user.User;
//import com.virtualwardrobe.backend.security.JwtUtil;
//import org.apache.coyote.Response;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/friends")
//public class FriendController {
//
//    @Autowired
//    private JwtUtil jwtUtil;
//    @Autowired
//    private FriendsService service;
//
//    @GetMapping
//    public ResponseEntity<?> getAllFriends(
//            @RequestHeader("Authorization") String authHeader) {
//        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
//        return  ResponseEntity.ok(service.findAll(userId));
//    }
//    @PostMapping
//    public ResponseEntity<?> createFriend(@RequestBody
//                                   @RequestHeader("Authorization") String authHeader,
//                               int friend_id) {
//        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
//        service.create(userId, friend_id);
//        return ResponseEntity.ok().build();
//    }
//    @PostMapping
//    public ResponseEntity<?> updateFriend (
//            @RequestBody
//            @RequestHeader("Authorization") String authHeader,
//            int friend_id
//    ){
//        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
//        service.update(friend_id, userId);
//        return ResponseEntity.ok().build();
//    }
//
//    @DeleteMapping
//    public ResponseEntity<?> deleteFriend (
//            @RequestHeader("Authorization") String authHeader,
//            int friend_id
//    ){
//        int userId = jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
//        service.delete(friend_id,userId);
//        return ResponseEntity.ok().build();
//    }
//
//}
