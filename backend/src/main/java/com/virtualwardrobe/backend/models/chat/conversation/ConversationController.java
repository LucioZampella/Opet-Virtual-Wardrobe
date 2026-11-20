package com.virtualwardrobe.backend.models.chat.conversation;

import com.virtualwardrobe.backend.models.chat.dto.ConversationResponseDTO;
import com.virtualwardrobe.backend.models.chat.dto.MessageResponseDTO;
import com.virtualwardrobe.backend.models.chat.dto.SendMessageDTO;
import com.virtualwardrobe.backend.models.chat.dto.StartConversationDTO;
import com.virtualwardrobe.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Mensajería entre comprador y vendedor. Todas las rutas requieren JWT (/api/** es authenticated)
// y el service valida que el usuario sea participante de la conversación.
@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private ConversationService service;

    // Inicia (o recupera) el chat con el vendedor desde una publicación.
    @PostMapping
    public ResponseEntity<ConversationResponseDTO> startConversation(
            @RequestBody @Valid StartConversationDTO dto,
            @RequestHeader("Authorization") String authHeader) {
        int userId = currentUserId(authHeader);
        return ResponseEntity.ok(service.startOrGet(dto.getListingId(), userId));
    }

    // Bandeja de entrada: mis chats, el más reciente primero.
    @GetMapping
    public ResponseEntity<List<ConversationResponseDTO>> getMyConversations(
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(service.getMyConversations(currentUserId(authHeader)));
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationResponseDTO> getConversation(
            @PathVariable int conversationId,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(service.getConversation(conversationId, currentUserId(authHeader)));
    }

    // Historial paginado. Ej: /api/conversations/5/messages?before=120&size=30
    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<List<MessageResponseDTO>> getMessages(
            @PathVariable int conversationId,
            @RequestParam(required = false) Integer before,
            @RequestParam(required = false) Integer size,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                service.getMessages(conversationId, currentUserId(authHeader), before, size));
    }

    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<MessageResponseDTO> sendMessage(
            @PathVariable int conversationId,
            @RequestBody @Valid SendMessageDTO dto,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                service.sendMessage(conversationId, currentUserId(authHeader), dto.getContent()));
    }

    @PatchMapping("/{conversationId}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable int conversationId,
            @RequestHeader("Authorization") String authHeader) {
        service.markAsRead(conversationId, currentUserId(authHeader));
        return ResponseEntity.ok().build();
    }

    private int currentUserId(String authHeader) {
        return jwtUtil.extraerUserId(authHeader.replace("Bearer ", ""));
    }
}
