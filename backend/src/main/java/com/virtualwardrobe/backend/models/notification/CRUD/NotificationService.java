package com.virtualwardrobe.backend.models.notification.CRUD;

import com.virtualwardrobe.backend.exceptions.NotificationException.NotificationNotFoundException;
import com.virtualwardrobe.backend.exceptions.AuthorizationException.UnauthorizedActionException;
import com.virtualwardrobe.backend.models.notification.DTO.CreaterDTO;
import com.virtualwardrobe.backend.models.user.User;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private  NotificationRepositorie repo;


    public void create(CreaterDTO createrDTO, int actor_id) {
        Notification notification = new Notification();

        notification.setDescription(createrDTO.getDescription());
        notification.setType(createrDTO.getType());
        notification.setActor_id(actor_id);
        notification.setDate(LocalDateTime.now());
        notification.setAlready_read(false);
        notification.setUser_id(createrDTO.getUser_id());
        repo.save(notification);
    }
    //agarro la notification y la leo es decir Already_read -> True
    public void update(int notificationId){
        Notification n =  repo.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found") );
        n.setAlready_read(true);
        repo.save(n);
    }

    public void delete(int notificationId, int userId){
        Notification n =  repo.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found") );

        if (n.getUser_id() != userId) {
            throw new UnauthorizedActionException("No tenés permiso para eliminar esta notificacion");
        }
        repo.deleteById(Long.valueOf(notificationId));
    }
    public List<Notification> getAllNotifications(int user_id){
        return repo.findByUserId(user_id);
    }
    public List<Notification> getAllNotificationsNotRead(int user_id){
        return repo.findByAlreadyReadAndUserId(false,user_id);
    }

    public Notification getById(int notificationId){
        return repo.findById(notificationId).orElseThrow(() -> new NotificationNotFoundException("Notification not found") );
    }
    public void markAsRead(int notificationId, int userId) {
        Notification notif = repo.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        if (notif.getUser_id() != userId) throw new RuntimeException("No autorizado");
        notif.setAlready_read(true);
        repo.save(notif);
    }
    public void deleteByActorIdAndUserIdAndType(int actorId, int userId, String type) {
        repo.deleteByActorIdAndUserIdAndType(actorId, userId, type);
    }


}
