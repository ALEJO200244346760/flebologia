package backend_flebologia.backend_flebologia.controller;

import backend_flebologia.backend_flebologia.dto.ChatDTO;
import backend_flebologia.backend_flebologia.model.ChatMessage;
import backend_flebologia.backend_flebologia.model.Role;
import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.repository.UserRepository;
import backend_flebologia.backend_flebologia.security.CustomUserDetails;
import backend_flebologia.backend_flebologia.service.ChatMessageService;
import backend_flebologia.backend_flebologia.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<String> enterChat(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        if (paymentService.hasUserPaid(user)) {
            return ResponseEntity.ok("Bienvenido al chat con el Dr. Jorja");
        } else {
            return ResponseEntity.status(403).body("Debes pagar antes de acceder al chat");
        }
    }

    @PostMapping
    public ResponseEntity<ChatMessage> enviarMensaje(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = userDetails.getUser();

        if (!paymentService.hasUserPaid(user)) {
            return ResponseEntity.status(403).build();
        }

        String content = payload.get("content");
        String type = payload.get("type");
        String mediaUrl = payload.get("mediaUrl");

        // El destinatario por defecto es el administrador
        User admin = userRepository.findByEmail("admin@flebologia.com").orElseThrow();
        ChatMessage savedMessage = chatMessageService.saveMessage(content, type, mediaUrl, user, admin);
        return ResponseEntity.ok(savedMessage);
    }

    @GetMapping("/mensajes")
    public ResponseEntity<List<ChatMessage>> getMensajes(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();

        if (!paymentService.hasUserPaid(user)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(chatMessageService.getMessagesForUser(user));
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam("type") String type,
            @RequestParam(value = "media", required = false) MultipartFile mediaFile
    ) {
        try {
            User user = userDetails.getUser();

            if (!paymentService.hasUserPaid(user)) {
                return ResponseEntity.status(403).body("Debes pagar para enviar mensajes.");
            }

            String mediaUrl = null;
            if (mediaFile != null && !mediaFile.isEmpty()) {
                mediaUrl = chatMessageService.saveMediaFile(mediaFile);
            }

            // El administrador para el chat es el usuario con correo "admin@flebologia.com"
            User admin = userRepository.findByEmail("admin@flebologia.com").orElseThrow(() -> new RuntimeException("No se encontró el administrador"));

            ChatMessage saved = chatMessageService.saveMessage(
                    content, type, mediaUrl, user, admin
            );
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace(); // 👈 Loguear esto en producción
            return ResponseEntity.status(500).body("Error interno: " + e.getMessage());
        }
    }

    @GetMapping("/admin/usuarios")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> obtenerUsuariosConChat() {
        return ResponseEntity.ok(chatMessageService.obtenerUsuariosConMensajes());
    }

    @GetMapping("/admin/mensajes/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<ChatMessage>> verMensajesPaciente(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(chatMessageService.getMessagesForUser(user));
    }

    @PostMapping("/admin/enviar")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> enviarMensajeComoDoctor(
            @AuthenticationPrincipal CustomUserDetails admin,
            @RequestBody ChatDTO dto
    ) {
        User doctor = admin.getUser();
        User paciente = userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        ChatMessage msg = chatMessageService.saveMessage(
                dto.getContent(),
                dto.getType(),
                dto.getMediaUrl(),
                doctor,
                paciente
        );

        return ResponseEntity.ok(msg);
    }
}
