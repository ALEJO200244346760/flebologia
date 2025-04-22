package backend_flebologia.backend_flebologia.controller;

import backend_flebologia.backend_flebologia.security.CustomUserDetails;
import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.dto.ProfileUpdateRequest;
import backend_flebologia.backend_flebologia.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MeController {

    private final UserService userService;

    // Obtener perfil del usuario autenticado
    @GetMapping
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        return ResponseEntity.ok(user);
    }

    // Actualizar perfil del usuario autenticado
    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest updateRequest,
                                           @AuthenticationPrincipal CustomUserDetails userDetails) {
        // Validamos que el usuario que está realizando la petición es el mismo que está actualizando el perfil
        User user = userDetails.getUser();
        user.setName(updateRequest.getName());
        user.setEmail(updateRequest.getEmail()); // Se puede agregar lógica para verificar que el email no esté duplicado
        userService.updateUser(user);
        return ResponseEntity.ok(user);
    }
}
