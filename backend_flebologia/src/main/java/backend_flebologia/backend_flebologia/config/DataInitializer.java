package backend_flebologia.backend_flebologia.config;

import backend_flebologia.backend_flebologia.model.Role;
import backend_flebologia.backend_flebologia.model.User;
import backend_flebologia.backend_flebologia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        String email = "admin@flebologia.com";
        if (userRepository.findByEmail(email).isEmpty()) {
            User admin = User.builder()
                    .name("Admin")
                    .email(email)
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .hasPaid(true)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Admin creado: " + email);
        }
    }
}
