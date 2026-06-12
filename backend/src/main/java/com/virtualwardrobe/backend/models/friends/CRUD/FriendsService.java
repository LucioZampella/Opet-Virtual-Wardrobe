package com.virtualwardrobe.backend.models.friends.CRUD;

import com.virtualwardrobe.backend.exceptions.AuthorizationException.UnauthorizedActionException;
import com.virtualwardrobe.backend.exceptions.FollowerException.InvalidFollowerException;
import com.virtualwardrobe.backend.exceptions.OutfitException.InvalidOutfitException;
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

    public void create (int user_id, int friend_id){
        System.out.println("Creando");
        System.out.println(">>> create llamado con followerId=" + user_id + " followingId=" + friend_id);
        User user = userRepositorie.findById(user_id)
                .orElseThrow(() -> new RuntimeException("Usuario follower no encontrado: " + user_id));
        User friend = userRepositorie.findById(friend_id)
                .orElseThrow(() -> new RuntimeException("Usuario follower no encontrado: " + friend_id));
        Optional<Follower> alreadyExists = repo.findByFollowerIdAndFollowingId(user_id, friend_id);
        if (alreadyExists.isPresent()) throw new RuntimeException("Ya existe una solicitud o seguimiento");

        // user es ele que manda la proposal
        // firend es la que la recibe
        CreaterDTO dto = new CreaterDTO();
        dto.setDescription("Un nuevo usuario te quiere seguir");
        dto.setType("FOLLOW_REQUEST");
        dto.setUser_id(friend_id);
        serv.create(dto,user_id);
        Follower friends = new Follower();
        friends.setFollowing(friend);
        friends.setFollower(user);
        friends.setStatus(false);
        friends.setCreatedAt(LocalDateTime.now());
        Follower saved = repo.save(friends);
        repo.flush();
        notificationFacade.notificate(user.getId(),friend.getId(),"APPLICATION", "El usuario" + user.getUsername() + "Te ha seguido");
        System.out.println(">>> Follower guardado con ID: " + saved.getId());

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

        request.setStatus(true); // true = aceptado
        repo.save(request);
        CreaterDTO dto = new CreaterDTO();
        dto.setDescription("El usuario ha aceptado tu solicitud!");
        dto.setType("Application");
        dto.setUser_id(followerId);
        serv.create(dto, followerId);
        notificationFacade.notificate(followingId, followerId, "FOLLOW_ACCEPTED",
                "El usuario " + request.getFollowing().getUsername() + " aceptó tu solicitud");
    }

    public List<Follower> findAllFriendsOfUser(int id){
        return repo.findAllFriendsOfUser(id);
    }
    public boolean isFollowing(int followerId, int followingId) {
        return repo.existsByFollowerIdAndFollowingId(followerId, followingId);
    }
    public List<Follower> findAllFollowingOfUser(int id){
        return repo.findByFollowerId(id);
    }

}
