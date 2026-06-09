package com.virtualwardrobe.backend.models.friends.CRUD;

import com.virtualwardrobe.backend.exceptions.AuthorizationException.UnauthorizedActionException;
import com.virtualwardrobe.backend.exceptions.FollowerException.InvalidFollowerException;
import com.virtualwardrobe.backend.exceptions.OutfitException.InvalidOutfitException;
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

    public void create (int user_id, int friend_id){
        System.out.println("Creando");
        System.out.println(">>> create llamado con followerId=" + user_id + " followingId=" + friend_id);
        User user = userRepositorie.findById(user_id)
                .orElseThrow(() -> new RuntimeException("Usuario follower no encontrado: " + user_id));
        User friend = userRepositorie.findById(friend_id)
                .orElseThrow(() -> new RuntimeException("Usuario follower no encontrado: " + friend_id));
        // user es ele que manda la proposal
        // firend es la que la recibe

        Follower friends = new Follower();
        friends.setFollowing(friend);
        friends.setFollower(user);
        friends.setStatus(false);
        friends.setCreatedAt(LocalDateTime.now());
        Follower saved = repo.save(friends);
        repo.flush();
        notificationFacade.notificate(user.getId(),friend.getId(),"APPLICATION", "El usuario" + user.getUsername() + "Te ha seguido");
        System.out.println(">>> Follower guardado con ID: " + saved.getId());
        updateForCreation(saved.getId());
    }
    public void delete (int id, int userId){
        Follower f = repo.findByFollowerIdAndFollowingId(id,userId).orElseThrow(() -> new RuntimeException("Seguimiento no existe"));
        System.out.println("Eliminadno");
        updateForDeletion(f);
        if (f.getFollower().getId() != id) {
            throw new UnauthorizedActionException("No tenés permiso para eliminar este seguimiento ");
        }
        System.out.println("El seguimiento ha sido eliminado");
        repo.delete(f);
    }
    public void updateForCreation (int id){

        Follower f = repo.findById(id).orElseThrow();
        // busco si existe la el seguimiento al reves
        Optional<Follower> friend = repo.findByFollowerIdAndFollowingId(f.getFollowing().getId(),f.getFollower().getId());
        if(friend.isPresent()){
            friend.get().setStatus(true);
            f.setStatus(true);
            repo.save(friend.get());
            notificationFacade.notificate(f.getFollower().getId(),f.getFollowing().getId(),"Application", "El usuario" + f.getFollowing().getUsername() + "y tu  ahora son amigos!");
        }
        repo.save(f);
    }
    public void updateForDeletion (Follower f){
        if(f.isStatus()){
            Optional<Follower> friend = repo.findByFollowerIdAndFollowingId(f.getFollowing().getId(),f.getFollower().getId());
            if(friend.isPresent()){
                friend.get().setStatus(false);
                repo.save(friend.get());
            }
        }
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
