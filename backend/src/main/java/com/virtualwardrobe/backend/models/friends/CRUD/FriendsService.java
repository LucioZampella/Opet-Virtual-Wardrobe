package com.virtualwardrobe.backend.models.friends.CRUD;

import com.virtualwardrobe.backend.exceptions.AuthorizationException.UnauthorizedActionException;
import com.virtualwardrobe.backend.exceptions.FollowerException.InvalidFollowerException;
import com.virtualwardrobe.backend.exceptions.OutfitException.InvalidOutfitException;
import com.virtualwardrobe.backend.exceptions.UserException.InvalidUserException;
import com.virtualwardrobe.backend.models.notification.CRUD.Notification;
import com.virtualwardrobe.backend.models.notification.CRUD.NotificationService;
import com.virtualwardrobe.backend.models.notification.DTO.CreaterDTO;
import com.virtualwardrobe.backend.models.notification.facade.NotificationFacade;
import com.virtualwardrobe.backend.models.user.User;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import com.virtualwardrobe.backend.models.user.userServices.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FriendsService {
    @Autowired
    private FriendRepositorie repo;
    @Autowired
    private UserRepositorie userRepositorie;
    @Autowired
    private NotificationFacade notificationFacade;
    @Autowired
    private NotificationService  serv;

    public void create(int user_id, int friend_id) {
        User user = userRepositorie.findById(user_id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + user_id));
        User friend = userRepositorie.findById(friend_id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + friend_id));

        Optional<Follower> alreadyExists = repo.findByFollowerIdAndFollowingId(user_id, friend_id);
        if (alreadyExists.isPresent()) throw new RuntimeException("Ya existe una solicitud o seguimiento");

        Follower follower = new Follower();
        follower.setFollower(user);
        follower.setFollowing(friend);
        follower.setCreatedAt(LocalDateTime.now());

        if (friend.isPrivate()) {
            follower.setStatus(false);
            repo.save(follower);

            notificationFacade.notificate(user.getId(), friend.getId(), "FOLLOW_REQUEST",
                    "El usuario " + user.getUsername() + " quiere seguirte");
        } else {
            follower.setStatus(true);
            repo.save(follower);

            notificationFacade.notificate(user.getId(), friend.getId(), "FOLLOW_ACCEPT",
                    "El usuario " + user.getUsername() + " te empezó a seguir");
        }
    }

    public void reject(int followerId, int followingId) {
        Follower request = repo.findByFollowerIdAndFollowingId(followerId, followingId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        repo.delete(request);
    }


    public void accept(int followerId, int followingId) {
        Follower request = repo.findByFollowerIdAndFollowingId(followerId, followingId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        if (request.isStatus()) throw new RuntimeException("Ya estás siguiendo a este usuario");

        request.setStatus(true);
        repo.save(request);

        // eliminás la notificación de FOLLOW_REQUEST
        serv.deleteByActorIdAndUserIdAndType(followerId, followingId, "FOLLOW_REQUEST");

        // notificación al que pidió seguirte
        notificationFacade.notificate(followingId, followerId, "FOLLOW_ACCEPT",
                "El usuario " + request.getFollowing().getUsername() + " aceptó tu solicitud");

        // notificación a vos para seguir de vuelta
        notificationFacade.notificate(followerId, followingId, "FOLLOW_BACK",
                "El usuario " + request.getFollower().getUsername() + " te está siguiendo, ¿querés seguirlo también?");
    }

    public List<User> findAllFriendsOfUser(int id){

        User u = userRepositorie.findById(id).orElseThrow(() -> new InvalidUserException("usuario no encontrado"));
        return repo.findAllFriendsOfUser(id);
    }
    public boolean isFollowing(int followerId, int followingId) {
        return repo.existsByFollowerIdAndFollowingId(followerId, followingId);
    }
    public List<Follower> findAllFollowingOfUser(int id){
        return repo.findByFollowerId(id);
    }

    public Optional<Follower> findByFollowerIdAndFollowingId(int id, int friend_id){
        return repo.findByFollowerIdAndFollowingId(id,friend_id);
    }
}
