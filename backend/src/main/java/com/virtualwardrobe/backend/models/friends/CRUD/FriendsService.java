package com.virtualwardrobe.backend.models.friends.CRUD;

import com.virtualwardrobe.backend.exceptions.AuthorizationException.UnauthorizedActionException;
import com.virtualwardrobe.backend.models.notification.facade.NotificationFacade;
import com.virtualwardrobe.backend.models.user.User;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import com.virtualwardrobe.backend.models.user.userServices.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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
        Friend friends = new Friend();
        friends.setFriend(friend);
        friends.setUser(user);
        friends.setStatus(false);
        friends.setCreatedAt(LocalDateTime.now());
        notificationFacade.notificate(user.getId(),friend.getId(),"APPLICATION", "El usuario" + user.getUsername() + "Quieres ser tu amigo aceptalo!");
    }
    public void delete (int id, int userId){
        Friend f = repo.findById(id).orElseThrow();
        if (f.getUser().getId() != userId) {
            throw new UnauthorizedActionException("No tenés permiso para eliminar esta prenda");
        }
        repo.delete(f);
    }
    public void update (int id, int userId){

        Friend f = repo.findById(id).orElseThrow();
        if (f.getUser().getId() != userId) {
            throw new UnauthorizedActionException("No tenés permiso para eliminar esta prenda");
        }
        if(f.isStatus()){
            f.setStatus(false);
            repo.save(f);
        }f.setStatus(true);
        repo.save(f);
    }
    public List<Friend> findAll(int id){
        return repo.findByFriendId(id).orElseThrow();
    }

}
