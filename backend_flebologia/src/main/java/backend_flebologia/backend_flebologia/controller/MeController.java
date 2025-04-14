package backend_flebologia.backend_flebologia.controller;

import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.security.JwtUtil;
import backend_flebologia.backend_flebologia.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/me")
@RequiredArgsConstructor
public class MeController {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<User> getUserFromToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);

        return userService.getByEmail(email)
                .map(user -> {
                    user.setPassword(null); // por seguridad
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
