package com.virtualwardrobe.backend.models.notification.facade.strategy;

import com.virtualwardrobe.backend.exceptions.UserException.InvalidUserException;
import com.virtualwardrobe.backend.models.user.User;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
public class EmailNotificationStrategy implements NotificationStrategy{

    private final JavaMailSender mailSender;

    @Autowired
    private  UserRepositorie userRepository;

    public EmailNotificationStrategy(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void notify(int actorId, int ReceiverId, String type, String description) {
        User receiver = userRepository.findById(ReceiverId)
                .orElseThrow(() -> new InvalidUserException("User not found"));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(receiver.getEmail());
        message.setSubject("Nueva notificación");
        message.setText("Tienes una nueva notificación" + "\n\n" + "Tipo: " + type + "\n" + "Descripción: " + description);

        mailSender.send(message);
    }
}
