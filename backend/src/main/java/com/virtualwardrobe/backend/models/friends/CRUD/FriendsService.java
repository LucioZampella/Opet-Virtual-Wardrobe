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
        User user = userRepositorie.findById(user_id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        User friend = userRepositorie.findById(friend_id).orElseThrow(() -> new RuntimeException("Amigo no encontrado"));

        Follower friends = new Follower();
        friends.setFollowing(friend);
        friends.setFollower(user);
        friends.setStatus(false);
        friends.setCreatedAt(LocalDateTime.now());

        friends = repo.save(friends);

        updateForCreation(friends.getId());

        notificationFacade.notificate(user.getId(), friend.getId(), "APPLICATION", "El usuario " + user.getUsername() + " te ha seguido");
    }
    public void delete (int followerId, int followingId){
        Follower f = repo.findByFollowerIdAndFollowingId(followerId, followingId)
                .orElseThrow(() -> new InvalidFollowerException("No se encontró ningún seguimiento activo entre estos usuarios"));
        updateForDeletion(f);

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
