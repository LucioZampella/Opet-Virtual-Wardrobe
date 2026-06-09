package com.virtualwardrobe.backend.models.webSocket;

import lombok.Data;
import lombok.Setter;
import lombok.Getter;
@Getter
@Setter
@Data
public class ChatMesagge {

    private String message;
    private int senderId;
    private int receiverId;
}
