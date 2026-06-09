package com.virtualwardrobe.backend.models.webSocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/privado")
    public void processManage(@Payload ChatMesagge message){
         messagingTemplate.convertAndSendToUser(
                 String.valueOf(message.getReceiverId()),
                 "/messages",
                 message
         );
    }
}
