package com.virtualwardrobe.backend.models.notification.facade;

import com.virtualwardrobe.backend.models.notification.CRUD.Notification;
import com.virtualwardrobe.backend.models.notification.CRUD.NotificationService;
import com.virtualwardrobe.backend.models.notification.facade.strategy.AppNotificationStrategy;
import com.virtualwardrobe.backend.models.notification.facade.strategy.EmailNotificationStrategy;
import com.virtualwardrobe.backend.models.notification.facade.strategy.NotificationStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Component
public class NotificationFacade {

    private final List<NotificationStrategy> strategies;

    @Autowired
    public NotificationFacade(EmailNotificationStrategy emailStrategy,
                              AppNotificationStrategy appStrategy) {
        this.strategies = new ArrayList<>();
        strategies.add(emailStrategy);
        strategies.add(appStrategy);
    }

    public void notificate(int actorId, int receiverId, String type, String message) {
        strategies.forEach(s -> s.notify(actorId, receiverId, type, message));
    }

}
