package com.virtualwardrobe.backend.models.notification.facade.strategy;

import com.virtualwardrobe.backend.models.notification.CRUD.NotificationService;
import com.virtualwardrobe.backend.models.notification.DTO.CreaterDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
public class AppNotificationStrategy implements NotificationStrategy {

    private final NotificationService service;

    @Autowired
    public AppNotificationStrategy(NotificationService service) {
        this.service = service;
    }

    @Override
    public void notify(int actorId, int receiverId, String type, String description) {
        CreaterDTO dto = new CreaterDTO();
        dto.setDescription(description);  // ahora sí es el mensaje legible
        dto.setType(type);
        dto.setUser_id(receiverId);
        service.create(dto, actorId);
    }
}
