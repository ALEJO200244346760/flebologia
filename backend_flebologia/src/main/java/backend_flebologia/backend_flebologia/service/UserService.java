package backend_flebologia.backend_flebologia.service;

import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.model.Role;
import backend_flebologia.backend_flebologia.repository.UserRepository;
import backend_flebologia.backend_flebologia.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Registro de un nuevo usuario
    public String register(String name, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email ya registrado");
        }

        User newUser = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.USER)
                .build();

        userRepository.save(newUser);

        return jwtUtil.generateToken(
                newUser.getEmail(),
                newUser.getRole().name(),
                newUser.getName(),
                "" // Podés reemplazar "" por newUser.getApellido() si tenés campo apellido
        );
    }

    // Login de un usuario existente
    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getName(),
                "" // Podés reemplazar "" por user.getApellido() si lo usás
        );
    }

    // Obtener usuario por email
    public Optional<User> getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Actualizar los detalles del perfil de un usuario
    public void updateUser(User user) {
        userRepository.save(user); // Actualiza al usuario en la base de datos
    }
}
