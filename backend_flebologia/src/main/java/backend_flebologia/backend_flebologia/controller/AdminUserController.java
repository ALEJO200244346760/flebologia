package backend_flebologia.backend_flebologia.controller;

import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.repository.UserRepository;
import backend_flebologia.backend_flebologia.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminUserController {

    private final UserRepository userRepository;
    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<User>> listarUsuarios() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().body("Usuario eliminado");
    }

    @PostMapping("/{id}/revocar-pago")
    public ResponseEntity<?> revocarPago(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("No encontrado"));
        paymentService.revocarPago(user);
        return ResponseEntity.ok("Pago revocado");
    }
}
