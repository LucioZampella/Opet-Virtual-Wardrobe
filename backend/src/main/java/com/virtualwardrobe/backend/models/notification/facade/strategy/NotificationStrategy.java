package com.virtualwardrobe.backend.models.notification.facade.strategy;

public interface NotificationStrategy {
    void notify(int actorId, int ReceiverId, String description, String type);
}
