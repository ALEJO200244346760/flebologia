package backend_flebologia.backend_flebologia.controller;

import backend_flebologia.backend_flebologia.dto.LoginResponse;
import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.service.AuthService;
import backend_flebologia.backend_flebologia.dto.LoginRequest;
import backend_flebologia.backend_flebologia.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        String token = authService.login(request.getEmail(), request.getPassword());

        // Recuperar el usuario para incluir nombre y email
        User user = authService.getUserFromToken(token);

        LoginResponse loginResponse = new LoginResponse(token, user.getEmail(), user.getName());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String token = authService.register(request.getName(), request.getEmail(), request.getPassword());
        return ResponseEntity.ok().body(Map.of("token", token)); // ✅ igual aquí
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        User user = authService.getUserFromToken(token);
        return ResponseEntity.ok(user);
    }
}
