package com.virtualwardrobe.backend.models.chat.conversation;

import com.virtualwardrobe.backend.exceptions.ConversationException.ConversationAccessDeniedException;
import com.virtualwardrobe.backend.exceptions.ConversationException.ConversationNotFoundException;
import com.virtualwardrobe.backend.exceptions.ConversationException.InvalidConversationException;
import com.virtualwardrobe.backend.models.chat.dto.ConversationResponseDTO;
import com.virtualwardrobe.backend.models.chat.dto.MessageResponseDTO;
import com.virtualwardrobe.backend.models.chat.message.Message;
import com.virtualwardrobe.backend.models.chat.message.MessageRepositorie;
import com.virtualwardrobe.backend.models.notification.CRUD.Notification;
import com.virtualwardrobe.backend.models.notification.CRUD.NotificationRepositorie;
import com.virtualwardrobe.backend.models.store.storeListing.StoreListing;
import com.virtualwardrobe.backend.models.store.storeListing.StoreListingRepositorie;
import com.virtualwardrobe.backend.models.store.storeListing.StoreStatus;
import com.virtualwardrobe.backend.models.user.User;
import com.virtualwardrobe.backend.models.user.UserRepositorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ConversationService {

    public static final String CHAT_NOTIFICATION_TYPE = "CHAT_MESSAGE";
    private static final int DEFAULT_PAGE_SIZE = 30;
    private static final int MAX_PAGE_SIZE = 100;

    @Autowired
    private ConversationRepositorie conversationRepo;
    @Autowired
    private MessageRepositorie messageRepo;
    @Autowired
    private StoreListingRepositorie listingRepo;
    @Autowired
    private UserRepositorie userRepo;
    @Autowired
    private NotificationRepositorie notificationRepo;

    // ---------------------------------------------------------------------
    // Conversaciones
    // ---------------------------------------------------------------------

    // Devuelve la conversación del comprador para esa publicación, o la crea si no existe.
    @Transactional
    public ConversationResponseDTO startOrGet(int listingId, int buyerId) {
        Optional<Conversation> existing = conversationRepo.findByListingIdAndBuyerId(listingId, buyerId);
        if (existing.isPresent()) {
            return toDTO(existing.get(), buyerId);
        }

        StoreListing listing = listingRepo.findByListingId(listingId)
                .orElseThrow(() -> new ConversationNotFoundException("Error 404: Publicación no encontrada"));

        if (listing.getSellerId() == buyerId) {
            throw new InvalidConversationException("Error 400: No podés iniciar un chat con tu propia publicación");
        }
        if (listing.getStatus() != StoreStatus.ACTIVE) {
            throw new InvalidConversationException("Error 400: La publicación ya no está disponible");
        }

        Conversation c = new Conversation();
        c.setListingId(listingId);
        c.setBuyerId(buyerId);
        c.setSellerId(listing.getSellerId());
        c.setCreatedAt(LocalDateTime.now());
        conversationRepo.save(c);

        return toDTO(c, buyerId);
    }

    @Transactional(readOnly = true)
    public List<ConversationResponseDTO> getMyConversations(int userId) {
        List<Conversation> conversations = conversationRepo.findAllByParticipant(userId);

        // Traemos todos los "otros usuarios" de una sola vez para evitar una consulta por conversación.
        Set<Integer> otherIds = conversations.stream()
                .map(c -> c.getOtherParticipant(userId))
                .collect(Collectors.toSet());
        Map<Integer, User> users = userRepo.findAllById(otherIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        return conversations.stream()
                .map(c -> toDTO(c, userId, users.get(c.getOtherParticipant(userId))))
                .toList();
    }

    @Transactional(readOnly = true)
    public ConversationResponseDTO getConversation(int conversationId, int userId) {
        return toDTO(getAsParticipant(conversationId, userId), userId);
    }

    // ---------------------------------------------------------------------
    // Mensajes
    // ---------------------------------------------------------------------

    // Historial paginado, del más viejo al más nuevo. "beforeId" sirve para pedir mensajes más antiguos.
    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getMessages(int conversationId, int userId, Integer beforeId, Integer size) {
        getAsParticipant(conversationId, userId);

        int pageSize = (size == null || size <= 0) ? DEFAULT_PAGE_SIZE : Math.min(size, MAX_PAGE_SIZE);
        Pageable page = PageRequest.of(0, pageSize);

        List<Message> messages = (beforeId == null)
                ? messageRepo.findByConversationIdOrderByIdDesc(conversationId, page)
                : messageRepo.findByConversationIdAndIdLessThanOrderByIdDesc(conversationId, beforeId, page);

        List<MessageResponseDTO> result = new ArrayList<>(messages.stream().map(MessageResponseDTO::from).toList());
        Collections.reverse(result);
        return result;
    }

    @Transactional
    public MessageResponseDTO sendMessage(int conversationId, int senderId, String content) {
        Conversation c = getAsParticipant(conversationId, senderId);

        String text = content == null ? "" : content.trim();
        if (text.isEmpty()) {
            throw new InvalidConversationException("Error 400: El mensaje no puede estar vacío");
        }
        if (text.length() > Message.MAX_CONTENT_LENGTH) {
            throw new InvalidConversationException("Error 400: El mensaje no puede superar los 1000 caracteres");
        }

        LocalDateTime now = LocalDateTime.now();

        Message m = new Message();
        m.setConversationId(conversationId);
        m.setSenderId(senderId);
        m.setContent(text);
        m.setSentAt(now);
        messageRepo.save(m);

        c.setLastMessageAt(now);
        conversationRepo.save(c);

        notifyReceiver(c, senderId);

        // TODO (WebSocket): enviar el MessageResponseDTO a /user/{buyerId}/queue/messages
        //  y /user/{sellerId}/queue/messages con SimpMessagingTemplate.convertAndSendToUser.

        return MessageResponseDTO.from(m);
    }

    // Marca como leídos los mensajes que recibió el usuario y la notificación del chat.
    @Transactional
    public void markAsRead(int conversationId, int userId) {
        getAsParticipant(conversationId, userId);
        messageRepo.markAsRead(conversationId, userId, LocalDateTime.now());
        notificationRepo.markReadByUserIdAndTypeAndLink(userId, CHAT_NOTIFICATION_TYPE, chatLink(conversationId));
    }

    // ---------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------

    // Único punto de control de acceso: solo comprador y vendedor pueden ver la conversación.
    private Conversation getAsParticipant(int conversationId, int userId) {
        Conversation c = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException("Error 404: Conversación no encontrada"));
        if (!c.isParticipant(userId)) {
            throw new ConversationAccessDeniedException("Error 403: No tenés acceso a esta conversación");
        }
        return c;
    }

    public static String chatLink(int conversationId) {
        return "/chats/" + conversationId;
    }

    // Una sola notificación sin leer por conversación: si ya hay una, se actualiza en vez de crear otra.
    // Solo notificación en la app (sin mail) para no mandar un correo por cada mensaje.
    private void notifyReceiver(Conversation c, int senderId) {
        int receiverId = c.getOtherParticipant(senderId);
        String link = chatLink(c.getId());
        String clotheName = clotheName(c.getListingId());

        List<Notification> pending = notificationRepo
                .findUnreadByUserIdAndTypeAndLink(receiverId, CHAT_NOTIFICATION_TYPE, link);

        Notification n;
        if (pending.isEmpty()) {
            n = new Notification();
            n.setUser_id(receiverId);
            n.setType(CHAT_NOTIFICATION_TYPE);
            n.setLink(link);
            n.setAlready_read(false);
            n.setDescription(clotheName == null
                    ? "te envió un mensaje"
                    : "te envió un mensaje sobre \"" + clotheName + "\"");
        } else {
            n = pending.get(0);
            n.setDescription(clotheName == null
                    ? "te envió nuevos mensajes"
                    : "te envió nuevos mensajes sobre \"" + clotheName + "\"");
        }
        n.setActor_id(senderId);
        n.setDate(LocalDateTime.now());
        notificationRepo.save(n);

        // TODO (WebSocket): enviar la notificación a /user/{receiverId}/queue/notifications.
    }

    private ConversationResponseDTO toDTO(Conversation c, int currentUserId) {
        User other = userRepo.findById(c.getOtherParticipant(currentUserId)).orElse(null);
        return toDTO(c, currentUserId, other);
    }

    private ConversationResponseDTO toDTO(Conversation c, int currentUserId, User other) {
        ConversationResponseDTO dto = new ConversationResponseDTO();
        dto.setId(c.getId());
        dto.setBuyerId(c.getBuyerId());
        dto.setSellerId(c.getSellerId());
        dto.setCurrentUserIsSeller(c.getSellerId() == currentUserId);
        dto.setCreatedAt(c.getCreatedAt());
        dto.setLastMessageAt(c.getLastMessageAt());

        // Publicación: puede haber sido eliminada, en ese caso el chat se sigue mostrando.
        dto.setListingId(c.getListingId());
        StoreListing listing = listingRepo.findByListingId(c.getListingId()).orElse(null);
        if (listing != null) {
            dto.setPrice(listing.getPrice());
            dto.setListingStatus(listing.getStatus());
            dto.setListingAvailable(listing.getStatus() == StoreStatus.ACTIVE);
            if (listing.getClothe() != null) {
                dto.setClotheName(listing.getClothe().getName());
                dto.setClotheImageUrl(listing.getClothe().getImage_url());
            }
        }

        int otherId = c.getOtherParticipant(currentUserId);
        dto.setOtherUserId(otherId);
        if (other != null) {
            dto.setOtherUsername(other.getUsername());
            dto.setOtherAvatarUrl(other.getAvatar_url());
        }

        messageRepo.findFirstByConversationIdOrderByIdDesc(c.getId())
                .ifPresent(m -> dto.setLastMessage(MessageResponseDTO.from(m)));
        dto.setUnreadCount(messageRepo.countUnread(c.getId(), currentUserId));
        return dto;
    }

    // Se busca por id (y no por el proxy lazy) por si la publicación fue eliminada.
    private String clotheName(int listingId) {
        return listingRepo.findByListingId(listingId)
                .map(StoreListing::getClothe)
                .map(clothe -> clothe.getName())
                .orElse(null);
    }
}
