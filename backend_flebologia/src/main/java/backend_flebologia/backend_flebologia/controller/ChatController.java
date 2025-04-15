package backend_flebologia.backend_flebologia.controller;

import backend_flebologia.backend_flebologia.model.ChatMessage;
import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.service.ChatMessageService;
import backend_flebologia.backend_flebologia.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final PaymentService paymentService;
    private final ChatMessageService chatMessageService;

    @GetMapping
    public ResponseEntity<String> enterChat(@AuthenticationPrincipal User user) {
        if (paymentService.hasUserPaid(user)) {
            return ResponseEntity.ok("Bienvenido al chat con el Dr. Jorja");
        } else {
            return ResponseEntity.status(403).body("Debes pagar antes de acceder al chat");
        }
    }

    // 📨 Guardar mensaje (texto, audio, foto, video)
    @PostMapping
    public ResponseEntity<ChatMessage> enviarMensaje(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User user
    ) {
        if (!paymentService.hasUserPaid(user)) {
            return ResponseEntity.status(403).build();
        }

        String content = payload.get("content");
        String type = payload.get("type");       // TEXT, IMAGE, AUDIO, VIDEO
        String mediaUrl = payload.get("mediaUrl");

        ChatMessage savedMessage = chatMessageService.saveMessage(content, type, mediaUrl, user);
        return ResponseEntity.ok(savedMessage);
    }

    // 📩 Obtener mensajes del usuario
    @GetMapping("/mensajes")
    public ResponseEntity<List<ChatMessage>> getMensajes(@AuthenticationPrincipal User user) {
        if (!paymentService.hasUserPaid(user)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(chatMessageService.getMessagesForUser(user));
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam("type") String type,
            @RequestParam(value = "media", required = false) MultipartFile mediaFile
    ) {
        try {
            if (!paymentService.hasUserPaid(user)) {
                return ResponseEntity.status(403).body("Debes pagar para enviar mensajes.");
            }

            String mediaUrl = null;
            if (mediaFile != null && !mediaFile.isEmpty()) {
                // Lógica para guardar el archivo en disco o nube
                mediaUrl = chatMessageService.saveMediaFile(mediaFile); // lo vemos abajo
            }

            ChatMessage saved = chatMessageService.saveMessage(content, type, mediaUrl, user);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al enviar el mensaje: " + e.getMessage());
        }
    }

}
