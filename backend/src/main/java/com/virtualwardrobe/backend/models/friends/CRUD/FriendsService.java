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
        User user = userRepositorie.findById(user_id).get();
        User friend = userRepositorie.findById(friend_id).get();
        // user es ele que manda la proposal
        // firend es la que la recibe

        Follower friends = new Follower();
        friends.setFollowing(friend);
        friends.setFollower(user);
        friends.setStatus(false);
        friends.setCreatedAt(LocalDateTime.now());
        updateForCreation(friends.getId());
        notificationFacade.notificate(user.getId(),friend.getId(),"APPLICATION", "El usuario" + user.getUsername() + "Te ha seguido");
    }
    public void delete (int id, int userId){
        Follower f = repo.findById(id).orElseThrow(() -> new InvalidFollowerException("no hay ningun seguimiento  con ese id"));
        updateForDeletion(f);
        if (f.getFollower().getId() != userId) {
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
