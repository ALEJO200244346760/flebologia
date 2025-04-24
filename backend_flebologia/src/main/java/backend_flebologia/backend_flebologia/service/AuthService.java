package backend_flebologia.backend_flebologia.service;

import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.model.Role;
import backend_flebologia.backend_flebologia.repository.UserRepository;
import backend_flebologia.backend_flebologia.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String register(String name, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }

        User newUser = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.USER) // asignar rol por defecto
                .build();

        userRepository.save(newUser);

        // Generar token con información adicional
        return jwtUtil.generateToken(
                newUser.getEmail(),
                newUser.getRole().name(), // role como string
                newUser.getName(),
                "" // apellido vacío si no lo tenés en el modelo
        );
    }

    public String login(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        // Generar token con info adicional
        return jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getName(),
                "" // apellido vacío
        );
    }

    public User getUserFromToken(String token) {
        String email = jwtUtil.extractUsername(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
