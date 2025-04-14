package backend_flebologia.backend_flebologia.controller;

import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.service.UserService;
import backend_flebologia.backend_flebologia.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final PaymentService paymentService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<String> enterChat(@AuthenticationPrincipal User user) {
        if (paymentService.hasUserPaid(user)) {
            return ResponseEntity.ok("Bienvenido al chat con el Dr. Jorja");
        } else {
            return ResponseEntity.status(403).body("Debes pagar antes de acceder al chat");
        }
    }
}
